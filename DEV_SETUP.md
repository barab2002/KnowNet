# ✅ Backend Hot-Reload Setup - SUCCESS!

## Current Status

**Backend is running with automatic restart on file changes!** 🎉

## How It Works

The setup uses a **two-process approach**:

1. **Webpack (Watch Mode)**: Compiles TypeScript → JavaScript on every file change
   - Watches: `api/src/**/*`
   - Output: `dist/api/main.js`
   - Features: TypeScript compilation, Type-checking, Fast incremental builds

2. **Nodemon**: Monitors compiled output and restarts the server
   - Watches: `dist/api/**/*`
   - Delay: 1 second (allows webpack to finish)
   - Runs: `node dist/api/main.js`

## Commands

### Start Development Server

```bash
npm run dev:api
```

### What You'll See

```
✓ webpack compiled successfully
✓ Type-checking in progress...
✓ No errors found
✓ 🚀 Application is running on: http://localhost:3000/api
✓ 📚 Swagger documentation available at: http://localhost:3000/api/docs
[nodemon] watching path(s): ../dist/api/**/*
[nodemon] watching extensions: js
[nodemon] to restart at any time, enter `rs`
```

## Development Workflow

1. **Make changes** to any file in `api/src/`
   - `api/src/users/users.service.ts`
   - `api/src/main.ts`
   - etc.

2. **Save the file** (Ctrl+S / Cmd+S)

3. **Watch the magic happen**:

   ```
   webpack compiled successfully
   Type-checking in progress...
   No errors found.
   [nodemon] restarting due to changes...
   [nodemonrestmain.js
   🚀 Application is running on: http://localhost:3000/api
   ```

4. **Test immediately** - no need to restart manually!

## Server Endpoints

Once running, you can access:

- **API Base**: http://localhost:3000/api
- **API Docs (Swagger)**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api
- **User Profile**: http://localhost:3000/api/users/current-user-id
- **Posts**: http://localhost:3000/api/posts

## Profile Page Endpoints

Test these with the frontend:

```bash
# Get user profile
GET http://localhost:3000/api/users/current-user-id

# Update profile
PUT http://localhost:3000/api/users/current-user-id
Content-Type: application/json
{
  "name": "Test User",
  "bio":  "Testing the profile page!",
  "major": "Computer Science"
}

# Upload profile image
POST http://localhost:3000/api/users/current-user-id/profile-image
Content-Type: multipart/form-data
image: [file]
```

## Tips

- **Manual Restart**: Type `rs` and press Enter in the terminal
- **Stop Server**: Press `Ctrl+C` or type `q` in the NX UI
- **View Logs**: All console.log() statements will appear in the terminal
- **Debugging**: The server runs on port 3000 by default

## Troubleshooting

### Server doesn't restart after changes

- Wait 1-2 seconds (webpack needs time to compile)
- Check the terminal for compilation errors
- Make sure you saved the file

### Port 3000 already in use

- Stop any other process using port 3000
- Or change PORT in `.env` file

### MongoDB connection error

- Make sure MongoDB is running
- Check `MONGO_URI` in `.env` file
- Default: `mongodb://localhost:27017/knownet`

## What's Next

Now you can:

1. ✅ Run frontend: `npm run start` (in a new terminal)
2. ✅ Test the profile page functionality
3. ✅ Upload profile images
4. ✅ Edit user profiles
5. ✅ See changes in real-time!

## Technical Details

**Modified Files:**

- `api/project.json` - Updated serve target to use webpack watch + nodemon
- `package.json` - Added `dev:api` script
- Installed: `nodemon`, `ts-node`, `tsx`

**Why This Approach?**

- ✅ Compatible with Node v18.12.0
- ✅ No ESM loader issues
- ✅ Fast recompilation with webpack
- ✅ Reliable file watching
- ✅ TypeScript type-checking included
- ✅ Works with NestJS decorators and metadata
