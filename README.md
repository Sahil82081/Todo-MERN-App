# MERN Todo App

A full-stack Todo application built with MongoDB, Express, React, and Node.js.

## Quick Start

### 1. Setup server
```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your MongoDB URI
npm run dev
```

### 2. Setup client
```bash
cd client
npm install
npm run dev
```

App → http://localhost:5173  
API → http://localhost:5000

## API Endpoints

| Method | Route                      | Description           |
|--------|----------------------------|-----------------------|
| GET    | `/api/todos`               | Get all todos         |
| GET    | `/api/todos?filter=active` | Get active todos      |
| POST   | `/api/todos`               | Create a todo         |
| PUT    | `/api/todos/:id`           | Toggle / update todo  |
| DELETE | `/api/todos/:id`           | Delete a todo         |
| DELETE | `/api/todos/completed`     | Bulk delete completed |
