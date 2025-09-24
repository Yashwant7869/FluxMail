# Overview

BulkMail Pro is a comprehensive email marketing platform built with React and Express.js. The application enables users to create and manage email campaigns, import contacts from Google Sheets, and send bulk emails using SendGrid. It features a modern dashboard for tracking campaign performance with metrics like open rates, click rates, and bounce rates.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming support
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod for runtime type checking and validation
- **Storage Layer**: Abstracted storage interface with in-memory implementation (designed for database integration)
- **API Design**: RESTful endpoints with JSON responses and proper error handling

## Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle with Neon serverless database
- **Schema**: Well-defined tables for users, campaigns, contacts, email templates, and campaign tracking
- **Migrations**: Drizzle Kit for database schema migrations and management
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL storage
- **User System**: Basic user authentication with username/password
- **Security**: Environment-based configuration for sensitive credentials

## External Dependencies

### Third-Party Services
- **SendGrid**: Email delivery service for sending bulk campaigns and individual emails
- **Google Sheets API**: Integration for importing contact lists from spreadsheets
- **Neon Database**: Serverless PostgreSQL hosting for production deployment

### Development Tools
- **Replit Integration**: Development environment plugins for runtime error handling and debugging
- **ESBuild**: Server-side code bundling for production deployment
- **TypeScript**: Full-stack type safety with shared schema definitions

### UI and Styling
- **Font Awesome**: Icon library for consistent iconography
- **Google Fonts**: Custom typography with DM Sans, Fira Code, and Geist Mono
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Tailwind CSS**: Utility-first styling with custom design system tokens

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and production-ready integrations for email marketing functionality.