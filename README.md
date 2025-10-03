# Insta Ecommerce - TypeScript Backend

A modern TypeScript-based Express.js backend application for e-commerce functionality.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **TypeScript** (v5.9.3+)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd insta-ecommerce
   ```

2. **Install dependencies**

   ```bash
   # Install all dependencies (production + development)
   npm install

   # Or install only production dependencies
   npm install --production

   # Or install only development dependencies
   npm install --only=dev
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Access the application**
   - Server runs on: `http://localhost:3030`
   - API endpoint: `GET /` returns "Working"

## 📦 Dependencies

### Production Dependencies

- **express** (^5.1.0) - Web framework for Node.js

### Development Dependencies

- **@types/express** (^5.0.3) - TypeScript definitions for Express
- **@types/node** (^24.6.2) - TypeScript definitions for Node.js
- **nodemon** (^3.1.10) - Development server with auto-restart
- **ts-node** (^10.9.2) - TypeScript execution environment for Node.js
- **typescript** (^5.9.3) - TypeScript compiler

## 🛠️ Development Workflow

### Available Scripts

```bash
# Start development server with hot reload
npm start

# Run tests (placeholder)
npm test
```

### Development Server Configuration

The project uses **Nodemon** for development with the following configuration (`nodemon.json`):

```json
{
  "watch": ["src"],
  "extensions": ".js, .ts",
  "exec": "npx ts-node ./src/index.ts"
}
```

**What this means:**

- Watches the `src/` directory for changes
- Restarts server on `.js` and `.ts` file changes
- Executes TypeScript files directly using `ts-node`

## TypeScript Configuration

### Key TypeScript Settings (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "module": "nodenext", // Modern Node.js module system
    "target": "esnext", // Latest ECMAScript features
    "strict": true, // Enable all strict type checking
    "verbatimModuleSyntax": true, // Preserve import/export syntax
    "isolatedModules": true, // Ensure each file can be transpiled independently
    "sourceMap": true, // Generate source maps for debugging
    "declaration": true, // Generate .d.ts files
    "declarationMap": true, // Generate source maps for declarations
    "noUncheckedIndexedAccess": true, // Require index access checks
    "exactOptionalPropertyTypes": true // Strict optional property handling
  }
}
```

### TypeScript Best Practices

1. **Type Imports**: Use `type` keyword for type-only imports

   ```typescript
   import express, { type Express, type Request, type Response } from "express";
   ```

2. **Explicit Typing**: Add explicit types for better code documentation

   ```typescript
   const app: Express = express();
   app.get("/", (req: Request, res: Response) => {
     res.send("Working");
   });
   ```

3. **Strict Mode**: All strict type checking options are enabled for maximum type safety

## 📁 Project Structure

```
insta-ecommerce/
├── src/
│   └── index.ts          # Main application entry point
├── controllers/          # Route controllers (empty)
├── exceptions/           # Custom exceptions (empty)
├── middlewares/          # Express middlewares (empty)
├── node_modules/         # Dependencies (ignored by git)
├── .gitignore           # Git ignore rules
├── nodemon.json         # Nodemon configuration
├── package.json         # Project metadata and dependencies
├── package-lock.json    # Dependency lock file
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## 🔄 Development vs Production

### Development Mode

- Uses `ts-node` to run TypeScript directly
- Hot reload with Nodemon
- Source maps enabled for debugging
- Type checking on every change

### Production Mode

- Compile TypeScript to JavaScript first
- Run compiled JavaScript with Node.js
- No hot reload
- Optimized for performance

### Building for Production

```bash
# Compile TypeScript to JavaScript
npx tsc

# Run the compiled JavaScript
node dist/index.js
```

## Debugging

### VS Code Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug TypeScript",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector"
    }
  ]
}
```

### Source Maps

Source maps are enabled in `tsconfig.json`, allowing you to:

- Debug TypeScript code directly
- Set breakpoints in `.ts` files
- See original TypeScript code in stack traces

## Environment Variables

Create a `.env` file for environment-specific configuration:

```bash
# .env
PORT=3030
NODE_ENV=development
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

**Important**: Never commit `.env` files to version control!

## Code Style & Linting

### Recommended VS Code Extensions

- **TypeScript Importer** - Auto-import TypeScript modules
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **Auto Rename Tag** - Auto-rename paired tags
- **Bracket Pair Colorizer** - Colorize matching brackets

### TypeScript Code Style

```typescript
//  Good: Explicit types
import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response): void => {
  res.send("Working");
});

// Good: Type-only imports
import type { User } from "./types/user";

// Good: Strict null checks
function getUser(id: string): User | null {
  // Implementation
}
```

## Deployment

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3030

CMD ["node", "dist/index.js"]
```

### Environment-Specific Builds

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Staging
NODE_ENV=staging npm start
```

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeScript Node.js Starter](https://github.com/microsoft/TypeScript-Node-Starter)

## 📄 License

This project is licensed under the ISC License.

## Troubleshooting

### Common Issues

1. **Module not found errors**

   ```bash
   npm install
   ```

2. **TypeScript compilation errors**

   ```bash
   npx tsc --noEmit
   ```

3. **Port already in use**

   ```bash
   # Kill process on port 3030
   lsof -ti:3030 | xargs kill -9
   ```

4. **Permission denied errors**
   ```bash
   sudo npm install
   ```

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Create a new issue with detailed error information
- Include Node.js version, npm version, and error logs

---

**Happy coding! 🎉**
