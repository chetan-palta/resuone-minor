# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment

Create `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_API_URL=http://localhost:3001
```

## 3. Start Development Servers

**Option A: Run Both (Recommended)**
```bash
npm run dev:all
```

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## 4. Configure Supabase

Follow `SUPABASE_SETUP.md` for:
- Getting Supabase credentials
- Enabling Google OAuth
- Database setup

## 5. Test Everything

Follow `TESTING_GUIDE.md` for comprehensive testing.

## Quick Test Checklist

- [ ] Backend server running on port 3001
- [ ] Frontend running on port 5173 or 8080
- [ ] Dark mode toggle works (landing page, dashboard, editor)
- [ ] Resume import works (DOCX/PDF)
- [ ] Google Sign-In works
- [ ] Resume saving works
- [ ] 5-resume limit enforced

## Troubleshooting

**Import fails:**
- Check backend server is running
- Check CORS settings
- Check file size (< 10MB)

**Google Sign-In fails:**
- Verify OAuth configured in Supabase
- Check redirect URIs match

**Theme doesn't work:**
- Check browser localStorage enabled
- Clear cache and try again

