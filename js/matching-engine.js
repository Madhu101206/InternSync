// AI Matching Engine
function initMatchingEngine() {
    // Initialize matching engine functionality
    console.log("Matching engine initialized");
}

// Core matching algorithm
function matchStudentsToInternships() {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const internships = JSON.parse(localStorage.getItem('internships') || '[]');
    
    const matches = [];
    
    // For each internship, find the best matching students
    internships.forEach(internship => {
        const internshipMatches = [];
        
        students.forEach(student => {
            const score = calculateMatchScore(student, internship);
            
            if (score > 0.5) { // Threshold for acceptable matches
                internshipMatches.push({
                    studentId: student.id,
                    studentName: student.name,
                    score: score
                });
            }
        });
        
        // Sort by score descending and take top candidates
        internshipMatches.sort((a, b) => b.score - a.score);
        const topMatches = internshipMatches.slice(0, Math.min(10, internshipMatches.length));
        
        matches.push({
            internshipId: internship.id,
            internshipTitle: internship.title,
            matches: topMatches
        });
    });
    
    return matches;
}

// Calculate match score between student and internship
function calculateMatchScore(student, internship) {
    let score = 0;
    let totalWeight = 0;
    
    // Skill matching (40% weight)
    const skillScore = calculateSkillMatch(student.skills, internship.skills);
    score += skillScore * 0.4;
    totalWeight += 0.4;
    
    // Location preference (20% weight)
    if (student.location === internship.location) {
        score += 1 * 0.2;
    } else {
        // Partial score for nearby locations could be implemented
        score += 0.2 * 0.2;
    }
    totalWeight += 0.2;
    
    // Domain interest matching (20% weight)
    const interestScore = calculateInterestMatch(student.interests, internship.domain);
    score += interestScore * 0.2;
    totalWeight += 0.2;
    
    // Diversity factors (20% weight) - This would include reservation policies
    const diversityScore = calculateDiversityScore(student, internship);
    score += diversityScore * 0.2;
    totalWeight += 0.2;
    
    return score / totalWeight;
}

// Calculate skill match score
function calculateSkillMatch(studentSkills, internshipSkills) {
    if (!internshipSkills || internshipSkills.length === 0) return 1;
    
    let matchedSkills = 0;
    
    studentSkills.forEach(skill => {
        if (internshipSkills.includes(skill)) {
            matchedSkills++;
        }
    });
    
    return matchedSkills / internshipSkills.length;
}

// Calculate interest match score
function calculateInterestMatch(studentInterests, internshipDomain) {
    if (!studentInterests || studentInterests.length === 0) return 0.5;
    
    // Check if internship domain is in student's interests
    if (studentInterests.includes(internshipDomain)) {
        return 1;
    }
    
    // TODO: Implement more sophisticated interest matching
    // For now, return a moderate score
    return 0.5;
}

// Calculate diversity score based on reservation policies
function calculateDiversityScore(student, internship) {
    // This would implement the government reservation policies
    // For demo purposes, we'll use a simplified approach
    
    const categories = {
        'SC': { weight: 0.15 },
        'ST': { weight: 0.075 },
        'OBC': { weight: 0.27 },
        'EWS': { weight: 0.1 },
        'General': { weight: 0.405 }
    };
    
    // Check if student belongs to a category that needs representation
    if (categories[student.category]) {
        // In a real implementation, we would check current allocation rates
        // and adjust scores accordingly
        return 1; // Maximum score for diversity
    }
    
    return 0.5; // Neutral score
}

// Function to run matching and update results
function runMatchingProcess() {
    console.log("Starting matching process...");
    const matches = matchStudentsToInternships();
    
    // Update internships with matched students
    const internships = JSON.parse(localStorage.getItem('internships') || '[]');
    
    matches.forEach(match => {
        const internshipIndex = internships.findIndex(i => i.id === match.internshipId);
        if (internshipIndex !== -1) {
            internships[internshipIndex].matches = match.matches;
        }
    });
    
    localStorage.setItem('internships', JSON.stringify(internships));
    console.log("Matching process completed.");
    
    return matches;
}

// Function to get skill gap analysis for a student
function getSkillGapAnalysis(studentId, internshipId) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const internships = JSON.parse(localStorage.getItem('internships') || '[]');
    
    const student = students.find(s => s.id === studentId);
    const internship = internships.find(i => i.id === internshipId);
    
    if (!student || !internship) return null;
    
    const missingSkills = internship.skills.filter(skill => 
        !student.skills.includes(skill)
    );
    
    return {
        student: student.name,
        internship: internship.title,
        matchedSkills: student.skills.filter(skill => 
            internship.skills.includes(skill)
        ),
        missingSkills: missingSkills,
        matchScore: calculateMatchScore(student, internship)
    };
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initMatchingEngine();
});

// Export functions for use in other modules
window.runMatchingProcess = runMatchingProcess;
window.getSkillGapAnalysis = getSkillGapAnalysis;