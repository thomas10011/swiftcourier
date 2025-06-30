import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPackageSchema, insertContactSchema } from "@shared/schema";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
});

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    isAdmin?: boolean;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'courier-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Public tracking API
  app.get('/api/track/:trackingNumber', async (req, res) => {
    try {
      const { trackingNumber } = req.params;
      const packageData = await storage.getPackageByTrackingNumber(trackingNumber.toUpperCase());
      
      if (!packageData) {
        return res.status(404).json({ message: 'Package not found' });
      }

      res.json(packageData);
    } catch (error) {
      console.error('Tracking error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json({ message: 'Contact form submitted successfully', id: contact.id });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(400).json({ message: 'Invalid contact form data' });
    }
  });

  // Admin authentication middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ message: 'Admin authentication required' });
    }
    next();
  };

  // Admin login
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }

      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      req.session.userId = user.id;
      req.session.isAdmin = true;
      
      res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Admin logout
  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logout successful' });
    });
  });

  // Check admin session
  app.get('/api/admin/session', (req, res) => {
    if (req.session.isAdmin) {
      res.json({ isAdmin: true });
    } else {
      res.status(401).json({ isAdmin: false });
    }
  });

  // Admin package management
  app.get('/api/admin/packages', requireAdmin, async (req, res) => {
    try {
      const packages = await storage.getAllPackages();
      res.json(packages);
    } catch (error) {
      console.error('Get packages error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/admin/packages', requireAdmin, upload.single('photo'), async (req, res) => {
    try {
      const packageData = insertPackageSchema.parse({
        ...req.body,
        currentLocation: {
          address: req.body.currentLocationAddress,
          lat: parseFloat(req.body.currentLocationLat),
          lng: parseFloat(req.body.currentLocationLng),
        },
        packageDetails: {
          type: req.body.packageType,
          weight: req.body.packageWeight,
          height: req.body.packageHeight,
          color: req.body.packageColor,
        },
      });

      const newPackage = await storage.createPackage(packageData);
      
      // Handle file upload if present
      if (req.file) {
        const fileExtension = path.extname(req.file.originalname);
        const newFilename = `${newPackage.trackingNumber}${fileExtension}`;
        const newPath = path.join(uploadDir, newFilename);
        
        fs.renameSync(req.file.path, newPath);
        
        // Update package with photo filename
        await storage.updatePackage(newPackage.id, { 
          ...packageData,
          photo: newFilename 
        } as any);
        
        const updatedPackage = await storage.getPackage(newPackage.id);
        res.status(201).json(updatedPackage);
      } else {
        res.status(201).json(newPackage);
      }
    } catch (error) {
      console.error('Create package error:', error);
      res.status(400).json({ message: 'Invalid package data' });
    }
  });

  app.put('/api/admin/packages/:id', requireAdmin, upload.single('photo'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const packageData = insertPackageSchema.partial().parse({
        ...req.body,
        currentLocation: req.body.currentLocationAddress ? {
          address: req.body.currentLocationAddress,
          lat: parseFloat(req.body.currentLocationLat),
          lng: parseFloat(req.body.currentLocationLng),
        } : undefined,
        packageDetails: req.body.packageType ? {
          type: req.body.packageType,
          weight: req.body.packageWeight,
          height: req.body.packageHeight,
          color: req.body.packageColor,
        } : undefined,
      });

      // Handle file upload if present
      if (req.file) {
        const existingPackage = await storage.getPackage(id);
        if (existingPackage) {
          const fileExtension = path.extname(req.file.originalname);
          const newFilename = `${existingPackage.trackingNumber}${fileExtension}`;
          const newPath = path.join(uploadDir, newFilename);
          
          fs.renameSync(req.file.path, newPath);
          (packageData as any).photo = newFilename;
        }
      }

      const updatedPackage = await storage.updatePackage(id, packageData as any);
      
      if (!updatedPackage) {
        return res.status(404).json({ message: 'Package not found' });
      }

      res.json(updatedPackage);
    } catch (error) {
      console.error('Update package error:', error);
      res.status(400).json({ message: 'Invalid package data' });
    }
  });

  app.delete('/api/admin/packages/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePackage(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Package not found' });
      }

      res.json({ message: 'Package deleted successfully' });
    } catch (error) {
      console.error('Delete package error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Admin contacts
  app.get('/api/admin/contacts', requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
