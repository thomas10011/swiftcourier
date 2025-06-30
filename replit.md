# Replit.md - SwiftCourier Tracking System

## Overview

SwiftCourier is a full-stack courier tracking system built with React, TypeScript, Express.js, and a JSON-based file storage system. The application provides a public-facing interface for package tracking and a private admin dashboard for package management. The system integrates Google Maps API for location visualization and uses shadcn/ui components for a modern user interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with middleware for logging, sessions, and file uploads
- **Session Management**: Express-session with custom session store
- **File Upload**: Multer for handling package images
- **API Design**: RESTful endpoints with proper error handling
- **Development**: Custom Vite integration for hot reloading

### Data Storage Solution
- **Database**: JSON file-based storage system (no external database required)
- **Storage Implementation**: Custom JSONStorage class implementing IStorage interface
- **Data Models**: Three main entities - Users, Packages, and Contacts
- **File Structure**: Separate JSON files for each entity type in server/db/
- **Data Persistence**: File system operations with proper error handling

## Key Components

### Public Interface
- **Homepage**: Hero section with quick tracking functionality
- **Package Tracking**: Detailed tracking interface with Google Maps integration
- **Contact Form**: Lead generation with form validation
- **About/Services**: Company information and service offerings

### Admin Dashboard
- **Authentication**: Session-based login system
- **Package Management**: CRUD operations for package data
- **File Upload**: Image upload functionality for package photos
- **Real-time Updates**: Automatic data refresh using React Query

### Shared Components
- **Schema Validation**: Zod schemas for type-safe data validation
- **UI Components**: Reusable components built on shadcn/ui
- **Utility Functions**: Helper functions for formatting and styling

## Data Flow

1. **Public Tracking Flow**:
   - User enters tracking number
   - Frontend sends GET request to `/api/track/:trackingNumber`
   - Backend queries JSON storage for package data
   - Response includes package details and location coordinates
   - Frontend displays results with Google Maps integration

2. **Admin Management Flow**:
   - Admin authenticates via `/api/admin/login`
   - Session established with admin privileges
   - CRUD operations on packages via `/api/admin/packages`
   - File uploads handled via multipart form data
   - Real-time updates pushed to admin interface

3. **Contact Form Flow**:
   - User submits contact form
   - Data validated using Zod schemas
   - Contact information stored in JSON file
   - Success confirmation sent to user

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Libraries**: Radix UI primitives, Lucide React icons
- **Form Handling**: React Hook Form, Hookform Resolvers
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS, Class Variance Authority
- **Routing**: Wouter for lightweight routing

### Backend Dependencies
- **Express.js**: Web framework with middleware support
- **Multer**: File upload handling
- **Express-session**: Session management
- **Date-fns**: Date manipulation utilities

### Development Tools
- **Vite**: Build tool with React plugin
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast bundling for production
- **TSX**: TypeScript execution for development

### Third-party Services
- **Google Maps API**: Location visualization and mapping
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Inter font family for typography

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server with proxy
- **File Watching**: Automatic server restart with TSX
- **Error Handling**: Runtime error overlay for debugging
- **Logging**: Request/response logging middleware

### Production Build
- **Frontend**: Vite build process generating optimized static assets
- **Backend**: ESBuild bundling server code for Node.js
- **Asset Handling**: Static file serving for uploads and public assets
- **Environment Variables**: Configuration through process.env

### File Storage Structure
```
server/
├── db/
│   ├── users.json     # Admin user credentials
│   ├── packages.json  # Package tracking data
│   └── contacts.json  # Contact form submissions
└── uploads/           # Package photos and attachments
```

## Changelog

```
Changelog:
- June 29, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```