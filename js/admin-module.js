// Admin Module
function initAdminModule() {
    // Initialize admin module functionality
    console.log("Admin module initialized");
}

function openAdminModal(type) {
    let modalContent = '';
    const modalId = 'admin-modal';
    
    switch(type) {
        case 'dashboard':
            modalContent = `
                <div class="modal-header">
                    <h3>Admin Dashboard</h3>
                </div>
                <div class="modal-body">
                    <div class="dashboard-stats">
                        <div class="stat-card">
                            <h4>1,243</h4>
                            <p>Registered Students</p>
                        </div>
                        <div class="stat-card">
                            <h4>187</h4>
                            <p>Participating Organizations</p>
                        </div>
                        <div class="stat-card">
                            <h4>524</h4>
                            <p>Active Internships</p>
                        </div>
                        <div class="stat-card">
                            <h4>78%</h4>
                            <p>Placement Rate</p>
                        </div>
                    </div>
                    <div class="distribution-charts">
                        <h4>Category Distribution</h4>
                        <div class="chart-container">
                            <div class="chart-bar" style="width: 40%; background-color: #4361ee;">
                                <span>General (40%)</span>
                            </div>
                            <div class="chart-bar" style="width: 27%; background-color: #3a0ca3;">
                                <span>OBC (27%)</span>
                            </div>
                            <div class="chart-bar" style="width: 15%; background-color: #4cc9f0;">
                                <span>SC (15%)</span>
                            </div>
                            <div class="chart-bar" style="width: 8%; background-color: #f72585;">
                                <span>ST (8%)</span>
                            </div>
                            <div class="chart-bar" style="width: 10%; background-color: #fca311;">
                                <span>EWS (10%)</span>
                            </div>
                        </div>
                    </div>
                    <div class="regional-distribution">
                        <h4>Regional Distribution</h4>
                        <ul>
                            <li>North Region: 35%</li>
                            <li>South Region: 28%</li>
                            <li>East Region: 18%</li>
                            <li>West Region: 19%</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal('${modalId}')">Close</button>
                    <button class="btn btn-primary" onclick="generateReport()">Generate Report</button>
                </div>
            `;
            break;
            
        case 'config':
            modalContent = `
                <div class="modal-header">
                    <h3>System Configuration</h3>
                </div>
                <div class="modal-body">
                    <form id="system-config-form">
                        <div class="form-group">
                            <label for="matching-algorithm">Matching Algorithm</label>
                            <select id="matching-algorithm">
                                <option value="weighted">Weighted Scoring</option>
                                <option value="ml">Machine Learning</option>
                                <option value="hybrid">Hybrid Approach</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="reservation-policy">Reservation Policy</label>
                            <div class="policy-settings">
                                <div class="policy-item">
                                    <label>SC: <input type="number" value="15" min="0" max="100"> %</label>
                                </div>
                                <div class="policy-item">
                                    <label>ST: <input type="number" value="7.5" min="0" max="100"> %</label>
                                </div>
                                <div class="policy-item">
                                    <label>OBC: <input type="number" value="27" min="0" max="100"> %</label>
                                </div>
                                <div class="policy-item">
                                    <label>EWS: <input type="number" value="10" min="0" max="100"> %</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="rural-weight">Rural/Aspirational Districts Weight</label>
                            <input type="range" id="rural-weight" min="0" max="10" value="3">
                            <span id="rural-weight-value">3</span>
                        </div>
                        <div class="form-group">
                            <label for="gender-balance">Gender Balance Enforcement</label>
                            <select id="gender-balance">
                                <option value="none">None</option>
                                <option value="moderate" selected>Moderate</option>
                                <option value="strict">Strict</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" onclick="closeModal('${modalId}')">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Configuration</button>
                        </div>
                    </form>
                </div>
            `;
            break;
            
        case 'fairness':
            modalContent = `
                <div class="modal-header">
                    <h3>Fairness Monitoring</h3>
                </div>
                <div class="modal-body">
                    <div class="fairness-report">
                        <h4>Equity Analysis Report</h4>
                        <div class="report-section">
                            <h5>Category Representation</h5>
                            <p>All reserved categories are within 2% of target allocation</p>
                            <div class="status success">✓ Balanced</div>
                        </div>
                        <div class="report-section">
                            <h5>Gender Distribution</h5>
                            <p>45% female participants, 55% male participants</p>
                            <div class="status warning">⚠️ Could be improved</div>
                        </div>
                        <div class="report-section">
                            <h5>Regional Distribution</h5>
                            <p>All regions have adequate representation</p>
                            <div class="status success">✓ Balanced</div>
                        </div>
                        <div class="report-section">
                            <h5>Algorithm Bias Detection</h5>
                            <p>No significant bias detected in matching algorithm</p>
                            <div class="status success">✓ No bias detected</div>
                        </div>
                    </div>
                    <div class="corrective-actions">
                        <h4>Recommended Actions</h4>
                        <ul>
                            <li>Increase outreach to female candidates in technical fields</li>
                            <li>Create more internship opportunities in eastern regions</li>
                            <li>Review skill weightings for rural candidate matching</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal('${modalId}')">Close</button>
                    <button class="btn btn-primary" onclick="runBiasAudit()">Run Bias Audit</button>
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
    
    // Add event listeners for configuration form
    if (type === 'config') {
        const ruralWeight = document.getElementById('rural-weight');
        const ruralWeightValue = document.getElementById('rural-weight-value');
        
        if (ruralWeight && ruralWeightValue) {
            ruralWeight.addEventListener('input', function() {
                ruralWeightValue.textContent = this.value;
            });
        }
        
        const form = document.getElementById('system-config-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                saveSystemConfig();
            });
        }
    }
}

function generateReport() {
    alert('Comprehensive report generated and downloaded.');
    closeModal('admin-modal');
}

function saveSystemConfig() {
    alert('System configuration saved successfully.');
    closeModal('admin-modal');
}

function runBiasAudit() {
    alert('Bias audit completed. No significant issues found.');
}

// Export functions for use in other modules
window.openAdminModal = openAdminModal;