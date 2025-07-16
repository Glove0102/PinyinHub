# PinyinHub - Chinese Song Learning Platform

## Overview

PinyinHub is a full-stack web application that helps users learn Chinese through music by providing song lyrics with pinyin transliteration and English translations. The platform allows anonymous browsing and requires user registration for content contribution.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Components**: Radix UI primitives for accessible components
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API**: RESTful API with session-based authentication
- **Authentication**: Passport.js with local strategy and bcrypt for password hashing
- **Session Management**: Express sessions with PostgreSQL store

### Database Architecture
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with migrations
- **Schema**: Users and songs tables with foreign key relationships

## Key Components

### Authentication System
- Session-based authentication using Passport.js
- Password hashing with Node.js crypto scrypt
- Protected routes for content creation
- Role-based access (admin functionality for specific users)

### Song Management
- CRUD operations for songs with metadata
- AI-powered content processing via OpenAI GPT-4 Mini
- Automatic generation of pinyin transliteration and English translations
- Support for bilingual titles and artist names
- Media link integration (YouTube, Spotify)

### Content Processing Pipeline
- Chinese text to simplified conversion
- Pinyin generation with tone marks
- English translation generation
- Bidirectional translation for artist names

### SEO Optimization
- Static HTML generation for individual songs
- Open Graph meta tags for social media sharing
- Structured data markup for search engines
- Dynamic meta tag updates for SPA routes

## Data Flow

1. **Content Creation**: Users submit Chinese lyrics → OpenAI API processes text → System stores original, simplified, pinyin, and English versions
2. **Content Display**: Users browse songs → System serves processed content in tabbed interface (Original/Pinyin/English)
3. **Search**: Users query songs → System searches across titles, artists, and content
4. **SEO**: Admin triggers HTML generation → System creates static pages for search engine indexing

## External Dependencies

### Core Services
- **Neon Database**: PostgreSQL hosting
- **OpenAI API**: Text processing and translation services

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Frontend build tool and dev server
- **ESBuild**: Backend bundling for production
- **TypeScript**: Type safety across the stack

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- TSX for backend development with auto-restart
- Shared TypeScript configuration for consistency

### Production Build
- Frontend: Vite build → static assets
- Backend: ESBuild → single bundled file
- Database: Drizzle migrations for schema management

### Environment Configuration
- Database URL for Neon connection
- OpenAI API key for content processing
- Session secret for authentication security

### File Structure
- `/client` - React frontend application
- `/server` - Express backend with API routes
- `/shared` - Common TypeScript schemas and types
- `/public` - Static assets and generated SEO pages
- `/migrations` - Database migration files

The application follows a monorepo structure with clear separation between frontend, backend, and shared code, enabling efficient development and deployment while maintaining type safety across the entire stack.