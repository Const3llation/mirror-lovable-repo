# 📊 Database Schema & Entity Relationships

This document provides a comprehensive overview of the PayloadCMS collections that form the database schema for the CONST3LLATION Web3 service provider marketplace.

## 🏗️ Core Entity Overview

The platform is built around **Service Providers** as the central entity, with supporting systems for content management, user interactions, file storage, and verification workflows.

### **Primary Entities:**
- **Service Providers**: Core marketplace entities
- **Categories & Sub-Categories**: Service classification system
- **Reviews & Contacts**: User interaction with providers
- **File Management**: Document and image storage
- **Content System**: Blog, pages, and help center

## 🎯 Core Collections

### **SERVICE_PROVIDERS**
**Purpose**: Central entity representing Web3 service providers in the marketplace

**Key Fields:**
- `providerName` (UK) - Company name, unique identifier
- `slug` (UK) - URL-friendly identifier, auto-generated
- `email` (UK) - Primary contact email
- `providerShortDescription` - Brief company summary
- `providerDescription` - Detailed company information
- `websiteUrl` - Company website
- `minimumBudget` - Minimum project budget range
- `reviewsCount` / `reviewsAverage` - Calculated review metrics
- `registrationProcessStatus` - Registration workflow state

**Business Logic:**
```typescript
// Complex nested data structures
{
  socialMediaLinks: {
    linkedin: string,
    twitter: string, 
    youtube: string,
    // ... other platforms
  },
  addresses: [{
    addressType: "Headquarters" | "Branch",
    streetAddress1: string,
    city: string,
    country: string,
    // ...
  }],
  caseStudies: [{
    clientName: string,
    title: string,
    budget: string,
    timeline: string,
    files: FileUpload[],
    images: ImageUpload[]
  }],
  teamMembers: TeamMember[],
  visibility: {
    featured: "Yes" | "No",
    status: "Verified" | "Unverified", 
    published: "Yes" | "No",
    waitingForModeration: "Yes" | "No"
  }
}
```

### **CATEGORIES & SUB_CATEGORIES**
**Purpose**: Hierarchical service classification system

**Categories:**
- `name` - Service category name (e.g., "Marketing", "Development")
- `slug` - URL identifier
- `icon` - Display icon identifier
- `description` - Rich text category description

**Sub-Categories:**
- `name` - Specific service name
- `slug` - URL identifier  
- `parentCategory` (FK) - Belongs to one category

**Relationship Pattern:**
```
Marketing (Category)
├── Content Marketing (SubCategory)
├── Social Media (SubCategory)
└── Influencer Marketing (SubCategory)

Development (Category)  
├── Smart Contracts (SubCategory)
├── Frontend Development (SubCategory)
└── Mobile Apps (SubCategory)
```

### **PROVIDER_REVIEWS**
**Purpose**: Customer reviews and ratings for service providers

**Key Fields:**
- `serviceProvider` (FK) - Links to provider
- Contact details (`firstName`, `lastName`, `email`, `phoneNumber`)
- Project information in nested `project` group:
  - `description` - Project details
  - `budget` / `timeline` - Project scope
  - `services` - Related categories/subcategories
  - `file` - Supporting documentation
- Review details in nested `review` group:
  - `rating` (1-5) - Numerical rating
  - `review` - Written feedback
- Cashback information in nested `cashback` group:
  - `crypto` - Cryptocurrency type (BSC/ERC-20)
  - `walletAddress` - Payment address

### **PROVIDER_CONTACTS** 
**Purpose**: Contact requests from potential clients to providers

**Key Fields:**
- Similar structure to reviews but for initial contact
- `additionalDescription` - Extra project requirements
- `status` - "pending" | "completed"
- `completedAt` - Completion timestamp

## 📁 File Management System

### **Three-Tier File Architecture:**

#### **FILE_UPLOADS**
- Traditional PayloadCMS file uploads
- Stored locally or basic cloud storage
- Includes metadata (`filename`, `mimeType`, `filesize`)

#### **IMAGE_UPLOADS** 
- Specialized for images with processing
- Additional fields (`width`, `height`)
- Automatic image optimization

#### **REMOTE_FILE_UPLOADS**
- **Cloudflare R2** cloud storage integration
- `type` - "image" | "document" 
- `remoteURL` - Cloud storage path
- Supports the advanced multipart upload system

### **File Assignment Patterns:**
```typescript
// Service provider logo
ServiceProvider.logo -> ImageUploads | RemoteFileUploads

// Case study files
ServiceProvider.caseStudies[].files[] -> FileUploads | RemoteFileUploads
ServiceProvider.caseStudies[].images[] -> ImageUploads | RemoteFileUploads

// Review/Contact files
ProviderReviews.project.file -> FileUploads | ImageUploads | RemoteFileUploads
ProviderContacts.project.file -> FileUploads | ImageUploads | RemoteFileUploads
```

## 🔐 Verification System

### **VERIFY_PROVIDERS**
**Purpose**: Provider identity verification workflow

**Process Flow:**
1. Provider submits verification request
2. Admin reviews request in CMS
3. Status changes: "Pending" → "Approved" | "Rejected"  
4. **Webhook**: Approved requests auto-update `ServiceProvider.visibility.status = "Verified"`

### **VERIFY_PROVIDERS_EMAIL**
**Purpose**: Email verification for provider registration

**Security Features:**
- 5-digit verification codes
- Attempt tracking and limits
- Expiration timestamps
- Status management ("Pending", "Verified", "Expired")

## 📝 Content Management

### **BLOG & BLOG_CATEGORIES**
**Purpose**: Content marketing and SEO blog system

**Features:**
- Rich text content with **Lexical Editor**
- Featured images
- Category classification
- Related posts (self-referential many-to-many)
- HTML compilation for performance
- SEO-friendly slugs

### **PAGES**
**Purpose**: Static content pages (Privacy Policy, Terms, etc.)

### **HELP_CENTER_ITEMS** 
**Purpose**: Customer support knowledge base

## 👥 User Management

### **USERS**
**Purpose**: Admin and staff authentication

**Roles & Permissions:**
- Admin access to all collections
- Role-based field visibility
- Secure password handling

### **TEAM_MEMBERS**
**Purpose**: Company team display on About page

## 🔍 Search & Discovery

### **SEARCH**
**Purpose**: Optimized search index for service providers

**Indexed Fields:**
- `searchableText` - Full-text search content
- `region` / `country` - Geographic filtering
- `categories` / `subCategories` - Service filtering  
- `minimumBudget` - Budget range filtering
- `reviewsAverage` - Quality filtering
- `status` - Verification filtering

**Integration**: 
- Auto-syncs with ServiceProviders collection
- Powers global search and explore filtering
- Supports advanced search queries

## 📞 Communication System

### **CONTACT_SUBMISSIONS**
**Purpose**: General website contact form submissions

**Workflow Management:**
- Status tracking ("new", "in-progress", "resolved")
- Internal notes for admin team
- Email integration for responses

## 🔄 Key Relationships

### **Many-to-Many Relationships:**
```sql
-- Service providers can have multiple categories
ServiceProviders ←→ Categories

-- Service providers can have multiple subcategories  
ServiceProviders ←→ SubCategories

-- Reviews reference multiple service categories
ProviderReviews ←→ Categories, SubCategories
```

### **One-to-Many Relationships:**
```sql
-- Category hierarchy
Categories (1) → (Many) SubCategories

-- Provider interactions
ServiceProviders (1) → (Many) ProviderReviews
ServiceProviders (1) → (Many) ProviderContacts  
ServiceProviders (1) → (Many) VerifyProviders

-- File associations
ServiceProviders (1) → (Many) FileUploads
ServiceProviders (1) → (Many) ImageUploads
ServiceProviders (1) → (Many) RemoteFileUploads

-- Content relationships
BlogCategories (1) → (Many) Blog
```

### **Polymorphic Relationships:**
```sql
-- Files can be referenced by multiple collection types
FileUploads ←→ ServiceProviders | ProviderReviews | ProviderContacts
ImageUploads ←→ ServiceProviders | Blog | TeamMembers  
RemoteFileUploads ←→ ServiceProviders | ProviderReviews
```

## 🎯 Business Logic Patterns

### **Automated Workflows:**
1. **Slug Generation**: Auto-create URL slugs from names
2. **Review Aggregation**: Calculate `reviewsCount` and `reviewsAverage`  
3. **Search Indexing**: Auto-sync search data on provider changes
4. **Verification Status**: Auto-update provider status on approval
5. **Cache Invalidation**: Auto-purge Cloudflare cache on content changes

### **Data Validation:**
- Email format validation
- URL validation for websites and social links
- File type and size restrictions
- Required field enforcement
- Unique constraints on key identifiers

### **Access Control:**
- Public read access for published content
- Admin-only access for sensitive operations
- Role-based field visibility
- Draft/published workflow states

## 📚 Related Documentation

- [File Upload System](./file-uploads.md) - Detailed file storage architecture
- [Rate Limiting System](./rate-limiting.md) - API protection mechanisms  
- [Architecture Overview](../README.md#project-structure) - Overall system design

---

This database schema supports a sophisticated Web3 marketplace with robust content management, user interactions, file handling, and search capabilities while maintaining data integrity and performance. 