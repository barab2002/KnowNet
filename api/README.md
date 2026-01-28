# KnowNet API

Backend API for the KnowNet application built with NestJS.

## Quick Start

1. **Build and run the API:**
   ```bash
   npm run run:api
   ```

   Or manually:
   ```bash
   # Build the API
   npx cross-env NX_DAEMON=false nx build api
   
   # Run the built application
   node dist/api/main.js
   ```

2. **Access the API:**
   - **Base URL:** http://localhost:3000/api
   - **Swagger Documentation:** http://localhost:3000/api/docs
   - **Health Check:** http://localhost:3000/api/health

## Available Endpoints

### Health Check
- **GET** `/api/health`
  - Returns the service health status
  - Response:
    ```json
    {
      "status": "ok",
      "timestamp": "2026-01-28T20:06:45.568Z",
      "uptime": 127.4261365,
      "service": "KnowNet API"
    }
    ```

### Welcome Message
- **GET** `/api`
  - Returns a simple welcome message
  - Response:
    ```json
    {
      "message": "Hello API"
    }
    ```

## API Documentation

The API includes **Swagger/OpenAPI** documentation that provides:
- Interactive API testing
- Detailed endpoint descriptions
- Request/response schemas
- Try-it-out functionality

Visit http://localhost:3000/api/docs to explore the full API documentation.

## Troubleshooting

If you encounter the error: `Cannot transfer object of unsupported type`, this is due to an Nx daemon issue. Use the `npm run run:api` command which bypasses the daemon.

## Tech Stack

- **NestJS** - Backend framework
- **Swagger/OpenAPI** - API documentation
- **Webpack** - Build tool
- **TypeScript** - Programming language
