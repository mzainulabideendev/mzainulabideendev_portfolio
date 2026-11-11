# 🔒 Security Configuration Guide

## Default Admin Account

The application automatically creates a default admin account on first run with the following credentials:

### Login Credentials
- **Username**: `admin`
- **Email**: `admin@example.com`
- **Password**: `your-admin-password`

⚠️ **IMPORTANT**: Change the password immediately in production!

## Authentication Changes

### ✅ What Has Been Secured:

1. **Registration Endpoint Removed**
   - Public registration is disabled
   - Only the pre-configured admin can access the system
   - No unauthorized user creation possible

2. **Admin Credentials**
   - Stored in `appsettings.json` (Development only)
   - Move to User Secrets or Environment Variables for production
   - Protected by `.gitignore` to prevent accidental commits

3. **Auto-Seeding**
   - Default admin account is created automatically on first run
   - Only creates if no admin exists in the database
   - Prevents duplicate admin accounts

## API Endpoints Authorization

### Public Endpoints (No Authentication Required)
```
POST /api/auth/login                    - Admin login
GET  /api/projects                      - View all projects
GET  /api/projects/{id}                 - View project details
GET  /api/books                         - View all books
GET  /api/books/{id}                    - View book details
GET  /api/bio                           - View bio
GET  /api/pictures                      - View pictures
POST /api/contact                       - Submit contact form
```

### Protected Endpoints (Admin Only - JWT Required)
```
POST   /api/projects                    - Create project
PUT    /api/projects/{id}               - Update project
DELETE /api/projects/{id}               - Delete project

POST   /api/books                       - Add book
PUT    /api/books/{id}                  - Update book
DELETE /api/books/{id}                  - Delete book

POST   /api/bio                         - Create bio
PUT    /api/bio                         - Update bio

POST   /api/pictures                    - Add picture
PUT    /api/pictures/{id}               - Update picture
DELETE /api/pictures/{id}               - Delete picture

GET    /api/contact                     - View all messages
GET    /api/contact/{id}                - View message details
PUT    /api/contact/{id}/read           - Mark as read
DELETE /api/contact/{id}                - Delete message
```

## How to Login

### Using Swagger UI:
1. Navigate to `https://localhost:{PORT}/`
2. Find the `/api/auth/login` endpoint
3. Click "Try it out"
4. Enter credentials:
   ```json
   {
     "username": "admin",
     "password": "your-admin-password"
   }
   ```
5. Click "Execute"
6. Copy the JWT token from the response
7. Click the "Authorize" button (🔓 lock icon) at the top
8. Enter: `Bearer {paste-your-token-here}`
9. Click "Authorize" then "Close"
10. All protected endpoints are now accessible!

### Using HTTP Client (Postman, curl, etc.):
```bash
# Login
POST https://localhost:5001/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-admin-password"
}

# Response will include token
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "email": "admin@example.com"
}

# Use token in subsequent requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Production Security Checklist

### ⚠️ Before Deploying to Production:

1. **Change Admin Password**
   ```json
   // Update in appsettings.json or environment variables
   "DefaultAdmin": {
     "Password": "STRONG_PASSWORD_HERE"
   }
   ```

2. **Use Environment Variables**
   ```bash
   # Set via environment variables instead of appsettings.json
   DefaultAdmin__Username=admin
   DefaultAdmin__Email=your-email@example.com
   DefaultAdmin__Password=your-secure-password
   Jwt__Key=your-long-secure-jwt-key
   ```

3. **Use User Secrets (Development)**
   ```bash
   dotnet user-secrets init
   dotnet user-secrets set "DefaultAdmin:Username" "admin"
   dotnet user-secrets set "DefaultAdmin:Email" "admin@example.com"
   dotnet user-secrets set "DefaultAdmin:Password" "your-admin-password"
   dotnet user-secrets set "Jwt:Key" "your-secret-jwt-key"
   ```

4. **Update CORS Policy**
   ```csharp
   // Replace "AllowAll" with specific domain
   policy.WithOrigins("https://yourdomain.com")
         .AllowAnyMethod()
         .AllowAnyHeader();
   ```

5. **Enable HTTPS Only**
   - Ensure SSL certificate is configured
   - Remove HTTP endpoint in production

6. **Change JWT Secret Key**
   - Generate a strong, random key (minimum 32 characters)
   - Store in environment variables or key vault

7. **Add Rate Limiting**
   - Protect login endpoint from brute force attacks
   - Implement rate limiting middleware

8. **Enable Logging**
   - Log all authentication attempts
   - Monitor failed login attempts

## File Security

### Files Protected from Git Commits:
- `appsettings.json` - Contains credentials (ignored by .gitignore)
- `appsettings.Development.json`
- `appsettings.Production.json`

### Template File for Setup:
- `appsettings.template.json` - Safe template for new developers

### To Setup New Environment:
1. Copy `appsettings.template.json` to `appsettings.json`
2. Update with your credentials
3. Run the application
4. Admin account will be created automatically

## Token Information

- **Token Type**: JWT (JSON Web Token)
- **Validity**: 7 days from generation
- **Contains**: UserId, Username, Email, Role (Admin)
- **Format**: `Bearer {token}`

## Password Security

- Passwords are hashed using SHA256
- Original passwords are never stored
- Hashes are stored in the database
- For production, consider using BCrypt or Argon2

## Database Security

### Admin Table Structure:
```sql
CREATE TABLE Admins (
    Id INT PRIMARY KEY IDENTITY,
    Username NVARCHAR(MAX) NOT NULL UNIQUE,
    Email NVARCHAR(MAX) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 NOT NULL
)
```

### Security Features:
- Unique username constraint
- Unique email constraint
- Password stored as hash only
- Creation timestamp for audit

## Troubleshooting

### "Default admin credentials are not configured"
- Check `appsettings.json` has `DefaultAdmin` section
- Ensure Email and Password are not empty
- Verify JSON syntax is correct

### Cannot login with default credentials
- Check database has admin record
- Verify password matches exactly
- Try resetting database: `dotnet ef database drop` then `dotnet ef database update`

### Token expired
- Login again to get a new token
- Tokens are valid for 7 days

## Support

For security issues or questions:
1. Check this security guide
2. Review appsettings.template.json for configuration
3. Check database for admin account existence
4. Verify JWT configuration in appsettings.json

---

**Remember**: Never commit `appsettings.json` with real credentials to version control!
