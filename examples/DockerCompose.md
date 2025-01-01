What is Docker Compose?
=======================

Docker Compose is a tool used for defining and managing multi-container Docker applications. 
It allows you to describe your application stack (services, networks, and volumes) in a single YAML file (docker-compose.yml) 
and deploy it with a single command.

Key Features of Docker Compose
===============================

Multi-Container Management: Manage multiple services in one configuration file.
Declarative Configuration: Define all services, networks, and volumes in a YAML file.
Service Orchestration: Start, stop, and rebuild all services with a single command.
Networking: Automatically creates a dedicated network for services to communicate.
Environment Variables: Use .env files to customize configurations for different environments.
Portability: Easily share configurations for consistent deployments across environments.

3-Tier Application Example
============================

We’ll build a simple 3-tier application with:

Frontend: Nginx
Backend: Node.js
Database: MySQL
Here’s how to create it from scratch:

Directory Structure
go
Copy code
3-tier-app/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── app.js
│   ├── package.json
├── frontend/
│   ├── Dockerfile
│   └── default.conf

1. docker-compose.yml
 ===============
Define the entire application stack in this file.

yaml
Copy code
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      - DB_HOST=db
      - DB_USER=root
      - DB_PASSWORD=password
    networks:
      - app-network

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: mydb
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:
2. Backend (Node.js)
backend/Dockerfile
dockerfile
Copy code
FROM node:18

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "app.js"]
backend/package.json
json
Copy code
{
  "name": "backend",
  "version": "1.0.0",
  "main": "app.js",
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.3.0"
  }
}
backend/app.js
javascript
Copy code
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 5000;

// Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'mydb'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
3. Frontend (Nginx)
frontend/Dockerfile
dockerfile
Copy code
FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/

EXPOSE 80
frontend/default.conf
nginx
Copy code
server {
    listen 80;

    location / {
        proxy_pass http://backend:5000;
    }
}
How to Run the Application
Navigate to the Project Directory:

bash
Copy code
cd 3-tier-app
Build and Start the Application:

bash
Copy code
docker-compose up --build
Access the Application:

Frontend: http://localhost:8080
Backend: http://localhost:5000
Stop and Clean Up:

bash
Copy code
docker-compose down
