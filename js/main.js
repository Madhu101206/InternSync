// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Set up navigation toggle for mobile
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
    
    // Initialize modules
    initStudentModule();
    initOrganizationModule();
    initAdminModule();
    initChatbot();
    
    // Load sample data for demonstration
    loadSampleData();
}

function loadSampleData() {
    // Check if data already exists in localStorage
    if (!localStorage.getItem('pmInternshipDataLoaded')) {
        // Sample students
        const students = [
            {
                id: 1,
                name: "Rahul Sharma",
                email: "rahul.sharma@example.com",
                phone: "9876543210",
                education: "B.Tech Computer Science",
                skills: ["Python", "Machine Learning", "Data Analysis"],
                interests: ["AI", "Data Science", "Software Development"],
                location: "Delhi",
                category: "General",
                district: "New Delhi",
                resume: "rahul_sharma_resume.pdf",
                matches: [101, 103]
            },
            {
                id: 2,
                name: "Priya Patel",
                email: "priya.patel@example.com",
                phone: "8765432109",
                education: "B.Com Economics",
                skills: ["Financial Analysis", "Excel", "Accounting"],
                interests: ["Finance", "Banking", "Economics"],
                location: "Mumbai",
                category: "OBC",
                district: "Mumbai Suburban",
                resume: "priya_patel_resume.pdf",
                matches: [102, 104]
            }
        ];
        
        // Sample organizations
        const organizations = [
            {
                id: 1,
                name: "Tech Innovations Ltd.",
                type: "Industry",
                sector: "Technology",
                contact: "hr@techinnovations.com",
                opportunities: [101, 103]
            },
            {
                id: 2,
                name: "Green Energy Foundation",
                type: "NGO",
                sector: "Environment",
                contact: "info@greenenergy.org",
                opportunities: [102, 104]
            }
        ];
        
        // Sample internships
        const internships = [
            {
                id: 101,
                orgId: 1,
                title: "AI Research Intern",
                domain: "Artificial Intelligence",
                skills: ["Python", "Machine Learning", "Data Analysis"],
                location: "Delhi",
                duration: "3 months",
                stipend: "15000",
                capacity: 5,
                applications: []
            },
            {
                id: 102,
                orgId: 2,
                title: "Sustainability Analyst Intern",
                domain: "Environmental Science",
                skills: ["Research", "Data Analysis", "Sustainability"],
                location: "Mumbai",
                duration: "6 months",
                stipend: "12000",
                capacity: 3,
                applications: []
            },
            {
                id: 103,
                orgId: 1,
                title: "Software Development Intern",
                domain: "Software Engineering",
                skills: ["JavaScript", "React", "Node.js"],
                location: "Bangalore",
                duration: "4 months",
                stipend: "18000",
                capacity: 8,
                applications: []
            },
            {
                id: 104,
                orgId: 2,
                title: "Community Outreach Intern",
                domain: "Social Work",
                skills: ["Communication", "Community Engagement", "Project Management"],
                location: "Chennai",
                duration: "3 months",
                stipend: "10000",
                capacity: 4,
                applications: []
            }
        ];
        
        // Save to localStorage
        localStorage.setItem('students', JSON.stringify(students));
        localStorage.setItem('organizations', JSON.stringify(organizations));
        localStorage.setItem('internships', JSON.stringify(internships));
        localStorage.setItem('pmInternshipDataLoaded', 'true');
    }
}

// Modal management functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside content
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Utility function to format text with title case
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Export functions for use in other modules
window.openModal = openModal;
window.closeModal = closeModal;
window.toTitleCase = toTitleCase;