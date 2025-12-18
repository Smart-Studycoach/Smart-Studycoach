# API Endpoints

## Authentication

### POST `/api/auth/login`

Login user with credentials.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`

```json
{
  "user": {
    "_id": "string",
    "email": "string",
    "name": "string",
    "studentProfile": "string",
    "favoriteModules": ["string"],
    "chosenModules": ["string"],
    "createdAt": "string",
    "updatedAt": "string"
  },
  "token": "string"
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "Invalid email or password"
}
```

### POST `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "studentProfile": "string"
}
```

**Password Requirements:**

- Minimum 12 characters
- At least one uppercase letter
- At least one number
- At least one special character (!@#$%^&\*(),.?":{}|<>)

**Response:** `201 Created`

```json
{
  "user": {
    "_id": "string",
    "email": "string",
    "name": "string",
    "studentProfile": "string",
    "favoriteModules": ["string"],
    "chosenModules": ["string"],
    "createdAt": "string",
    "updatedAt": "string"
  },
  "token": "string"
}
```

**Error Response:** `409 Conflict`

```json
{
  "error": "User with this email already exists"
}
```

### GET `/api/auth`

Get current user account details (requires authentication).

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

```json
{
  "user": {
    "_id": "string",
    "email": "string",
    "name": "string",
    "studentProfile": "string",
    "favoriteModules": ["string"],
    "chosenModules": ["string"],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "No token provided"
}
```

### DELETE `/api/auth`

Delete current user account (requires authentication).

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

```json
{
  "message": "User deleted successfully"
}
```

## Modules

### GET `/api/modules`

Retrieve all study modules.

**Response:** `200 OK`

```json
{
  "modules": [
    {
      "_id": "string",
      "id": "number",
      "name": "string",
      "shortdescription": ["string"],
      "description": "string",
      "studycredit": "number",
      "location": ["string"],
      "level": "string",
      "learningoutcomes": "string",
      "estimated_difficulty": "number",
      "available_spots": "number",
      "start_date": "string"
    }
  ]
}
```

**Error Response:** `500 Internal Server Error`

```json
{
  "error": "Failed to fetch modules"
}
```
