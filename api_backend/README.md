# User Management API

RESTful API for managing users with MongoDB Atlas.

## Features
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ MongoDB Atlas integration
- ✅ Input validation
- ✅ Comprehensive error handling
- ✅ Postman-ready endpoints

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Add your MongoDB Atlas connection string

3. **Run the server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Get All Users
```
GET /api/users
```

### Get User by ID
```
GET /api/users/:id
```

### Create New User
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25,
  "role": "user"
}
```

### Update User
```
PUT /api/users/:id
Content-Type: application/json

{
  "name": "John Updated",
  "age": 26
}
```

### Delete User
```
DELETE /api/users/:id
```

## Testing with Postman

Import the endpoints into Postman:
- Base URL: `http://localhost:5000`
- All routes start with `/api/users`

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error
