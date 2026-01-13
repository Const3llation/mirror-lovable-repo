# 📁 File Upload System (Cloudflare R2)

The CONST3LLATION platform uses **Cloudflare R2** for scalable file storage with a sophisticated multipart upload system designed to handle large files efficiently and securely.

## 🏗️ Architecture Overview

```
Client                    Next.js API              Cloudflare R2
  │                           │                        │
  │─── 1. Request URLs ──────▶│                        │
  │                           │─── 2. Init Upload ────▶│
  │◄──── 3. Presigned URLs ───│◄── 3. Upload ID ──────│
  │                           │                        │
  │─── 4. Upload Chunks ──────────────────────────────▶│
  │                           │                        │
  │─── 5. Complete Upload ────▶│                        │
  │                           │─── 6. Complete ───────▶│
  │                           │─── 7. Assign File ────▶│ PayloadCMS
```

## 🔄 Upload Flow

### 1. **Initialize Upload** (`/api/uploads`)
- Client sends file metadata (filename, size, content type, field path)
- Server validates file extension and field path
- Creates multipart upload in R2
- Generates presigned URLs for each chunk (10MB each)
- Returns upload ID and presigned URLs

```typescript
// Request payload
{
  filename: "portfolio.pdf",
  contentType: "application/pdf", 
  size: 52428800, // 50MB
  fieldPath: "caseStudies.files"
}

// Response
{
  urls: [
    { url: "https://presigned-url-1", partNumber: 1 },
    { url: "https://presigned-url-2", partNumber: 2 }
  ],
  fileKey: "uuid-portfolio.pdf",
  uploadId: "upload-id-123",
  expiresAt: "2024-01-01T12:00:00Z"
}
```

### 2. **Upload Chunks** (Direct to R2)
- Client uploads file chunks directly to R2 using presigned URLs
- Each chunk is uploaded as a separate part
- Returns ETag for each successful part upload
- Progress tracking available for each chunk

### 3. **Complete Upload** (`/api/uploads/complete`)
- Client sends completion request with all part ETags
- Server completes multipart upload in R2
- File becomes accessible in R2 bucket

```typescript
// Request payload
{
  fileKey: "uuid-portfolio.pdf",
  uploadId: "upload-id-123",
  parts: [
    { partNumber: 1, eTag: "etag-1" },
    { partNumber: 2, eTag: "etag-2" }
  ]
}
```

### 4. **Assign File** (`/api/uploads/assign`)
- Creates entry in PayloadCMS `remote-file-uploads` collection
- Links file to appropriate entity (service provider, review, etc.)
- Updates related collection with file reference

## 📂 Supported File Types

### **Documents**
- **PDF**: `.pdf` (application/pdf)
- **Word**: `.doc`, `.docx`
- **Excel**: `.xls`, `.xlsx` 
- **PowerPoint**: `.ppt`, `.pptx`
- **Text**: `.txt`, `.md`

### **Images**
- **JPEG**: `.jpg`, `.jpeg`
- **PNG**: `.png`
- **WebP**: `.webp`

## 🔧 Configuration

### **Environment Variables**
```bash
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# File Storage URL (for serving files)
NEXT_PUBLIC_FILES_STORAGE_URL=https://storage.const3llation.com
```

### **Upload Limits**
```typescript
const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB per chunk
const UPLOAD_TIMEOUT = 300000; // 5 minutes timeout
```

## 🛡️ Security Features

### **File Validation**
- Extension allowlist enforcement
- MIME type validation
- File size limits per type
- Malicious filename sanitization

### **Access Control**
- Field path validation (only allowed paths can receive files)
- Rate limiting on upload endpoints
- Presigned URL expiration (1 hour)
- Secure filename generation with UUIDs

### **Upload Security**
```typescript
// Secure filename generation
const fileKey = `${crypto.randomUUID()}-${filename}`;

// Field path validation
const ALLOWED_PATHS = [
  'branding.logo',
  'caseStudies.files',
  'caseStudies.images',
  'teamMembers'
];
```

## 🗃️ File Management

### **Collections**
- **`file-uploads`**: Traditional PayloadCMS uploads
- **`image-uploads`**: PayloadCMS image uploads with processing
- **`remote-file-uploads`**: R2-stored files with metadata

### **File Assignment**
Files are automatically assigned to entities based on field paths:

```typescript
// Service provider logo
'branding.logo' → provider.logo relationship

// Case study files  
'caseStudies.files' → caseStudy.files[] array

// Team member images
'teamMembers' → teamMember.image relationship
```

## 🚨 Error Handling

### **Upload Errors**
- **429**: Rate limit exceeded
- **400**: Invalid file type/size
- **408**: Upload timeout
- **500**: R2 service errors

### **Recovery Mechanisms**
- **Abort Upload** (`/api/uploads/abort`): Cancel incomplete uploads
- **Cleanup** (`/api/uploads/clear`): Remove abandoned multipart uploads
- **Delete** (`/api/uploads/delete`): Remove files from R2

### **Error Examples**
```typescript
// Rate limiting
if (await uploadFilesLimiter.isRateLimited(request)) {
  return NextResponse.json(
    { error: "Too many upload requests. Please try again later." },
    { status: 429 }
  );
}

// File validation
if (!validateFileExtension(filename)) {
  return NextResponse.json(
    { error: "Invalid file extension" },
    { status: 400 }
  );
}
```

## 💻 Frontend Integration

### **Upload Component Usage**
```tsx
<FileUpload
  name="caseStudyFiles"
  label="Case Study Documents"
  config={{
    maxFiles: 5,
    maxTotalSize: 100 * 1024 * 1024, // 100MB
    documents: {
      maxSizePerFile: 10 * 1024 * 1024 // 10MB per file
    }
  }}
  onFilesChange={handleFilesChange}
/>
```

### **Progress Tracking**
```typescript
const { uploadFiles } = useUploadFiles();

await uploadFiles(filesMap, {
  onProgress: (progress) => {
    setUploadProgress(progress.percentage);
  },
  onFileComplete: (fileSize) => {
    console.log(`File uploaded: ${fileSize} bytes`);
  }
});
```

## 🔍 Monitoring & Debugging

### **Upload Tracking**
- Each upload gets a unique `uploadId` for tracking
- Progress events for real-time monitoring
- Comprehensive error logging with context

### **Useful Endpoints**
- **GET** `/api/uploads/status/:uploadId` - Check upload status
- **POST** `/api/uploads/clear` - Clean up abandoned uploads
- **POST** `/api/uploads/delete` - Delete specific files

## 📚 Related Documentation

- [Environment Variables Setup](../README.md#environment-variables)
- [Architecture Overview](../README.md#architecture-principles)
- [API Reference](./api-reference.md)

---

This robust file upload system ensures reliable, secure, and scalable file handling for the CONST3LLATION platform, supporting everything from provider logos to comprehensive case study documentation. 