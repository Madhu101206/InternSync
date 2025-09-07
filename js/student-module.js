// Student Module
function initStudentModule() {
    // Initialize student module functionality
    console.log("Student module initialized");
}

function openStudentModal(type) {
    let modalContent = '';
    const modalId = 'student-modal';
    
    switch(type) {
        case 'register':
            modalContent = `
                <div class="modal-header">
                    <h3>Student Registration</h3>
                </div>
                <div class="modal-body">
                    <form id="student-registration-form">
                        <div class="form-group">
                            <label for="name">Full Name</label>
                            <input type="text" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" required>
                        </div>
                        <div class="form-group">
                            <label for="education">Education</label>
                            <input type="text" id="education" required>
                        </div>
                        <div class="form-group">
                            <label for="skills">Skills (comma separated)</label>
                            <input type="text" id="skills" required>
                        </div>
                        <div class="form-group">
                            <label for="interests">Interests (comma separated)</label>
                            <input type="text" id="interests" required>
                        </div>
                        <div class="form-group">
                            <label for="location">Preferred Location</label>
                            <select id="location" required>
                                <option value="">Select Location</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Mumbai">Mumbai</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Kolkata">Kolkata</option>
                                <option value="Hyderabad">Hyderabad</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="category">Social Category</label>
                            <select id="category" required>
                                <option value="">Select Category</option>
                                <option value="General">General</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="OBC">OBC</option>
                                <option value="EWS">EWS</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="district">Home District</label>
                            <input type="text" id="district" required>
                        </div>
                        <div class="form-group">
                            <label for="resume">Upload Resume</label>
                            <input type="file" id="resume" accept=".pdf,.doc,.docx">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" onclick="closeModal('${modalId}')">Cancel</button>
                            <button type="submit" class="btn btn-primary">Register</button>
                        </div>
                    </form>
                </div>
            `;
            break;
            
        case 'browse':
            const internships = JSON.parse(localStorage.getItem('internships') || '[]');
            let internshipList = '';
            
            internships.forEach(internship => {
                internshipList += `
                    <div class="internship-card">
                        <h4>${internship.title}</h4>
                        <p><strong>Organization:</strong> ${getOrgName(internship.orgId)}</p>
                        <p><strong>Domain:</strong> ${internship.domain}</p>
                        <p><strong>Location:</strong> ${internship.location}</p>
                        <p><strong>Duration:</strong> ${internship.duration}</p>
                        <p><strong>Stipend:</strong> ₹${internship.stipend}/month</p>
                        <button class="btn-card" onclick="applyForInternship(${internship.id})">Apply Now</button>
                    </div>
                `;
            });
            
            modalContent = `
                <div class="modal-header">
                    <h3>Available Internships</h3>
                </div>
                <div class="modal-body">
                    <div class="internship-list">
                        ${internshipList || '<p>No internships available at the moment.</p>'}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal('${modalId}')">Close</button>
                </div>
            `;
            break;
            
        case 'track':
            modalContent = `
                <div class="modal-header">
                    <h3>Application Status</h3>
                </div>
                <div class="modal-body">
                    <div class="status-card">
                        <h4>AI Research Intern</h4>
                        <p><strong>Organization:</strong> Tech Innovations Ltd.</p>
                        <p><strong>Status:</strong> <span class="status-in-review">In Review</span></p>
                        <p><strong>Applied on:</strong> 15 Oct 2023</p>
                    </div>
                    <div class="status-card">
                        <h4>Software Development Intern</h4>
                        <p><strong>Organization:</strong> Tech Innovations Ltd.</p>
                        <p><strong>Status:</strong> <span class="status-matched">Matched</span></p>
                        <p><strong>Applied on:</strong> 10 Oct 2023</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal('${modalId}')">Close</button>
                </div>
            `;
            break;
    }
    
    // Create or update modal
    let modal = document.getElementById(modalId);
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeModal('${modalId}')">&times;</span>
            ${modalContent}
        </div>
    `;
    
    // Show modal
    openModal(modalId);
    
    // Add form submission handler for registration
    if (type === 'register') {
        const form = document.getElementById('student-registration-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                registerStudent();
            });
        }
    }
}

function registerStudent() {
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const education = document.getElementById('education').value;
    const skills = document.getElementById('skills').value.split(',').map(s => s.trim());
    const interests = document.getElementById('interests').value.split(',').map(s => s.trim());
    const location = document.getElementById('location').value;
    const category = document.getElementById('category').value;
    const district = document.getElementById('district').value;
    
    // Create student object
    const newStudent = {
        id: Date.now(), // Simple ID generation
        name,
        email,
        phone,
        education,
        skills,
        interests,
        location,
        category,
        district,
        resume: "uploaded_resume.pdf", // This would be handled differently with actual file upload
        matches: []
    };
    
    // Save to localStorage
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));
    
    // Close modal and show success message
    closeModal('student-modal');
    alert('Registration successful! Your profile has been created.');
}

function getOrgName(orgId) {
    const organizations = JSON.parse(localStorage.getItem('organizations') || '[]');
    const org = organizations.find(o => o.id === orgId);
    return org ? org.name : 'Unknown Organization';
}

function applyForInternship(internshipId) {
    // In a real application, this would be connected to the student's account
    alert(`Application submitted for internship #${internshipId}`);
    closeModal('student-modal');
}

// Export functions for use in other modules
window.openStudentModal = openStudentModal;
window.registerStudent = registerStudent;