# 🔐 Authentication System - Implementation Guide

## Overview

Complete authentication system with login, register, and protected routes including "Remember Me" functionality using localStorage/sessionStorage.

## Features

### ✅ Login Page

- Beautiful, responsive design with gradient background
- Email and password validation
- **Remember Me checkbox** - persists login across browser sessions
- Error handling with user-friendly messages
- Loading states during authentication
- Link to register page
- Forgot password link (placeholder)

### ✅ Register Page

- Full name, email, and password fields
- Password confirmation with validation
- Real-time form validation
- Password strength requirements (minimum 6 characters)
- Email format validation
- Error messages for each field
- Auto-login after successful registration

### ✅ Protected Routes

- All main app routes require authentication
- Automatic redirect to login page if not authenticated
- Preserves intended destination after login
- Loading state while checking authentication

### ✅ Authentication Context

- Centralized auth state management
- React Context API for global state
- Automatic persistence:
  - **Remember Me = ON**: Stores in `localStorage` (persists across sessions)
  - **Remember Me = OFF**: Stores in `sessionStorage` (cleared on tab close)
- Auto-logout functionality
- Token management

## File Structure

```
client/src/
├── api/
│   └── auth.ts                    # Auth API client (mock implementation)
├── contexts/
│   └── AuthContext.tsx            # Auth state management
├── features/
│   └── auth/
│       ├── LoginPage.tsx          # Login page component
│       └── RegisterPage.tsx       # Register page component
├── components/
│   ├── ProtectedRoute.tsx         # Route guard component
│   └── Layout.tsx                 # Updated with logout button
└── app/
    └── app.tsx                    # Updated with auth routes
```

## Routes

### Public Routes (Accessible without login)

- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Require authentication)

- `/` - Home feed
- `/semantic-search` - Semantic search
- `/student-dashboard` - Student dashboard
- `/user-profile` - User profile
- `/settings` - Settings

## How It Works

### 1. Login Flow

```
User enters credentials + checks "Remember Me"
  ↓
LoginPage calls auth.login()
  ↓
AuthContext saves user data:
  - If Remember Me: localStorage (persistent)
  - If not: sessionStorage (session only)
  ↓
Navigate to home page "/"
```

### 2. Register Flow

```
User fills registration form
  ↓
Validation checks:
  - Name required
  - Valid email format
  - Password ≥ 6 characters
  - Passwords match
  ↓
RegisterPage calls auth.register()
  ↓
AuthContext auto-saves to localStorage
  ↓
Navigate to home page "/"
```

### 3. Protected Route Flow

```
User tries to access protected route
  ↓
ProtectedRoute checks isAuthenticated
  ↓
If authenticated: Render page
If not: Redirect to /login
```

### 4. Remember Me Implementation

```typescript
// ON LOGIN
if (rememberMe) {
  localStorage.setItem('knownet_auth', JSON.stringify({
    user: { ... },
    token: '...'
  }));
  localStorage.setItem('knownet_remember_me', 'true');
} else {
  sessionStorage.setItem('knownet_auth', JSON.stringify({
    user: { ... },
    token: '...'
  }));
}

// ON APP LOAD
if (localStorage.getItem('knownet_remember_me') === 'true') {
  // Load from localStorage
} else {
  // Load from sessionStorage
}
```

## Testing

### Test Login

1. Navigate to `http://localhost:4200/login`
2. Enter any email and password (mock auth accepts anything)
3. Check/uncheck "Remember Me"
4. Click "Sign In"
5. Should redirect to home page

**Test Remember Me:**

- Login with "Remember Me" ON
- Close browser completely
- Reopen → Still logged in ✅

- Login with "Remember Me" OFF
- Close tab
- Reopen → Logged out ✅

### Test Register

1. Navigate to `http://localhost:4200/register`
2. Fill in all fields
3. Password must be 6+ characters
4. Passwords must match
5. Click "Create Account"
6. Should redirect to home page

### Test Protected Routes

1. Open private/incognito window
2. Navigate to `http://localhost:4200/`
3. Should redirect to `/login`

### Test Logout

1. Login successfully
2. Click "Logout" in sidebar
3. Should redirect to login page
4. Try accessing `/` → Redirected to login ✅

## LocalStorage Keys

- `knownet_auth` - Stores user and token data
- `knownet_remember_me` - Boolean flag for persistence type

## Current Implementation Status

### ✅ Implemented

- Login page UI
- Register page UI
- Auth context with persistence
- Protected routes
- Logout functionality
- Remember me feature
- Form validation

### 🔄 Mock Implementation (To be replaced with real backend)

- `api/auth.ts` - Currently returns mock data
- No actual API calls yet
- Accepts any credentials

## Next Steps - Backend Integration

### 1. Create Backend Auth Endpoints

```typescript
// api/src/auth/auth.controller.ts
POST / api / auth / register;
POST / api / auth / login;
POST / api / auth / logout;
POST / api / auth / refresh;
GET / api / auth / me;
```

### 2. Implement JWT Tokens

```typescript
// On login, return:
{
  user: { _id, email, name, profileImageUrl },
  token: "eyJhbGc...",  // JWT token
  refreshToken: "..."   // Optional refresh token
}
```

### 3. Update Frontend API Client

```typescript
// client/src/api/auth.ts
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post('/api/auth/login', credentials);
  return response.data;
};
```

### 4. Add Token to API Requests

```typescript
// client/src/api/axios-instance.ts
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('knownet_auth');
  if (token) {
    const { token: authToken } = JSON.parse(token);
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});
```

### 5. Handle Token Expiration

```typescript
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout or refresh
      logout();
      navigate('/login');
    }
    return Promise.reject(error);
  },
);
```

## Security Considerations

### Current (Mock)

- ⚠️ Accepts any credentials
- ⚠️ No actual token validation
- ⚠️ For development only

### Production Requirements

- ✅ Hash passwords with bcrypt
- ✅ Use JWT tokens with expiration
- ✅ Implement HTTPS only
- ✅ Add CSRF protection
- ✅ Rate limit login attempts
- ✅ Validate all inputs server-side
- ✅ Implement refresh token rotation

## Design Features

### Visual Excellence

- ✨ Gradient backgrounds with primary color
- 🎨 Material Icons for visual appeal
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🎭 Smooth transitions and hover effects
- 💫 Loading states with spinners
- ⚡ Form validation with inline errors

### UX Best Practices

- Clear error messages
- Disabled states during submission
- Remember user preference
- Preserve destination after login
- Auto-focus on first input
- Keyboard accessible
- Loading indicators

## Troubleshooting

### Issue: Not redirecting after login

**Solution**: Check browser console for errors, ensure routes are properly configured

### Issue: Remember Me not working

**Solution**: Check browser's localStorage/sessionStorage settings, ensure not in private mode

### Issue: Logout doesn't work

**Solution**: Verify AuthContext is properly wrapping the app in app.tsx

### Issue: Can access protected routes without login

**Solution**: Ensure ProtectedRoute component is wrapping the Layout

## Usage Example

```typescript
// In any component, access auth state:
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.name}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

**Status**: ✅ Ready for testing with mock authentication  
**Next**: Integrate with real backend API
