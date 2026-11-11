# Portfolio API

A complete ASP.NET Core Web API for managing a personal portfolio website with admin authentication, projects, books, contact form, bio, and pictures.

## Features

- **JWT Authentication**: Secure admin login with JWT tokens
- **Projects Management**: Add, view, update, and delete portfolio projects
- **Books Management**: Add, view, update, and delete books
- **Contact Form**: Public contact form submission and admin management
- **Bio Management**: Update portfolio bio information
- **Pictures Gallery**: Manage portfolio pictures/gallery images
- **SQL Server Database**: Using Entity Framework Core with LocalDB

## Database Connection

The application uses SQL Server LocalDB with the following connection string:
```
Server=(localdb)\\MSSQLLocalDB;Database=AuthDb;Trusted_Connection=True;TrustServerCertificate=True
```

## Setup Instructions

### 1. Restore NuGet Packages
```bash
dotnet restore
```

### 2. Apply Database Migrations
```bash
dotnet ef database update
```

### 3. Run the Application
```bash
dotnet run
```

The API will be available at `https://localhost:7XXX` (check console for exact port)

## API Endpoints

### Authentication

#### Login (Admin Only)
- **POST** `/api/auth/login`
- Body:
```json
{
  "username": "admin",
  "password": "your-password"
}
```
- Returns: JWT token for authentication

**Note**: Public registration is disabled. The system uses a pre-configured admin account. See [SECURITY.md](SECURITY.md) for details.

### Projects (🔒 = Requires Admin Authentication)

- **GET** `/api/projects` - Get all projects (public)
- **GET** `/api/projects/{id}` - Get specific project (public)
- **POST** `/api/projects` 🔒 - Create new project
- **PUT** `/api/projects/{id}` 🔒 - Update project
- **DELETE** `/api/projects/{id}` 🔒 - Delete project

**Project Body:**
```json
{
  "title": "My Project",
  "description": "Project description",
  "imageUrl": "https://example.com/image.jpg",
  "technologiesUsed": "C#, ASP.NET Core, React",
  "projectUrl": "https://project.com",
  "githubUrl": "https://github.com/username/project"
}
```

### Books (🔒 = Requires Admin Authentication)

- **GET** `/api/books` - Get all books (public)
- **GET** `/api/books/{id}` - Get specific book (public)
- **POST** `/api/books` 🔒 - Add new book
- **PUT** `/api/books/{id}` 🔒 - Update book
- **DELETE** `/api/books/{id}` 🔒 - Delete book

**Book Body:**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "description": "A Handbook of Agile Software Craftsmanship",
  "coverImageUrl": "https://example.com/cover.jpg",
  "amazonUrl": "https://amazon.com/...",
  "rating": 5
}
```

### Contact

- **POST** `/api/contact` - Submit contact form (public)
- **GET** `/api/contact` 🔒 - Get all messages (admin)
- **GET** `/api/contact/{id}` 🔒 - Get specific message (admin)
- **PUT** `/api/contact/{id}/read` 🔒 - Mark as read (admin)
- **DELETE** `/api/contact/{id}` 🔒 - Delete message (admin)

**Contact Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I would like to discuss a project..."
}
```

### Bio (🔒 = Requires Admin Authentication)

- **GET** `/api/bio` - Get bio (public)
- **POST** `/api/bio` 🔒 - Create bio (first time only)
- **PUT** `/api/bio` 🔒 - Update bio

**Bio Body:**
```json
{
  "name": "John Doe",
  "title": "Full Stack Developer",
  "description": "Passionate developer with 5+ years of experience...",
  "profileImageUrl": "https://example.com/profile.jpg",
  "email": "john@example.com",
  "phone": "+1234567890",
  "linkedInUrl": "https://linkedin.com/in/johndoe",
  "githubUrl": "https://github.com/johndoe",
  "twitterUrl": "https://twitter.com/johndoe"
}
```

### Pictures (🔒 = Requires Admin Authentication)

- **GET** `/api/pictures?category={category}` - Get all pictures (public, optional filter)
- **GET** `/api/pictures/{id}` - Get specific picture (public)
- **POST** `/api/pictures` 🔒 - Add new picture
- **PUT** `/api/pictures/{id}` 🔒 - Update picture
- **DELETE** `/api/pictures/{id}` 🔒 - Delete picture

**Picture Body:**
```json
{
  "title": "Project Screenshot",
  "imageUrl": "https://example.com/screenshot.jpg",
  "description": "Main dashboard view",
  "category": "web-development"
}
```

## Authentication

For protected endpoints (marked with 🔒), include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Technologies Used

- **.NET 10**: Latest .NET framework
- **ASP.NET Core Web API**: RESTful API framework
- **Entity Framework Core**: ORM for database access
- **SQL Server LocalDB**: Development database
- **JWT Authentication**: Secure token-based authentication
- **Swagger/Swashbuckle**: Interactive API documentation and testing
- **OpenAPI 3.0**: API specification standard

## Project Structure

```
portfilo/
├── Controllers/         # API Controllers
│   ├── AuthController.cs
│   ├── ProjectsController.cs
│   ├── BooksController.cs
│   ├── ContactController.cs
│   ├── BioController.cs
│   └── PicturesController.cs
├── Models/             # Data Models
│   ├── Admin.cs
│   ├── Project.cs
│   ├── Book.cs
│   ├── ContactMessage.cs
│   ├── Bio.cs
│   └── Picture.cs
├── DTOs/               # Data Transfer Objects
│   ├── AuthDTOs.cs
│   └── PortfolioDTOs.cs
├── Data/               # Database Context
│   └── ApplicationDbContext.cs
├── Services/           # Business Logic
│   ├── TokenService.cs
│   └── PasswordHasher.cs
├── Migrations/         # EF Core Migrations
├── appsettings.json   # Configuration
└── Program.cs         # Application Entry Point
```

## Development

### Adding New Migrations
```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Building the Project
```bash
dotnet build
```

### Running Tests
```bash
dotnet test
```

## Security Notes

- Change the JWT secret key in `appsettings.json` for production
- Use stronger password hashing (consider BCrypt or Argon2)
- Implement rate limiting for authentication endpoints
- Add HTTPS redirection in production
- Configure CORS properly for your frontend domain

## License

MIT License
