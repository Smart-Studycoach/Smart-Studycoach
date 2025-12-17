# API Endpoints

## Authentication

### POST `/auth/login`

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
  "token": "string",
  "user": { "id": "string", "email": "string" }
}
```

### POST `/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response:** `201 Created`

```json
{
  "id": "string",
  "email": "string",
  "name": "string"
}
```

### GET `/auth/account`

Get current user account details (requires authentication).

**Response:** `200 OK`

```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "createdAt": "string"
}
```

## Modules

### GET `/modules`

Retrieve all study modules.

**Response:** `200 OK`

```json
{
  "modules": [
    {
      "id": "string",
      "title": "string",
      "description": "string"
    }
  ]
}
```
