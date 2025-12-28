# Supabase Configuration Guide

## Step 1: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select existing one
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`

## Step 2: Configure Environment Variables

Create `.env` file in project root:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Backend Server (optional - for resume parsing)
VITE_API_URL=http://localhost:3001
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## Step 3: Enable Google OAuth

### 3.1 Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure:
   - **Application type**: Web application
   - **Name**: ResuOne
   - **Authorized redirect URIs**: 
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
   - For local development, also add:
     ```
     http://localhost:5173/auth/v1/callback
     ```
6. Copy **Client ID** and **Client Secret**

### 3.2 Configure in Supabase

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **Google** and click to enable
3. Enter:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)
4. Click **Save**

### 3.3 Configure Redirect URL

1. In Supabase Dashboard, go to **Authentication** > **URL Configuration**
2. Add to **Redirect URLs**:
   ```
   http://localhost:5173/**
   https://your-domain.com/**
   ```

## Step 4: Database Setup

The database tables should already be created via migrations. Verify:

1. Go to **Table Editor** in Supabase Dashboard
2. Check these tables exist:
   - `profiles`
   - `resumes`

If tables don't exist, run the migration:
```sql
-- Check supabase/migrations/20251202195414_*.sql
```

## Step 5: Test Configuration

### 5.1 Start Backend Server (for resume parsing)

```bash
npm run dev:server
```

### 5.2 Start Frontend

```bash
npm run dev
```

### 5.3 Test Google Sign-In

1. Go to `/auth` page
2. Click "Sign in with Google"
3. Should redirect to Google login
4. After login, should redirect back to `/dashboard`

### 5.4 Test Resume Import

1. Go to `/edit` page
2. Click upload icon (top right)
3. Upload a DOCX or PDF resume
4. Should parse and load into editor

## Troubleshooting

### Google OAuth Not Working

- Check redirect URI matches exactly in Google Cloud Console
- Verify Client ID and Secret are correct
- Check Supabase logs: **Logs** > **Auth Logs**

### Import Fails

- Ensure backend server is running: `npm run dev:server`
- Check server logs for errors
- Verify file is valid DOCX or PDF (< 10MB)

### Database Errors

- Verify RLS policies are enabled
- Check user has proper permissions
- Review migration files in `supabase/migrations/`

## Production Deployment

1. Update environment variables in production
2. Update Google OAuth redirect URIs with production domain
3. Update Supabase redirect URLs with production domain
4. Ensure backend server is deployed or use Supabase Edge Functions

