import { z } from "zod";

// User schema for admin authentication
export const users = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
});

export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof users>;

// Package schema for tracking system
export const packages = z.object({
  id: z.number(),
  trackingNumber: z.string(),
  status: z.enum(['On Hold', 'In Transit', 'Held by Customs', 'Out for Delivery', 'Delivered']),
  sender: z.object({
    name: z.string(),
    address: z.string(),
  }),
  receiver: z.object({
    name: z.string(),
    address: z.string(),
  }),
  currentLocation: z.object({
    address: z.string(),
    lat: z.number(),
    lng: z.number(),
  }),
  packageDetails: z.object({
    type: z.string(),
    weight: z.string(),
    height: z.string(),
    color: z.string(),
  }),
  adminNotes: z.string(),
  photo: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertPackageSchema = z.object({
  status: z.enum(['On Hold', 'In Transit', 'Held by Customs', 'Out for Delivery', 'Delivered']),
  sender: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
  }),
  receiver: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
  }),
  currentLocation: z.object({
    address: z.string().min(1),
    lat: z.number(),
    lng: z.number(),
  }),
  packageDetails: z.object({
    type: z.string().min(1),
    weight: z.string().min(1),
    height: z.string().min(1),
    color: z.string().min(1),
  }),
  adminNotes: z.string(),
});

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = z.infer<typeof packages>;

// Contact form schema
export const contacts = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  serviceInterest: z.string(),
  message: z.string(),
  createdAt: z.string(),
});

export const insertContactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  serviceInterest: z.string().min(1),
  message: z.string().min(1),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = z.infer<typeof contacts>;
