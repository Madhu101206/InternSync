const pdf = require('pdf-parse');
const fs = require('fs');
const natural = require('natural');
const { WordTokenizer } = natural;
const compromise = require('compromise');

// Common skills database
const SKILLS_DB = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Go', 'Rust',
  'TypeScript', 'HTML', 'CSS', 'SQL', 'R', 'MATLAB', 'Scala', 'Perl', 'Dart',
  
  // Frameworks & Libraries
  'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
  'Ruby on Rails', 'TensorFlow', 'PyTorch', 'Keras', 'Pandas', 'NumPy', 'SciPy',
  
  // Tools & Technologies
  'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Firebase', 'MongoDB',
  'MySQL', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API', 'Jenkins', 'CI/CD',
  
  // Soft Skills
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Time Management',
  'Adaptability', 'Creativity', 'Critical Thinking', 'Project Management',
  
  // Domain-specific skills
  'Machine Learning', 'Data Analysis', 'Data Visualization', 'Web Development',
  'Mobile Development', 'UI/UX Design', 'Cloud Computing', 'DevOps', 'Cybersecurity',
  'Blockchain', 'Internet of Things', 'Artificial Intelligence', 'Natural Language Processing'
];

// Education degree patterns
const EDUCATION_PATTERNS = [
  /b\.?tech|bachelor of technology/gi,
  /b\.?e|bachelor of engineering/gi,
  /b\.?sc|bachelor of science/gi,
  /b\.?com|bachelor of commerce/gi,
  /b\.?a|bachelor of arts/gi,
  /m\.?tech|master of technology/gi,
  /m\.?e|master of engineering/gi,
  /m\.?sc|master of science/gi,
  /m\.?com|master of commerce/gi,
  /m\.?a|master of arts/gi,
  /ph\.?d|doctor of philosophy/gi,
  /diploma/gi
];

// Extract text from PDF
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to parse PDF: ' + error.message);
  }
};

// Extract skills from text
const extractSkills = (text) => {
  const tokenizer = new WordTokenizer();
  const tokens = tokenizer.tokenize(text);
  const foundSkills = new Set();
  
  // Check for skills in the text
  SKILLS_DB.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'gi');
    if (regex.test(text)) {
      foundSkills.add(skill);
    }
  });
  
  return Array.from(foundSkills);
};

// Extract education information
const extractEducation = (text) => {
  const education = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    for (const pattern of EDUCATION_PATTERNS) {
      if (pattern.test(line)) {
        // Use compromise to extract more details
        const doc = compromise(line);
        const institutions = doc.organizations().out('array');
        const dates = doc.dates().out('array');
        
        education.push({
          degree: line.trim(),
          institution: institutions.length > 0 ? institutions[0] : '',
          year: dates.length > 0 ? dates[0] : ''
        });
        break;
      }
    }
  }
  
  return education;
};

// Extract experience
const extractExperience = (text) => {
  const experience = [];
  const lines = text.split('\n');
  let currentExperience = null;
  
  for (const line of lines) {
    // Look for experience indicators
    if (line.match(/\b(?:worked|experience|intern|job|position|role)\b/gi)) {
      const doc = compromise(line);
      const organizations = doc.organizations().out('array');
      const dates = doc.dates().out('array');
      
      currentExperience = {
        title: line.trim(),
        company: organizations.length > 0 ? organizations[0] : '',
        duration: dates.length > 0 ? dates.join(', ') : '',
        description: line
      };
      
      experience.push(currentExperience);
    } else if (currentExperience && line.trim().length > 0) {
      // Add to current experience description
      currentExperience.description += ' ' + line;
    }
  }
  
  return experience;
};

// Main function to parse resume
const parseResume = async (filePath) => {
  try {
    const text = await extractTextFromPDF(filePath);
    
    const skills = extractSkills(text);
    const education = extractEducation(text);
    const experience = extractExperience(text);
    
    return {
      skills,
      education,
      experience,
      rawText: text.substring(0, 1000) + '...' // Store first 1000 chars for reference
    };
  } catch (error) {
    throw new Error('Resume parsing failed: ' + error.message);
  }
};

module.exports = { parseResume };