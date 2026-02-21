LIVE DEMO : https://study-vault-2gtv.onrender.com/
# 📚 Study Vault - Academic Resource Management System

A comprehensive backend system for managing and organizing academic resources (PDFs) for students. Admins can upload study materials categorized by year, semester, branch, and type, while students can search, filter, and download resources.

## 🎯 Problem Statement

Students often struggle to find organized study materials like notes, previous year questions (PYQs), assignments, and reference books. Resources are scattered across different platforms, making it difficult to access them when needed.

**Study Vault** solves this by providing a centralized platform where:
- **Admins** can upload and manage academic PDFs
- **Students** can easily find and download resources filtered by their specific needs

---

## ✨ Features

### 👤 User Management
- User registration and login with JWT authentication
- Role-based access control (Admin & Student)
- Secure password hashing with bcrypt
- Protected routes with middleware

### 📁 Document Management (Admin)
- Upload PDFs to Cloudinary
- Categorize by: Year, Semester, Branch, Category (Book/Assignment/PYQ/Notes/Other)
- Add optional metadata (subject, description)
- Update document details
- Delete documents (removes from both database and Cloudinary)

### 🔍 Student Features
- Browse all available PDFs
- Filter by year, semester, branch, category, and subject
- Download PDFs directly from Cloudinary
- Track download counts for popular resources
- View document details and metadata

---

## 🛠️ Tech Stack

**Backend Framework:**
- Node.js
- Express.js

**Database:**
- MongoDB with Mongoose ODM

**Authentication:**
- JSON Web Tokens (JWT)
- bcrypt for password hashing

**File Storage:**
- Cloudinary (cloud storage for PDFs)
- Multer (file upload middleware)

**Additional Libraries:**
- dotenv (environment variables)
- cookie-parser (cookie handling)
- cors (Cross-Origin Resource Sharing)

---

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary Account** (free tier works)
- **Git**

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Harshmahto/study-vault.git
cd study-vault
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/studyvault
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studyvault

# JWT Secrets (use strong random strings)
ACCESS_TOKEN_SECRET=your_access_token_secret_here
ACCESS_TOKEN_EXPIRY=1d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS (optional)
CORS_ORIGIN=*
```

### 4. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:8000`

---

## 📁 Project Structure
```
study-vault/
├── src/
│   ├── controllers/
│   │   ├── user.controller.js      # Auth & user management
│   │   └── docs.controller.js      # PDF CRUD operations
│   ├── models/
│   │   ├── user.model.js           # User schema
│   │   └── docs.model.js           # Document schema
│   ├── routes/
│   │   ├── user.routes.js          # User routes
│   │   └── admin.routes.js         # Admin routes
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT verification
│   │   ├── admin.middleware.js     # Role checking
│   │   └── multer.middleware.js    # File upload handling
│   ├── utils/
│   │   ├── ApiError.js             # Custom error class
│   │   ├── ApiResponse.js          # Standardized response
│   │   ├── asyncHandler.js         # Async error wrapper
│   │   └── cloudinary.js           # Cloudinary integration
│   ├── app.js                      # Express app configuration
│   └── index.js                    # Server entry point
├── public/                         # Temporary file uploads
├── .env                            # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/user/register` | Register new user | Public |
| POST | `/api/v1/user/login` | User login | Public |
| POST | `/api/v1/user/logout` | User logout | Private |

### Admin Endpoints (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/admin/upload-pdf` | Upload new PDF | Admin |
| PATCH | `/api/v1/admin/update-pdf/:id` | Update PDF details | Admin |
| DELETE | `/api/v1/admin/delete-pdf/:id` | Delete PDF | Admin |

### Student Endpoints (All Authenticated Users)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/v1/user/pdfs` | Get all PDFs (with filters) | Private |
| GET | `/api/v1/user/pdfs/:id` | Get single PDF details | Private |
| PATCH | `/api/v1/user/pdfs/:id/download` | Increment download count | Private |

---

## 📖 API Documentation

**Interactive API Documentation available at:**
```
http://localhost:8000/api-docs
```

For detailed API documentation with request/response examples, see:
- [Postman Collection](link-to-postman-collection)
- [Swagger Documentation](link-to-swagger-docs) *(if deployed)*

---

## 🧪 Testing the API

### Using Postman/Thunder Client

**1. Register a User (Student by default)**
```http
POST http://localhost:8000/api/v1/user/register
Content-Type: application/json

{
  "username": "john_doe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**2. Create an Admin User**
```http
POST http://localhost:8000/api/v1/user/register
Content-Type: application/json

{
  "username": "admin_user",
  "fullName": "Admin User",
  "email": "admin@example.com",
  "password": "adminPassword123",
  "role": "Admin"
}
```

**3. Login**
```http
POST http://localhost:8000/api/v1/user/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminPassword123"
}
```

**4. Upload PDF (Admin)**
```http
POST http://localhost:8000/api/v1/admin/upload-pdf
Authorization: Bearer <your_access_token>
Content-Type: multipart/form-data

title: Data Structures Notes
year: 2
semester: 1
branch: CSE
category: Notes
subject: Data Structures
description: Complete notes for DS
pdf: [select PDF file]
```

**5. Get PDFs with Filters (Student)**
```http
GET http://localhost:8000/api/v1/user/pdfs?year=2&semester=1&branch=CSE&category=Notes
Authorization: Bearer <your_access_token>
```

---

## 🎨 Data Models

### User Schema
```javascript
{
  username: String (unique, required),
  fullName: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['Student', 'Admin'], default: 'Student'),
  refreshToken: String
}
```

### Document Schema
```javascript
{
  title: String (required),
  year: Number (1-4, required),
  semester: Number (1-2, required),
  branch: String (required),
  category: String (enum: ['Book', 'Assignment', 'PYQ', 'Notes', 'Other']),
  subject: String (optional),
  description: String (optional),
  cloudinaryUrl: String (required),
  cloudinaryPublicId: String (required),
  uploadedBy: ObjectId (ref: User, required),
  downloadCount: Number (default: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🚀 Deployment

### Deploy on Railway/Render

**1. Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**2. Deploy Backend**
- Create account on [Railway](https://railway.app) or [Render](https://render.com)
- Connect your GitHub repository
- Add environment variables from `.env`
- Deploy!

**3. Update CORS**
Update your `.env` with deployed frontend URL:
```env
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ HTTP-only cookies for tokens
- ✅ Role-based access control
- ✅ Input validation on all endpoints
- ✅ File type validation (only PDFs)
- ✅ Protected routes with middleware
- ✅ Secure Cloudinary integration

---

## 🐛 Known Issues & Future Improvements

### Current Limitations
- No pagination on PDF list (all results returned)
- No search functionality by title
- Download count can be inflated by repeated clicks
- No email verification for new users

### Planned Features
- [ ] Add pagination for PDF listings
- [ ] Implement search by title/description
- [ ] Add email verification on registration
- [ ] Rate limiting for API endpoints
- [ ] PDF preview/thumbnail generation
- [ ] Admin dashboard with statistics
- [ ] Bulk PDF upload
- [ ] Export PDF list as CSV

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@Harshmahto](https://github.com/Harshmahto)
- LinkedIn: [Your Name](https://linkedin.com/in/harsh-mahto-1ab79925a)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Cloudinary for free cloud storage
- MongoDB Atlas for database hosting
- Express.js community for excellent documentation
- All open-source contributors

---

## 📞 Support

For support, email your.email@example.com or open an issue in the repository.

---


**⭐ If you found this project helpful, please give it a star!**
