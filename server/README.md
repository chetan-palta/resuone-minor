# ResuOne Backend Server

Express server for resume parsing and analysis.

## Setup

1. Install dependencies (already installed in root):
```bash
npm install
```

2. Create `.env` file in root directory:
```
PORT=3001
FRONTEND_URL=http://localhost:5173
```

3. Start the server:
```bash
npm run dev:server
# or
npm run server
```

## Endpoints

### POST /api/parse-resume
Parses DOCX or PDF resume files.

**Request:**
- `multipart/form-data` with `file` field
- Max file size: 10MB
- Supported formats: `.docx`, `.pdf`

**Response:**
```json
{
  "parsedResume": { ... },
  "suggestions": [ ... ],
  "atsScore": 72
}
```

### POST /api/analyze-resume
Analyzes resume JSON and returns suggestions.

**Request:**
```json
{
  "resumeJson": { ... }
}
```

**Response:**
```json
{
  "suggestions": [ ... ],
  "atsScore": 72
}
```

### POST /api/save-imported-resume
Validates resume (actual saving done via Supabase from frontend).

## Development

Run both frontend and backend:
```bash
npm run dev:all
```

