# Server Fix - esbuild Error Resolved

## Problem
```
Failed running 'server/index.js'
```

## Root Cause
- `server/package.json` was causing conflicts
- All dependencies are in root `package.json`
- Server should use root dependencies

## Fix Applied
1. ✅ Deleted `server/package.json` (redundant)
2. ✅ Verified all server dependencies in root `package.json`
3. ✅ Server now uses root `node_modules`

## How to Run Server

### Option 1: With Watch (Auto-restart)
```bash
npm run dev:server
```

### Option 2: Without Watch
```bash
npm run server
```

### Option 3: Both Frontend + Backend
```bash
npm run dev:all
```

## Verify Server is Running

1. Check terminal output:
   ```
   Server running on port 3001
   ```

2. Test health endpoint:
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok"}`

3. Check browser console:
   - No CORS errors
   - API calls succeed

## Dependencies Verified
All server dependencies are installed:
- ✅ express
- ✅ cors
- ✅ multer
- ✅ mammoth
- ✅ pdf-parse
- ✅ sanitize-html
- ✅ express-rate-limit

## If Still Having Issues

1. **Reinstall dependencies:**
   ```bash
   npm install
   ```

2. **Check Node version:**
   ```bash
   node --version
   ```
   Should be 18.11.0+ for `--watch` flag

3. **Run without watch:**
   ```bash
   npm run server
   ```

4. **Check for port conflicts:**
   ```bash
   netstat -ano | findstr :3001
   ```

