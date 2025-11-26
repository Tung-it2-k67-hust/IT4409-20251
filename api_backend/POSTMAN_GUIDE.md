# Postman Testing Guide

## Setup

1. Open Postman
2. Create a new collection called "User Management API"
3. Set base URL as environment variable: `http://localhost:5000`

## API Endpoints to Test

### 1. Create New User (POST)
**Endpoint:** `POST http://localhost:5000/api/users`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25,
  "role": "user"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "role": "user",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 2. Get All Users (GET)
**Endpoint:** `GET http://localhost:5000/api/users`

**Expected Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 25,
      "role": "user",
      "isActive": true
    }
  ]
}
```

---

### 3. Get User by ID (GET)
**Endpoint:** `GET http://localhost:5000/api/users/:id`

**Example:** `GET http://localhost:5000/api/users/6564abc123def456789`

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6564abc123def456789",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "role": "user"
  }
}
```

---

### 4. Update User (PUT)
**Endpoint:** `PUT http://localhost:5000/api/users/:id`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "John Updated",
  "age": 30,
  "role": "admin"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "...",
    "name": "John Updated",
    "email": "john@example.com",
    "age": 30,
    "role": "admin"
  }
}
```

---

### 5. Delete User (DELETE)
**Endpoint:** `DELETE http://localhost:5000/api/users/:id`

**Example:** `DELETE http://localhost:5000/api/users/6564abc123def456789`

**Expected Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {}
}
```

---

## Error Testing Scenarios

### Test 1: Create User with Duplicate Email
**Request:**
```json
{
  "name": "Jane Doe",
  "email": "john@example.com",
  "age": 28
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### Test 2: Create User with Invalid Data
**Request:**
```json
{
  "name": "A",
  "email": "invalid-email",
  "age": -5
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name must be at least 2 characters long",
    "Please provide a valid email address",
    "Age cannot be negative"
  ]
}
```

---

### Test 3: Get User with Invalid ID
**Endpoint:** `GET http://localhost:5000/api/users/invalid-id`

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Invalid user ID format"
}
```

---

### Test 4: Get Non-Existent User
**Endpoint:** `GET http://localhost:5000/api/users/507f1f77bcf86cd799439011`

**Expected Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## Postman Collection JSON

You can import this into Postman:

```json
{
  "info": {
    "name": "User Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Users",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      }
    },
    {
      "name": "Get User by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/users/:id",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", ":id"]
        }
      }
    },
    {
      "name": "Create User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"age\": 25,\n  \"role\": \"user\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users"]
        }
      }
    },
    {
      "name": "Update User",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Updated\",\n  \"age\": 30\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/users/:id",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", ":id"]
        }
      }
    },
    {
      "name": "Delete User",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/users/:id",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", ":id"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    }
  ]
}
```

## Quick Test Flow

1. **Create** a new user → Copy the returned `_id`
2. **Get All** users → Verify the user appears in the list
3. **Get by ID** → Use the copied `_id`
4. **Update** → Modify user details using the `_id`
5. **Delete** → Remove user using the `_id`
6. **Get All** again → Verify user is deleted
