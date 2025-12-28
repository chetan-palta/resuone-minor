export async function analyzeResumeLogic(resumeJson) {
  const suggestions = [];
  let score = 50;

  // Contact info check
  if (!resumeJson.personal || (!resumeJson.personal.email && !resumeJson.personal.phone)) {
    suggestions.push({
      id: 'c1',
      priority: 'high',
      title: 'Add contact information',
      detail: 'Add email and phone number at the top of your resume for ATS compatibility',
      autoApply: false
    });
    score -= 20;
  } else {
    score += 5;
    if (resumeJson.personal.email && resumeJson.personal.phone) {
      score += 5;
    }
  }

  // Skills check
  const totalSkills = resumeJson.skills?.reduce((sum, cat) => sum + (cat.skills?.length || 0), 0) || 0;
  if (totalSkills < 5) {
    suggestions.push({
      id: 's1',
      priority: 'medium',
      title: 'Add more skills',
      detail: 'Add at least 5 core technical skills separated by commas for better ATS matching',
      autoApply: false
    });
    score -= 10;
  } else {
    score += Math.min(totalSkills, 15);
  }

  // Experience check
  if (!resumeJson.experience || resumeJson.experience.length === 0) {
    if (!resumeJson.projects || resumeJson.projects.length === 0) {
      suggestions.push({
        id: 'e1',
        priority: 'high',
        title: 'Add experience or projects',
        detail: 'ATS expects either professional experience or tangible projects. Add at least one.',
        autoApply: false
      });
      score -= 25;
    }
  } else {
    score += 15;
    
    // Check for metrics in experience
    let hasMetrics = false;
    resumeJson.experience.forEach(exp => {
      const bullets = exp.achievements || [];
      const description = exp.description || '';
      const allText = [...bullets, description].join(' ');
      if (/\d+%|\$\d+|\d+\s*(days|months|years|people|users|customers|revenue|increase|decrease|reduction)/i.test(allText)) {
        hasMetrics = true;
      }
    });

    if (!hasMetrics) {
      suggestions.push({
        id: 'e2',
        priority: 'medium',
        title: 'Add measurable metrics',
        detail: 'Add quantified results to your experience bullets (e.g., "Increased performance by 30%", "Managed team of 5")',
        autoApply: false
      });
      score -= 10;
    } else {
      score += 10;
    }

    // Check for action verbs
    let hasPassiveVerbs = false;
    resumeJson.experience.forEach(exp => {
      const bullets = exp.achievements || [];
      const description = exp.description || '';
      const allText = [...bullets, description].join(' ').toLowerCase();
      if (/\b(was|were|responsible for|duties included|assisted with)\b/.test(allText)) {
        hasPassiveVerbs = true;
      }
    });

    if (hasPassiveVerbs) {
      suggestions.push({
        id: 'e3',
        priority: 'low',
        title: 'Use action verbs',
        detail: 'Replace passive phrases like "was responsible for" with action verbs like "Led", "Managed", "Developed"',
        autoApply: true,
        patch: {
          type: 'replace_passive_verbs',
          examples: [
            { from: 'was responsible for', to: 'Led' },
            { from: 'assisted with', to: 'Supported' },
            { from: 'duties included', to: 'Managed' }
          ]
        }
      });
      score -= 5;
    }
  }

  // Education check
  if (!resumeJson.education || resumeJson.education.length === 0) {
    suggestions.push({
      id: 'ed1',
      priority: 'medium',
      title: 'Add education',
      detail: 'Include your educational background (degree, institution, dates)',
      autoApply: false
    });
    score -= 10;
  } else {
    score += 5;
  }

  // Summary check
  if (!resumeJson.personal?.summary || resumeJson.personal.summary.length < 50) {
    suggestions.push({
      id: 'sum1',
      priority: 'low',
      title: 'Add professional summary',
      detail: 'Add a 2-3 sentence professional summary highlighting your key qualifications',
      autoApply: false
    });
    score -= 5;
  } else {
    score += 5;
  }

  // Length check (rough estimate)
  const totalContent = JSON.stringify(resumeJson).length;
  if (totalContent < 500) {
    suggestions.push({
      id: 'l1',
      priority: 'medium',
      title: 'Resume too short',
      detail: 'Your resume appears too brief. Add more details to experience, projects, or skills.',
      autoApply: false
    });
    score -= 10;
  }

  // Date consistency check
  let hasDateIssues = false;
  resumeJson.experience?.forEach(exp => {
    if (exp.startDate && exp.endDate && !exp.current) {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);
      if (start > end) {
        hasDateIssues = true;
      }
    }
  });

  if (hasDateIssues) {
    suggestions.push({
      id: 'd1',
      priority: 'high',
      title: 'Fix date inconsistencies',
      detail: 'Some experience entries have start dates after end dates. Please review and correct.',
      autoApply: false
    });
    score -= 15;
  }

  // Clamp score
  if (score < 20) score = 20;
  if (score > 95) score = 95;

  return {
    suggestions,
    atsScore: Math.round(score)
  };
}

