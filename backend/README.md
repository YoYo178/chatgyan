# ChatGyan Backend

The backend service for ChatGyan, providing authentication, room management, message persistence, and real-time communication using Socket.io.

## Overview

The backend serves as the core of the ChatGyan platform, exposing REST APIs and WebSocket events that enable secure and scalable real-time communication between users.

## Features

### Authentication & Authorization

* User registration
* User login
* JWT authentication
* Access tokens
* Refresh tokens
* Protected endpoints
* Password hashing using bcrypt

### Room Management

* Create rooms
* Join rooms
* Leave rooms
* Public and private room support
* Room ownership management

### Real-Time Communication

* Socket.io integration
* Live messaging
* User connection tracking
* Room event broadcasting

### Database Operations

* User management
* Room management
* Message persistence
* Data validation
* MongoDB integration

## Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* Socket.io
* JWT
* bcrypt

## API Architecture

```text
Client
   │
   ▼
Express Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Models (Mongoose)
   │
   ▼
MongoDB
```

## Installation

### Prerequisites

* Node.js v18+
* MongoDB

### Setup

```bash
git clone <repository-url>
cd server

pnpm install
```

### Environment Variables

Create a `.env` file or use the already provided `.env.example` file:

```env
PORT=3000

FRONTEND_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

MONGODB_URI=your_mongodb_connection_string
```

### Start Development Server

```bash
pnpm run dev
```

Server will run on:

```text
http://localhost:3000
```

## Project Structure

```text
src/
│
├── @types/
├── common/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── schemas/
├── services/
├── sockets/
├── types/
├── utils/
│
└── index.ts
```

## REST API Modules

### Authentication

```text
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
```

### Rooms

```text
GET    /api/rooms
GET    /api/rooms/:id
```

### Messages

```text
GET    /api/messages
GET    /api/messages/:id
```

### Users

```text
GET    /api/users/me
PATCH  /api/users/me
GET    /api/users/:id
```

## Socket Events

### Client → Server

```text
createRoom
updateRoom
joinRoom
leaveRoom
deleteRoom
sendMessage
```

### Server → Client

```text
roomCreated
roomUpdated
roomDeleted
memberJoined
memberLeft
newMessage
```

## Security Measures

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Input validation
* Environment-based secrets
* CORS configuration

## Available Scripts

```bash
pnpm run dev
pnpm run build
pnpm start
pnpm run lint
```

## Future Improvements

* Redis caching
* Horizontal scaling
* File uploads
* Push notifications
* Message reactions
* Direct messaging
* Email verification
* Typing indicators

## License

Part of the ChatGyan project.
