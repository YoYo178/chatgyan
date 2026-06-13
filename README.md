# ChatGyan

ChatGyan is a real-time communication platform designed to facilitate collaborative learning among students in online educational environments. The application provides secure authentication, room-based discussions, and instant messaging capabilities, enabling learners to communicate efficiently and participate in interactive academic discussions.

## Features

### Authentication & Security

- User registration and login
- JWT-based authentication
- Access and refresh token mechanism
- Secure password hashing
- Protected API routes

### Real-Time Communication

- Real-time messaging using Socket.io
- Instant message delivery
- Typing indicators
- Join and leave room notifications
- Live participant updates

### Chat Rooms

- Create chat rooms
- Public and private room support
- Room ownership system
- Room management controls
- Participant tracking

### User Experience

- Responsive user interface
- Modern chat layout
- Message timestamps
- Recent message history
- Smooth real-time interactions

## Tech Stack

### Frontend

- React.js
- TypeScript
- Vite
- React Query
- Tailwind CSS
- Socket.io Client

### Backend

- Node.js
- Express.js
- TypeScript
- Socket.io
- JWT Authentication
- MongoDB
- Mongoose

### Development Tools

- Git & GitHub
- ESLint
- Prettier

## System Architecture

```text
┌─────────────┐
│   React UI  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ REST APIs   │
│ Express.js  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ MongoDB     │
│ Database    │
└─────────────┘

       ▲
       │
┌──────┴──────┐
│ Socket.io   │
│ Real-Time   │
└─────────────┘
```

## Installation

### Prerequisites

- Node.js (v18 or later)
- MongoDB
- Git

### Clone Repository

```bash
git clone https://github.com/YoYo178/chatgyan.git
cd chatgyan
```

### Backend Setup

```bash
cd backend

pnpm install
```

Create an `.env` file or use the already provided `.env.example` file:

```env
PORT=3000

FRONTEND_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

MONGODB_URI=your_mongodb_connection_string
```

Start backend server:

```bash
pnpm run dev
```

### Frontend Setup

```bash
cd frontend

pnpm install
pnpm run dev
```

## Project Structure
```text
chatgyan/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── types/
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│
├── backend/
│   ├── src/
│   │   ├── @types/
│   │   ├── common/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── types/
│   │   ├── utils/
│   │   │
│   │   └── index.ts
│
└── README.md
```

## Use Cases

### Students

- Participate in academic discussions
- Collaborate on projects
- Communicate in study groups
- Exchange knowledge in real time

### Educators

- Create discussion spaces
- Engage with students
- Facilitate collaborative learning

## Future Enhancements

- Direct messaging
- File sharing
- Message reactions
- Voice channels
- Video conferencing integration
- Push notifications
- Advanced moderation tools
- Typing indicators

## Learning Outcomes

This project demonstrates practical implementation of:

- Full-stack web development
- RESTful API design
- Real-time communication systems
- Authentication and authorization
- Database design and management
- WebSocket architecture
- Modern React development
- TypeScript application development

## Author

**Sumit Chaurasiya**

Final Year B.C.A Project

## License

This project is developed for educational and academic purposes.
