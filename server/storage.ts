import { users, packages, contacts, type User, type InsertUser, type Package, type InsertPackage, type Contact, type InsertContact } from "@shared/schema";
import fs from 'fs/promises';
import path from 'path';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Package methods
  getPackage(id: number): Promise<Package | undefined>;
  getPackageByTrackingNumber(trackingNumber: string): Promise<Package | undefined>;
  getAllPackages(): Promise<Package[]>;
  createPackage(packageData: InsertPackage): Promise<Package>;
  updatePackage(id: number, packageData: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: number): Promise<boolean>;

  // Contact methods
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
}

export class JSONStorage implements IStorage {
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(process.cwd(), 'server', 'db');
    this.ensureDbDirectory();
    this.initializeFiles();
  }

  private async ensureDbDirectory() {
    try {
      await fs.access(this.dbPath);
    } catch {
      await fs.mkdir(this.dbPath, { recursive: true });
    }
  }

  private async initializeFiles() {
    const files = [
      { name: 'users.json', data: [{ id: 1, username: 'admin', password: 'admin123' }] },
      { name: 'packages.json', data: [] },
      { name: 'contacts.json', data: [] }
    ];

    for (const file of files) {
      const filePath = path.join(this.dbPath, file.name);
      try {
        await fs.access(filePath);
      } catch {
        await fs.writeFile(filePath, JSON.stringify(file.data, null, 2));
      }
    }
  }

  private async readFile<T>(filename: string): Promise<T[]> {
    try {
      const filePath = path.join(this.dbPath, filename);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private async writeFile<T>(filename: string, data: T[]): Promise<void> {
    const filePath = path.join(this.dbPath, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  private generateTrackingNumber(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const users = await this.readFile<User>('users.json');
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.readFile<User>('users.json');
    return users.find(user => user.username === username);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const users = await this.readFile<User>('users.json');
    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const user: User = { ...userData, id };
    users.push(user);
    await this.writeFile('users.json', users);
    return user;
  }

  // Package methods
  async getPackage(id: number): Promise<Package | undefined> {
    const packages = await this.readFile<Package>('packages.json');
    return packages.find(pkg => pkg.id === id);
  }

  async getPackageByTrackingNumber(trackingNumber: string): Promise<Package | undefined> {
    const packages = await this.readFile<Package>('packages.json');
    return packages.find(pkg => pkg.trackingNumber === trackingNumber);
  }

  async getAllPackages(): Promise<Package[]> {
    return await this.readFile<Package>('packages.json');
  }

  async createPackage(packageData: InsertPackage): Promise<Package> {
    const packages = await this.readFile<Package>('packages.json');
    const id = packages.length > 0 ? Math.max(...packages.map(p => p.id)) + 1 : 1;
    
    let trackingNumber: string;
    do {
      trackingNumber = this.generateTrackingNumber();
    } while (packages.some(pkg => pkg.trackingNumber === trackingNumber));

    const now = new Date().toISOString();
    const newPackage: Package = {
      ...packageData,
      id,
      trackingNumber,
      createdAt: now,
      updatedAt: now,
    };

    packages.push(newPackage);
    await this.writeFile('packages.json', packages);
    return newPackage;
  }

  async updatePackage(id: number, packageData: Partial<InsertPackage>): Promise<Package | undefined> {
    const packages = await this.readFile<Package>('packages.json');
    const index = packages.findIndex(pkg => pkg.id === id);
    
    if (index === -1) return undefined;

    packages[index] = {
      ...packages[index],
      ...packageData,
      updatedAt: new Date().toISOString(),
    };

    await this.writeFile('packages.json', packages);
    return packages[index];
  }

  async deletePackage(id: number): Promise<boolean> {
    const packages = await this.readFile<Package>('packages.json');
    const index = packages.findIndex(pkg => pkg.id === id);
    
    if (index === -1) return false;

    packages.splice(index, 1);
    await this.writeFile('packages.json', packages);
    return true;
  }

  // Contact methods
  async createContact(contactData: InsertContact): Promise<Contact> {
    const contacts = await this.readFile<Contact>('contacts.json');
    const id = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    const contact: Contact = {
      ...contactData,
      id,
      createdAt: new Date().toISOString(),
    };
    contacts.push(contact);
    await this.writeFile('contacts.json', contacts);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await this.readFile<Contact>('contacts.json');
  }
}

export const storage = new JSONStorage();
