# Political Violence Tracker Dashboard

## Overview

This is a full-stack web application for tracking and analyzing political violence incidents in Bangladesh. The system uses a modern tech stack with React frontend, Express backend, and PostgreSQL database with Drizzle ORM. It features real-time data visualization, filtering capabilities, and AI-powered analysis of incidents.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints with JSON responses

### Data Storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Centralized in `shared/schema.ts` for type sharing
- **Migrations**: Database schema versioning with Drizzle Kit
- **Storage Layer**: PostgreSQL database with Drizzle ORM (previously in-memory for development)
- **Database**: PostgreSQL via Neon Database with environment variables configured

## Key Components

### Database Schema
- **Incidents Table**: Core entity storing political violence incidents with fields for location, casualties, severity, AI analysis, and metadata
- **News Sources Table**: Tracks data sources with reliability metrics and crawling status
- **Coordinates**: JSON field for geographic data (latitude/longitude)
- **AI Analysis**: JSON field containing confidence scores, extracted entities, and sentiment analysis

### API Endpoints
- `GET /api/incidents` - Paginated incidents with filtering
- `GET /api/incidents/:id` - Single incident details
- `GET /api/statistics` - Dashboard metrics and aggregations
- `GET /api/charts` - Chart data for visualizations

### Frontend Components
- **Dashboard**: Main application view with metrics, charts, and incident list
- **Filters Sidebar**: Advanced filtering interface for incidents
- **Incident Cards**: Display individual incidents with severity indicators
- **Charts**: Data visualization using Recharts library
- **Map Component**: Geographic visualization of incidents (placeholder implementation)

### UI System
- **Design System**: shadcn/ui components with consistent theming
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Internationalization**: Support for Bengali and English languages
- **Dark Mode**: Theme switching capabilities

## Data Flow

1. **Data Ingestion**: News sources are crawled and processed (simulated with mock data)
2. **AI Processing**: Incidents undergo AI analysis for confidence scoring and entity extraction
3. **Database Storage**: Processed incidents stored in PostgreSQL with geographic and metadata
4. **API Layer**: Express routes provide filtered and aggregated data
5. **Frontend Display**: React components render dashboard with real-time updates
6. **User Interaction**: Filtering, sorting, and detailed views of incidents

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **recharts**: Chart visualization library
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **ESLint/Prettier**: Code quality and formatting
- **Drizzle Kit**: Database migration tool

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Database**: Neon Database connection via environment variables
- **Asset Serving**: Static files served through Vite middleware

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Database**: Production PostgreSQL via DATABASE_URL environment variable

### Environment Configuration
- **Environment Variables**: DATABASE_URL for database connection
- **Build Scripts**: Separate dev/build/start commands
- **Process Management**: Single Node.js process serving both frontend and API

### Key Architectural Decisions

1. **Monorepo Structure**: Frontend, backend, and shared types in single repository for easier development
2. **Shared Schema**: TypeScript types shared between frontend and backend using Drizzle schema
3. **Memory Storage**: Development uses in-memory storage with interface for easy production database integration
4. **Component Architecture**: Modular React components with clear separation of concerns
5. **Type Safety**: Full TypeScript coverage from database to frontend
6. **Responsive Design**: Mobile-first approach with progressive enhancement