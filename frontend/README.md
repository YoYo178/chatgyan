# ChatGyan Frontend

The frontend application for ChatGyan, a real-time collaborative learning platform built using React, TypeScript, and Socket.io.

## Overview

This application provides the user interface for ChatGyan, allowing users to authenticate, create and join chat rooms, communicate in real time, and manage their learning communities through a responsive web interface.

## Features

### Authentication

- User registration
- User login
- JWT-based session management
- Protected routes
- Automatic authentication state handling

### Chat Experience

- Real-time messaging
- Room-based conversations
- Message timestamps
- Live participant updates

### Room Management

- Browse available rooms
- Create new rooms
- Join and leave rooms
- View room participants

### User Interface

- Responsive design
- Modern chat layout
- Mobile-friendly experience
- Fast client-side navigation
- Loading and error states

## Tech Stack

- React.js
- TypeScript
- Vite
- React Query (TanStack Query)
- React Router
- Socket.io Client
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js v18+
- Running ChatGyan Backend instance

### Installation

```bash
git clone <repository-url>
cd client

pnpm install
```

### Environment Variables

Create a `.env` file or use the already provided `.env.example` file:

```env
VITE_DEV_SERVER_URL=http://localhost:3000
VITE_SERVER_URL=https://example.com
```

### Run Development Server

```bash
pnpm run dev
```

Application will be available at:

```text
http://localhost:5173
```

## Build for Production

```bash
pnpm run build
```

Preview production build:

```bash
pnpm run preview
```

## Folder Structure

```text
src/
│
├── api/
├── components/
├── hooks/
├── lib/
├── pages/
├── types/
│
├── App.tsx
├── index.css
└── main.tsx
```

## Responsibilities

The frontend is responsible for:

- Rendering user interfaces
- Managing client-side state
- Handling authentication tokens
- Connecting to Socket.io
- Communicating with backend APIs
- Displaying real-time updates

## Available Scripts

```bash
pnpm run dev
pnpm run build
pnpm run preview
pnpm run lint
```

## License

Part of the ChatGyan project.
