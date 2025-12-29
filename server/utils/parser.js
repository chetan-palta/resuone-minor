import { v4 as uuidv4 } from 'uuid';

export function parseTextToResumeJson(text) {
  // Clean up text: remove page markers and extra whitespace
  text = text.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '');
  text = text.replace(/page\s+\d+\s+of\s+\d+/gi, '');
  text = text.replace(/\n{3,}/g, '\n\n'); // Normalize multiple newlines
  
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(line => {
    // Filter out empty lines and page markers
    if (!line) return false;
    if (/^--\s*\d+\s+of\s+\d+\s*--$/i.test(line)) return false;
    if (/^page\s+\d+\s+of\s+\d+$/i.test(line)) return false;
    return true;
  });
  
  const resume = {
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
      summary: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    sections: [
      { id: 'personal', type: 'personal', visible: true, order: 0 },
      { id: 'experience', type: 'experience', visible: true, order: 1 },
      { id: 'education', type: 'education', visible: true, order: 2 },
      { id: 'skills', type: 'skills', visible: true, order: 3 },
      { id: 'projects', type: 'projects', visible: true, order: 4 },
      { id: 'certifications', type: 'certifications', visible: true, order: 5 },
    ],
    title: 'Imported Resume',
    templateId: 'professional',
    accentColor: '#2563eb',
    fontFamily: 'inter'
  };

  let currentSection = null;
  let currentEntry = null;
  let summaryLines = [];
  let inSummary = true;

  // Extract all URLs from entire text first (before line-by-line parsing)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][a-zA-Z0-9-]*\.(com|org|net|io|dev|co|me|edu|gov)[^\s]*)/gi;
  const allUrls = [];
  const fullText = text.toLowerCase();
  
  // Find all URLs in the text
  let urlMatch;
  while ((urlMatch = urlRegex.exec(text)) !== null) {
    let url = urlMatch[0].trim();
    // Clean up URL (remove trailing punctuation)
    url = url.replace(/[.,;:!?]+$/, '');
    if (url && !allUrls.includes(url)) {
      allUrls.push(url);
    }
  }

  // Extract contact info first
  let hasEmail = false;
  let hasPhone = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Email
    const emailMatch = line.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    if (emailMatch && !resume.personal.email) {
      resume.personal.email = emailMatch[0];
      hasEmail = true;
      continue;
    }

    // Phone
    const phoneMatch = line.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch && !resume.personal.phone) {
      resume.personal.phone = phoneMatch[0];
      hasPhone = true;
      continue;
    }

    // LinkedIn - check line and all URLs
    if (lower.includes('linkedin.com') || lower.includes('linkedin')) {
      const linkedinMatch = line.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([\w-]+)/i) || 
                           line.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/profile\/view\?id=([\w-]+)/i);
      if (linkedinMatch) {
        resume.personal.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : 'https://' + linkedinMatch[0];
      } else {
        // Check all URLs for LinkedIn
        const linkedinUrl = allUrls.find(url => url.toLowerCase().includes('linkedin.com/in/') || url.toLowerCase().includes('linkedin.com/profile'));
        if (linkedinUrl) {
          resume.personal.linkedin = linkedinUrl.startsWith('http') ? linkedinUrl : 'https://' + linkedinUrl;
        }
      }
      continue;
    }

    // GitHub - check line and all URLs
    if (lower.includes('github.com') || lower.includes('github')) {
      const githubMatch = line.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([\w-]+(?:\/[\w-]+)?)/i);
      if (githubMatch) {
        resume.personal.github = githubMatch[0].startsWith('http') ? githubMatch[0] : 'https://' + githubMatch[0];
      } else {
        // Check all URLs for GitHub
        const githubUrl = allUrls.find(url => url.toLowerCase().includes('github.com/'));
        if (githubUrl) {
          resume.personal.github = githubUrl.startsWith('http') ? githubUrl : 'https://' + githubUrl;
        }
      }
      continue;
    }

    // LeetCode
    if (lower.includes('leetcode.com') || lower.includes('leetcode')) {
      const leetcodeMatch = line.match(/(?:https?:\/\/)?(?:www\.)?leetcode\.com\/([\w-]+)/i);
      if (leetcodeMatch) {
        resume.personal.website = leetcodeMatch[0].startsWith('http') ? leetcodeMatch[0] : 'https://' + leetcodeMatch[0];
      } else {
        const leetcodeUrl = allUrls.find(url => url.toLowerCase().includes('leetcode.com/'));
        if (leetcodeUrl && !resume.personal.website) {
          resume.personal.website = leetcodeUrl.startsWith('http') ? leetcodeUrl : 'https://' + leetcodeUrl;
        }
      }
      continue;
    }

    // Website - check for any URL in the line or all URLs
    if ((lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('www.')) 
        && !lower.includes('linkedin') && !lower.includes('github') && !lower.includes('leetcode')) {
      let url = line.trim();
      url = url.replace(/[.,;:!?]+$/, ''); // Remove trailing punctuation
      if (!resume.personal.website) {
        resume.personal.website = url.startsWith('http') ? url : (url.startsWith('www.') ? 'https://' + url : url);
      }
      continue;
    }

    // Location
    if (!resume.personal.location && (lower.includes('location') || lower.includes('address'))) {
      const locationMatch = line.match(/location[:\s]+(.+)/i) || line.match(/address[:\s]+(.+)/i);
      if (locationMatch) {
        resume.personal.location = locationMatch[1].trim();
      }
    }
  }

  // If we haven't found website yet, check all URLs for portfolio/personal sites
  if (!resume.personal.website && allUrls.length > 0) {
    const portfolioUrl = allUrls.find(url => {
      const lowerUrl = url.toLowerCase();
      return !lowerUrl.includes('linkedin') && 
             !lowerUrl.includes('github') && 
             !lowerUrl.includes('leetcode') &&
             (lowerUrl.includes('portfolio') || lowerUrl.includes('personal') || 
              lowerUrl.match(/^https?:\/\/[^/]+$/)); // Simple domain without path
    });
    if (portfolioUrl) {
      resume.personal.website = portfolioUrl.startsWith('http') ? portfolioUrl : 'https://' + portfolioUrl;
    }
  }

  // Parse sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase().trim();

    // Detect section headers - improved pattern matching
    // Check for headers that might be in ALL CAPS, Title Case, or with colons
    const headerPattern = /^[A-Z\s:]+$/;
    const isLikelyHeader = headerPattern.test(line) && line.length < 50 && line.split(' ').length <= 5;
    
    // Experience section
    if (/^(experience|work experience|professional experience|employment|work history|employment history|professional background)/i.test(lower) || 
        (isLikelyHeader && /experience|employment|work/i.test(lower))) {
      currentSection = 'experience';
      inSummary = false;
      continue;
    }
    // Education section
    if (/^(education|academic|academic background|academic qualifications|qualifications|educational background)/i.test(lower) ||
        (isLikelyHeader && /education|academic|qualification/i.test(lower))) {
      currentSection = 'education';
      inSummary = false;
      continue;
    }
    // Projects section
    if (/^(projects?|project experience|personal projects|side projects|portfolio projects)/i.test(lower) ||
        (isLikelyHeader && /project/i.test(lower))) {
      currentSection = 'projects';
      inSummary = false;
      continue;
    }
    // Skills section
    if (/^(skills?|technical skills|core competencies|competencies|technical competencies|key skills)/i.test(lower) ||
        (isLikelyHeader && /skill|competenc/i.test(lower))) {
      currentSection = 'skills';
      inSummary = false;
      continue;
    }
    // Certifications section
    if (/^(certifications?|certificates?|certification|certifications and licenses)/i.test(lower) ||
        (isLikelyHeader && /certif/i.test(lower))) {
      currentSection = 'certifications';
      inSummary = false;
      continue;
    }
    // Summary/Objective section
    if (/^(summary|objective|profile|about|professional summary|career objective|executive summary)/i.test(lower) ||
        (isLikelyHeader && /summary|objective|profile|about/i.test(lower))) {
      currentSection = null;
      inSummary = true;
      continue;
    }

    // Skip if it's contact info we already extracted (but only if it's a standalone line)
    const isEmail = /^[\w\.-]+@[\w\.-]+\.\w+$/.test(line);
    const isPhone = /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(line);
    const isOnlyLink = /^(linkedin|github|website):\s*https?:\/\//i.test(lower);
    if ((isEmail || isPhone || isOnlyLink) && line.length < 100) {
      continue;
    }

    // Process based on current section
    if (inSummary && !currentSection) {
      if (line.length > 20) {
        summaryLines.push(line);
      }
    } else if (currentSection === 'experience') {
      // Try to detect new experience entry (company name, dates, etc.)
      const datePattern = /(\d{4}|\w+\s+\d{4}|\d{1,2}\/\d{4})/;
      const hasDate = datePattern.test(line);
      const hasCompany = line.includes(' at ') || line.includes('@') || line.includes(' - ');

      if (hasDate || hasCompany || (line.length < 100 && !line.startsWith('•') && !line.startsWith('-'))) {
        // New experience entry
        currentEntry = {
          id: uuidv4(),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          achievements: []
        };

        // Extract position and company
        if (line.includes(' at ')) {
          const parts = line.split(' at ');
          currentEntry.position = parts[0].trim();
          currentEntry.company = parts[1].split(/[–—\-]/)[0].trim();
        } else if (line.includes('@')) {
          const parts = line.split('@');
          currentEntry.position = parts[0].trim();
          currentEntry.company = parts[1].split(/[–—\-]/)[0].trim();
        } else {
          currentEntry.position = line;
        }

        // Extract dates
        const dates = line.match(/(\w+\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*[-–—]\s*(\w+\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|present|current)/i);
        if (dates) {
          currentEntry.startDate = dates[1];
          if (dates[2].toLowerCase() === 'present' || dates[2].toLowerCase() === 'current') {
            currentEntry.current = true;
            currentEntry.endDate = new Date().toISOString().split('T')[0];
          } else {
            currentEntry.endDate = dates[2];
          }
        }

        resume.experience.push(currentEntry);
      } else if (currentEntry) {
        // Bullet point or description - capture all content
        const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
        if (cleanLine.length > 0) {
          // Don't skip lines that might be content
          if (currentEntry.achievements.length === 0 && cleanLine.length > 50) {
            currentEntry.description = cleanLine;
          } else {
            // Add as achievement, but also append to description if it's long
            currentEntry.achievements.push(cleanLine);
            if (currentEntry.description && cleanLine.length > 20) {
              currentEntry.description += ' ' + cleanLine;
            }
          }
        }
      } else if (!currentSection) {
        // If no section detected yet, try to capture content that might be experience
        // This helps with resumes that don't have clear section headers
        const datePattern = /(\d{4}|\w+\s+\d{4})/;
        if (datePattern.test(line) && line.length < 150) {
          // Might be an experience entry
          currentEntry = {
            id: uuidv4(),
            company: '',
            position: line,
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
            achievements: []
          };
          resume.experience.push(currentEntry);
        }
      }
    } else if (currentSection === 'education') {
      const datePattern = /(\d{4}|\w+\s+\d{4})/;
      if (datePattern.test(line) || line.length < 80) {
        const edu = {
          id: uuidv4(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: ''
        };

        // Try to extract degree and institution
        if (line.includes(',')) {
          const parts = line.split(',');
          edu.degree = parts[0].trim();
          edu.institution = parts.slice(1).join(',').trim();
        } else {
          edu.institution = line;
        }

        // Extract dates
        const dates = line.match(/(\d{4}|\w+\s+\d{4})\s*[-–—]?\s*(\d{4}|\w+\s+\d{4})?/);
        if (dates) {
          edu.startDate = dates[1];
          if (dates[2]) edu.endDate = dates[2];
        }

        resume.education.push(edu);
      }
    } else if (currentSection === 'skills') {
      // Skills are usually comma-separated or bulleted
      if (line.length > 0 && !line.match(/^(skills?|technical skills)/i)) {
        // Don't skip lines that might contain skills
        const skills = line.split(/[,;•\-\*|]/).map(s => s.trim()).filter(Boolean);
        if (skills.length > 0) {
          // Check if we already have a category for this
          let category = resume.skills.find(s => s.category === 'Skills');
          if (!category) {
            category = {
              id: uuidv4(),
              category: 'Skills',
              skills: []
            };
            resume.skills.push(category);
          }
          // Add skills, filtering out very short or very long items
          const validSkills = skills.filter(s => s.length > 1 && s.length < 50 && !/^[0-9\-\s]+$/.test(s));
          if (validSkills.length > 0) {
            category.skills.push(...validSkills);
          }
        }
      }
    } else if (currentSection === 'projects') {
      // Project name detection - usually shorter lines without bullets
      if (line.length > 0 && line.length < 100 && !line.startsWith('•') && !line.startsWith('-') && !line.match(/^technolog/i)) {
        // Check if this looks like a project name (not a description)
        if (!line.match(/^[a-z]/) || line.length < 50) {
          resume.projects.push({
            id: uuidv4(),
            name: line,
            description: '',
            technologies: [],
            link: '',
            github: ''
          });
        } else if (resume.projects.length > 0) {
          // Might be description for last project
          const lastProject = resume.projects[resume.projects.length - 1];
          if (!lastProject.description) {
            lastProject.description = line;
          }
        }
      } else if (resume.projects.length > 0) {
        // Bullet point or description
        const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
        const lastProject = resume.projects[resume.projects.length - 1];
        if (cleanLine.length > 0) {
          if (cleanLine.toLowerCase().includes('technolog')) {
            // Extract technologies
            const techMatch = cleanLine.match(/technolog(?:ies|y):?\s*(.+)/i);
            if (techMatch) {
              lastProject.technologies = techMatch[1].split(/[,;]/).map(t => t.trim()).filter(Boolean);
            }
          } else if (!lastProject.description) {
            lastProject.description = cleanLine;
          } else {
            // Append to description
            lastProject.description += ' ' + cleanLine;
          }
        }
      }
    } else if (currentSection === 'certifications') {
      const cert = {
        id: uuidv4(),
        name: '',
        issuer: '',
        date: '',
        link: ''
      };

      if (line.includes(' - ')) {
        const parts = line.split(' - ');
        cert.name = parts[0].trim();
        cert.issuer = parts[1].trim();
      } else {
        cert.name = line;
      }

      // Extract date
      const dateMatch = line.match(/(\w+\s+\d{4}|\d{4})/);
      if (dateMatch) {
        cert.date = dateMatch[1];
      }

      resume.certifications.push(cert);
    }
  }

  // Set summary
  if (summaryLines.length > 0) {
    resume.personal.summary = summaryLines.join(' ');
  }

  // Set name from first line if not found
  if (!resume.personal.fullName && lines.length > 0) {
    const firstLine = lines[0];
    const isFirstLineEmail = /[\w\.-]+@[\w\.-]+\.\w+/.test(firstLine);
    const isFirstLinePhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(firstLine);
    if (!isFirstLineEmail && !isFirstLinePhone && firstLine.length < 50) {
      resume.personal.fullName = firstLine;
    }
  }

  return resume;
}

