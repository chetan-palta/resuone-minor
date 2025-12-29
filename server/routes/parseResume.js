import mammoth from 'mammoth';
import sanitizeHtml from 'sanitize-html';
import fs from 'fs';
import { createRequire } from 'module';
import { parseTextToResumeJson } from '../utils/parser.js';

const require = createRequire(import.meta.url);
// pdf-parse v2 exports PDFParse as a class
const pdfParseModule = require('pdf-parse');
const PDFParse = pdfParseModule.PDFParse;

export async function parseResume(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const mime = file.mimetype;
    let text = '';

    try {
      if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
          file.originalname.endsWith('.docx')) {
        const result = await mammoth.convertToHtml({ path: file.path });
        const html = sanitizeHtml(result.value, {
          allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          allowedAttributes: {}
        });
        text = html.replace(/<[^>]+>/g, '\n').replace(/\n{2,}/g, '\n').trim();
      } else if (mime === 'application/pdf' || file.originalname.endsWith('.pdf')) {
        const data = fs.readFileSync(file.path);
        // pdf-parse v2 uses class-based API: new PDFParse({ data }) then getText()
        const parser = new PDFParse({ data });
        // getText with parseHyperlinks enabled and pageJoiner disabled to avoid page markers
        const result = await parser.getText({ 
          parseHyperlinks: true,
          pageJoiner: '' // Disable page markers like "-- 1 of 1 --"
        });
        text = result.text;
        
        // Remove any remaining page markers that might have been added
        text = text.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '');
        text = text.replace(/page\s+\d+\s+of\s+\d+/gi, '');
        
        // Also try to get page links if available
        try {
          const info = await parser.getInfo({ parsePageInfo: true });
          if (info && info.pages) {
            // Extract URLs from page info if available
            const pageLinks = [];
            for (const page of info.pages) {
              if (page.links) {
                pageLinks.push(...page.links.map(link => link.url || link.uri || '').filter(Boolean));
              }
            }
            if (pageLinks.length > 0) {
              text += '\n' + pageLinks.join('\n');
            }
          }
        } catch (linkError) {
          // If link extraction fails, continue with text only
          // The improved URL regex in parser.js will still catch URLs from text
        }
      } else {
        // Cleanup and return error
        fs.unlinkSync(file.path);
        return res.status(415).json({ error: 'Unsupported file type' });
      }

      // Parse text into resume JSON
      const resumeJson = parseTextToResumeJson(text);

      // Analyze resume
      const { analyzeResumeLogic } = await import('../utils/analyzer.js');
      const analysis = await analyzeResumeLogic(resumeJson);

      // Cleanup temp file
      fs.unlinkSync(file.path);

      return res.json({
        parsedResume: resumeJson,
        suggestions: analysis.suggestions,
        atsScore: analysis.atsScore
      });
    } catch (parseError) {
      // Cleanup on error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw parseError;
    }
  } catch (err) {
    console.error('Parse error:', err);
    return res.status(500).json({ 
      error: 'parse_failed', 
      detail: err.message 
    });
  }
}

