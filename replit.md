# MDRRMO Disaster Hub

## Overview

The MDRRMO Disaster Hub is a mobile-first progressive web application designed for the Municipal Disaster Risk Reduction and Management Office (MDRRMO) of Pio Duran, Albay. The application serves as a comprehensive disaster preparedness and response platform, enabling citizens to report incidents, access emergency resources, check evacuation plans, prepare go-bags, view weather outlooks, and access learning materials. The system prioritizes accessibility, simplicity, and rapid incident reporting during emergencies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool and development server.

**Routing**: Wouter for lightweight client-side routing without the overhead of React Router.

**UI Component Library**: shadcn/ui (New York style variant) built on Radix UI primitives, providing accessible, customizable components following a design system approach.

**Styling**: TailwindCSS v4 with custom theme configuration including brand colors (blue, yellow, red) extracted from the MDRRMO branding. Custom fonts include Inter for body text and Oswald for display/headings.

**State Management**: TanStack Query (React Query) v5 for server state management, caching, and synchronization. No global client state library is used; component-level state with hooks suffices for UI interactions.

**Form Handling**: React Hook Form with Zod resolvers for type-safe form validation.

**Design Pattern**: The application follows a mobile-first, component-driven architecture with clear separation between pages, reusable UI components, and shared utilities. Pages are organized by feature (incident reporting, evacuation planning, go-bag checklist, etc.).

### Backend Architecture

**Runtime**: Node.js with Express.js serving both API routes and static assets in production.

**Development Mode**: Uses Vite's middleware mode for hot module replacement and development server integration. The Express server runs alongside Vite during development.

**Production Mode**: Pre-built static assets are served from the `dist/public` directory. The backend is bundled using esbuild into a single ESM output file.

**API Design**: RESTful JSON API with routes prefixed by `/api`. Endpoints follow resource-based naming conventions (e.g., `/api/incidents`, `/api/go-bag-items`, `/api/evacuation-centers`).

**Session Management**: Uses `connect-pg-simple` for PostgreSQL-backed session storage (prepared for authentication, though not currently implemented).

**Logging**: Custom logging middleware captures request/response details with timestamps for debugging and monitoring.

### Data Storage

**Database**: PostgreSQL accessed via Neon's serverless driver (`@neondatabase/serverless`).

**ORM**: Drizzle ORM v0.39+ with Drizzle Kit for schema management and migrations. The schema is defined in TypeScript and shared between client and server.

**Database Schema**:
- **users**: Stores user credentials (id, username, password). Not actively used but scaffolded for future authentication.
- **incidents**: Stores incident reports with fields for type, description, location (text, latitude, longitude), anonymous flag, and timestamp.
- **goBagItems**: Categorized checklist items for emergency go-bag preparation with a checked status.
- **evacuationCenters**: Stores evacuation center information including name, distance, capacity, status, and coordinates.

**Validation**: Drizzle-Zod integration generates Zod schemas from database schema definitions, ensuring type safety across the stack.

**Data Initialization**: The storage layer includes initialization methods to seed default go-bag items and evacuation centers on application startup.

### External Dependencies

**Database Service**: Neon Serverless PostgreSQL (connection string via `DATABASE_URL` environment variable).

**UI Component Libraries**: 
- Radix UI primitives (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, drawer, popover, progress, select, switch, tabs, toast, tooltip, etc.)
- Vaul for drawer/bottom-sheet components
- cmdk for command palette functionality
- Embla Carousel for carousel components

**Utility Libraries**:
- date-fns for date formatting and manipulation
- nanoid for generating unique identifiers
- clsx and tailwind-merge for conditional className composition
- class-variance-authority (CVA) for variant-based component styling

**Development Tools**:
- Replit-specific Vite plugins (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner) for enhanced development experience
- Custom Vite plugin (`vite-plugin-meta-images`) for dynamically updating OpenGraph meta tags based on Replit deployment URLs

**Deployment Platform**: Designed for Replit deployment with specific environment variable handling (`REPL_ID`, deployment URL detection).

**Fonts**: Google Fonts (Inter and Oswald) loaded via CDN in the HTML template.