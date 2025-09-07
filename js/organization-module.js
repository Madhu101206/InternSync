// Organization Module
function initOrganizationModule() {
    // Initialize organization module functionality
    console.log("Organization module initialized");
}

function openOrgModal(type) {
    let modalContent = '';
    const modalId = 'org-modal';
    
    switch(type) {
        case 'post':
            modalContent = `
                <div class="modal-header">
                    <h3>Post New Internship Opportunity</h3>
                </div>
                <div class="modal-body">
                    <form id="internship-post-form">
                        <div class="form-group">
                            <label for="title">Internship Title</label>
                            <input type="text" id="title" required>
                        </div>
                        <div class="form-group">
                            <label for="domain">Domain/Field</label>
                            <input type="text" id="domain" required>
                        </div>
                        <div class="form-group">
                            <label for="skills">Required Skills (comma separated)</label>
                            <input type="text" id="skills" required>
                        </div>
                        <div class="form-group">
                            <label for="location">Location</label>
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
                            <label for="duration">Duration (months)</label>
                            <input type="number" id="duration" min="1" max="12" required>
                        </div>
                        <div class="form-group">
                            <label for="stipend">Stipend (₹ per month)</label>
                            <input type="number" id="stipend" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="capacity">Number of Openings</label>
                            <input type="number" id="capacity" min="1" required>
                        </div>
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea id="description" required></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" onclick="closeModal('${modalId}')">Cancel</button>
                            <button type="submit" class="btn btn-primary">Post Opportunity</button>
                        </div>
                    </form>
                </div>
            `;
            break;
            
        case 'candidates':
            modalContent = `
                <div class="modal-header">
                    <h3>Matched Candidates</h3>
                </div>
                <div class="modal-body">
                    <div class="candidate-card">
                        <h4>Rahul Sharma</h4>
                        <p><strong>Education:</strong> B.Tech Computer Science</p>
                        <p><strong>Skills:</strong> Python, Machine Learning, Data Analysis</p>
                        <p><strong>Match Score:</strong> 92%</p>
                        <div class="candidate-actions">
                            <button class="btn-card">View Profile</button>
                            <button class="btn-card">Contact</button>
                            <button class="btn-card">Select</button>
                        </div>
                    </div>
                    <div class="candidate-card">
                        <h4>Neha Gupta</h4>
                        <p><strong>Education:</strong> MCA</p>
                        <p><strong>Skills:</strong> Java, Spring Boot, SQL</p>
                        <p><strong>Match Score:</strong> 88%</p>
                        <div class="candidate-actions">
                            <button class="btn-card">View Profile</button>
                            <button class="btn-card">Contact</button>
                            <button class="btn-card">Select</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal('${modalId}')">Close</button>
                </div>
            `;
            break;
            
        case 'manage':
            modalContent = `
                <div class="modal-header">
                    <h3>Manage Internship Program</h3>
                </div>
                <div class="modal-body">
                    <div class="program-stats">
                        <div class="stat-item">
                            <h4>5</h4>
                            <p>Total Interns</p>
                        </div>
                        <div class="stat-item">
                            <h4>3</h4>
                            <p>Active Internships</p>
                        </div>
                        <div class="stat-item">
                            <h4>2</h4>
                            <p>Pending Offers</p>
                        </div>
                    </div>
                    <div class="intern-list">
                        <h4>Current Interns</h4>
                        <ul>
                            <li>Rahul Sharma - AI Research Intern (Started: 1 Nov 2023)</li>
                            <li>Priya Patel - Data Analysis Intern (Started: 15 Oct 2023)</li>
                            <li>Amit Kumar - Software Development Intern (Started: 1 Oct 2023)</li>
                        </ul>
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
    
    // Add form submission handler for internship posting
    if (type === 'post') {
        const form = document.getElementById('internship-post-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                postInternship();
            });
        }
    }
}

function postInternship() {
    // Get form values
    const title = document.getElementById('title').value;
    const domain = document.getElementById('domain').value;
    const skills = document.getElementById('skills').value.split(',').map(s => s.trim());
    const location = document.getElementById('location').value;
    const duration = document.getElementById('duration').value + ' months';
    const stipend = document.getElementById('stipend').value;
    const capacity = document.getElementById('capacity').value;
    const description = document.getElementById('description').value;
    
    // Create internship object
    const newInternship = {
        id: Date.now(), // Simple ID generation
        orgId: 1, // This would be the logged-in organization's ID in a real application
        title,
        domain,
        skills,
        location,
        duration,
        stipend,
        capacity: parseInt(capacity),
        description,
        applications: []
    };
    
    // Save to localStorage
    const internships = JSON.parse(localStorage.getItem('internships') || '[]');
    internships.push(newInternship);
    localStorage.setItem('internships', JSON.stringify(internships));
    
    // Also add to organization's opportunities
    const organizations = JSON.parse(localStorage.getItem('organizations') || '[]');
    const orgIndex = organizations.findIndex(o => o.id === 1); // Assuming org ID 1 for demo
    if (orgIndex !== -1) {
        if (!organizations[orgIndex].opportunities) {
            organizations[orgIndex].opportunities = [];
        }
        organizations[orgIndex].opportunities.push(newInternship.id);
        localStorage.setItem('organizations', JSON.stringify(organizations));
    }
    
    // Close modal and show success message
    closeModal('org-modal');
    alert('Internship opportunity posted successfully!');
}

// Export functions for use in other modules
window.openOrgModal = openOrgModal;
window.postInternship = postInternship;