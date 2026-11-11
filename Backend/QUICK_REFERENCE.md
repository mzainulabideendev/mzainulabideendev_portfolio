# 🎯 Quick Reference Card

## Admin Login Credentials

```
Username: admin
Password: your-admin-password
Email: admin@example.com
```

## Login Endpoint

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "your-admin-password"
}
```

## Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "email": "admin@example.com"
}
```

## Using the Token

### In Swagger UI:
1. Click "Authorize" button (🔓 lock icon)
2. Enter: `Bearer {paste-token-here}`
3. Click "Authorize" → "Close"

### In HTTP Requests:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Protected Endpoints (Admin Only)

### Projects
- POST /api/projects - Create
- PUT /api/projects/{id} - Update
- DELETE /api/projects/{id} - Delete

### Books
- POST /api/books - Create
- PUT /api/books/{id} - Update
- DELETE /api/books/{id} - Delete

### Bio
- POST /api/bio - Create
- PUT /api/bio - Update

### Pictures
- POST /api/pictures - Create
- PUT /api/pictures/{id} - Update
- DELETE /api/pictures/{id} - Delete

### Contact Messages
- GET /api/contact - View all
- GET /api/contact/{id} - View one
- PUT /api/contact/{id}/read - Mark as read
- DELETE /api/contact/{id} - Delete

## Public Endpoints (No Auth)

- GET /api/projects - All projects
- GET /api/books - All books
- GET /api/bio - Bio
- GET /api/pictures - All pictures
- POST /api/contact - Submit form
- POST /api/auth/login - Login

## Run Application

```bash
dotnet run
```

Access Swagger: `https://localhost:{PORT}/`

## Important Files

- `SECURITY.md` - Complete security guide
- `SECURITY_CHECKLIST.md` - Implementation details
- `README.md` - API documentation
- `api-tests.http` - Test requests

## Quick Commands

```bash
# Build
dotnet build

# Run
dotnet run

# Clean
dotnet clean

# Database reset
dotnet ef database drop
dotnet ef database update
```

## Security Notes

⚠️ **Production Checklist**:
- [ ] Change admin password
- [ ] Use environment variables
- [ ] Update JWT secret key
- [ ] Configure proper CORS
- [ ] Add rate limiting
- [ ] Enable HTTPS only
- [ ] Remove sensitive data from appsettings.json

---

**Registration is disabled** - Only pre-configured admin can access the system.
