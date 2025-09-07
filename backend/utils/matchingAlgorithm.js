const natural = require('natural');
const { TfIdf } = natural;

// Calculate match score between student and internship
const calculateMatchScore = (student, internship, matchingCriteria) => {
  let totalScore = 0;
  let factors = {
    skillMatch: 0,
    interestMatch: 0,
    locationMatch: 0,
    equityBoost: 0
  };

  // 1. Skill matching (40% weight)
  const skillMatchScore = calculateSkillMatch(student.skills, internship.requiredSkills, internship.preferredSkills);
  factors.skillMatch = skillMatchScore;
  totalScore += skillMatchScore * matchingCriteria.skillWeight;

  // 2. Interest matching (20% weight)
  const interestMatchScore = calculateInterestMatch(student.interests, student.preferredDomains, internship.domain);
  factors.interestMatch = interestMatchScore;
  totalScore += interestMatchScore * matchingCriteria.interestWeight;

  // 3. Location matching (20% weight)
  const locationMatchScore = calculateLocationMatch(student.preferredLocations, internship.location, internship.isRemote);
  factors.locationMatch = locationMatchScore;
  totalScore += locationMatchScore * matchingCriteria.locationWeight;

  // 4. Equity boost (20% weight)
  const equityBoostScore = calculateEquityBoost(student, internship);
  factors.equityBoost = equityBoostScore;
  totalScore += equityBoostScore * matchingCriteria.equityWeight;

  // Apply additional boosts
  if (student.demographicInfo.isRural) {
    totalScore += matchingCriteria.ruralBoost;
  }

  if (student.demographicInfo.isFromAspirationalDistrict) {
    totalScore += matchingCriteria.aspirationalDistrictBoost;
  }

  // Ensure score is between 0 and 1
  totalScore = Math.min(1, Math.max(0, totalScore));

  return {
    totalScore: Math.round(totalScore * 100),
    factors
  };
};

// Calculate skill match score
const calculateSkillMatch = (studentSkills, requiredSkills, preferredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return 0.5; // Neutral score if no requirements
  
  let matchedRequired = 0;
  let matchedPreferred = 0;
  
  // Check required skills
  requiredSkills.forEach(skill => {
    if (studentSkills.includes(skill)) {
      matchedRequired++;
    }
  });
  
  // Check preferred skills
  if (preferredSkills && preferredSkills.length > 0) {
    preferredSkills.forEach(skill => {
      if (studentSkills.includes(skill)) {
        matchedPreferred++;
      }
    });
  }
  
  const requiredScore = matchedRequired / requiredSkills.length;
  const preferredScore = preferredSkills && preferredSkills.length > 0 
    ? matchedPreferred / preferredSkills.length * 0.3 
    : 0;
  
  return Math.min(1, requiredScore + preferredScore);
};

// Calculate interest match score
const calculateInterestMatch = (studentInterests, studentPreferredDomains, internshipDomain) => {
  if (!studentInterests || studentInterests.length === 0) return 0.5;
  
  // Use TF-IDF for better interest matching
  const tfidf = new TfIdf();
  
  // Add student interests as a document
  tfidf.addDocument(studentInterests.join(' '));
  
  // Add internship domain as a query
  let score = 0;
  tfidf.tfidf(internshipDomain, 0, (i, measure) => {
    score = measure;
  });
  
  // Normalize score to 0-1 range
  const normalizedScore = Math.min(1, Math.max(0, score * 10));
  
  // Check if domain is in student's preferred domains
  const domainMatch = studentPreferredDomains && studentPreferredDomains.includes(internshipDomain) ? 0.2 : 0;
  
  return Math.min(1, normalizedScore + domainMatch);
};

// Calculate location match score
const calculateLocationMatch = (studentPreferredLocations, internshipLocation, isRemote) => {
  // If internship is remote, location doesn't matter
  if (isRemote) return 1;
  
  // If student has no location preferences, neutral score
  if (!studentPreferredLocations || studentPreferredLocations.length === 0) return 0.5;
  
  // Check if internship location is in student's preferred locations
  if (studentPreferredLocations.includes(internshipLocation)) {
    return 1;
  }
  
  // Partial match based on state or region could be implemented here
  return 0.2;
};

// Calculate equity boost based on reservation policies
const calculateEquityBoost = (student, internship) => {
  let boost = 0;
  
  // Check if internship has specific reservation policies
  if (internship.equityPreferences) {
    // Reserved for women
    if (internship.equityPreferences.reservedForWomen && student.personalInfo.gender === 'female') {
      boost += 0.3;
    }
    
    // Reserved for specific categories
    if (internship.equityPreferences.reservedForCategories && 
        internship.equityPreferences.reservedForCategories.includes(student.socialCategory)) {
      boost += 0.4;
    }
    
    // Preference for rural candidates
    if (internship.equityPreferences.preferredFromRural && student.demographicInfo.isRural) {
      boost += 0.2;
    }
    
    // Preference for aspirational district candidates
    if (internship.equityPreferences.preferredFromAspirationalDistricts && 
        student.demographicInfo.isFromAspirationalDistrict) {
      boost += 0.2;
    }
  }
  
  return Math.min(1, boost);
};

// Apply reservation policies to the matching results
const applyReservationPolicies = (applications, reservationQuotas) => {
  const categorizedApplications = {
    general: [],
    sc: [],
    st: [],
    obc: [],
    ews: [],
    women: []
  };
  
  // Categorize applications
  applications.forEach(app => {
    categorizedApplications[app.student.socialCategory.toLowerCase()].push(app);
    
    if (app.student.personalInfo.gender === 'female') {
      categorizedApplications.women.push(app);
    }
  });
  
  // Sort each category by score
  Object.keys(categorizedApplications).forEach(category => {
    categorizedApplications[category].sort((a, b) => b.matchScore - a.matchScore);
  });
  
  // Apply quotas
  const selectedApplications = [];
  const quotas = { ...reservationQuotas };
  const totalPositions = applications.length; // This would be internship capacity
  
  // Select candidates based on reservation policies
  ['sc', 'st', 'obc', 'ews', 'women'].forEach(category => {
    const quota = Math.floor(totalPositions * (quotas[category] / 100));
    const candidates = categorizedApplications[category].slice(0, quota);
    
    selectedApplications.push(...candidates);
    
    // Remove selected candidates from general pool
    candidates.forEach(candidate => {
      const index = categorizedApplications.general.findIndex(a => a._id === candidate._id);
      if (index !== -1) {
        categorizedApplications.general.splice(index, 1);
      }
    });
  });
  
  // Fill remaining positions from general category
  const remainingPositions = totalPositions - selectedApplications.length;
  if (remainingPositions > 0) {
    selectedApplications.push(...categorizedApplications.general.slice(0, remainingPositions));
  }
  
  return selectedApplications;
};

module.exports = {
  calculateMatchScore,
  applyReservationPolicies
};