# CONST3LLATION

**CONST3LLATION** is a comprehensive Web3 service provider marketplace that connects blockchain projects with vetted agencies and service providers. The platform offers a curated directory of trusted partners across various Web3 service categories including marketing, development, legal, accounting, and more.

## 🚀 Features

### Core Platform
- **Service Provider Directory**: Browse and discover vetted Web3 service providers
- **Advanced Search & Filtering**: Find providers by service category, location, budget, and expertise
- **Provider Profiles**: Detailed profiles with case studies, team information, and service offerings
- **Reviews & Ratings**: Transparent feedback system for service providers
- **Global Search**: Comprehensive search across all platform content

### Content & Communication
- **Blog System**: Content management with categorization and search
- **Help Center**: Knowledge base and support documentation
- **Contact & Messaging**: Direct communication between clients and providers
- **Newsletter**: Email subscription and marketing campaigns

### Provider Management
- **Registration System**: Multi-step provider onboarding with verification
- **File Uploads**: Support for case studies, portfolios, and documentation
- **Profile Verification**: Admin review and approval process
- **Analytics**: Provider performance tracking and reviews management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI**: React 19, TypeScript, Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query for server state
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **CMS**: PayloadCMS 3.x (Headless CMS)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Storage**: AWS S3 with presigned URLs
- **Email**: Postmark with template system
- **Rate Limiting**: Redis-based rate limiting

### Development Tools
- **Linting**: Biome (ESLint + Prettier replacement)
- **Testing**: Vitest with React Testing Library
- **Type Checking**: TypeScript with strict configuration
- **Containerization**: Docker Compose for development

## 📁 Project Structure

The project follows a **feature-based modular architecture** inspired by bulletproof-react:

```
src/
├── app/                    # Next.js App Router
│   ├── (payload)/         # PayloadCMS admin interface
│   ├── (web)/             # Public website routes
│   └── api/               # API route handlers
├── components/             # Shared UI components
├── features/              # Feature-based modules
│   ├── service-providers/ # Provider management
│   ├── blog/             # Content management
│   ├── explore/          # Search & discovery
│   ├── contact/          # Communication
│   └── ...               # Other features
├── config/               # Configuration files
├── hooks/                # Shared React hooks
├── lib/                  # External service integrations
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

### Feature Architecture
Each feature module contains:
- `api/` - Backend collections and endpoints
- `components/` - Feature-specific UI components
- `hooks/` - Custom hooks for the feature
- `services/` - Business logic and data access
- `schemas/` - Zod validation schemas
- `types/` - TypeScript definitions

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Environment variables (see `.env.example`)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd const3llation
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development environment**
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d
   
   # Start the development server
   npm run dev
   ```

4. **Database setup**
   ```bash
   # Run database migrations
   npm run payload migrate
   
   # Seed initial data (optional)
   npm run db:seed
   ```

5. **Access the application**
   - Website: [http://localhost:3000](http://localhost:3000)
   - Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

### Environment Variables

Rename `.env.example` into `.env` file with the required environment variables

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run Biome linter and formatter
- `npm run check:types` - TypeScript type checking
- `npm run test` - Run test suite
- `npm run db:seed` - Seed database with sample data
- `npm run payload` - PayloadCMS CLI commands

## 📚 Documentation

For detailed technical documentation, see:

- **[Database Schema](docs/database-schema.md)** - PayloadCMS collections, relationships, and business logic
- **[File Upload System](docs/file-uploads.md)** - Complete guide to Cloudflare R2 multipart uploads, security, and integration
- **[Rate Limiting System](docs/rate-limiting.md)** - Redis-based rate limiting, security features, and API protection

## 🏗️ Architecture Principles

### Feature-Based Organization
- **Modularity**: Each feature is self-contained with its own components, hooks, and services
- **Scalability**: Easy to add new features without affecting existing ones
- **Maintainability**: Clear separation of concerns and consistent patterns

### Code Quality
- **TypeScript**: Strict type checking for runtime safety
- **Validation**: Zod schemas for runtime data validation
- **Testing**: Comprehensive test coverage with Vitest
- **Performance**: Optimized builds and efficient data fetching

### Security & Performance
- **Rate Limiting**: Redis-based API protection
- **File Security**: Secure file upload handling with validation
- **Caching**: Strategic caching with TanStack Query
- **SEO**: Server-side rendering and metadata optimization

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the project's coding standards
4. Run tests and ensure they pass (`npm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request
