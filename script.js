// Task Management
let tasks = [];

// API Base URL - will be automatically set based on environment
const API_BASE_URL = window.location.origin + '/api';

// Load tasks from API
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        const data = await response.json();
        if (data.success) {
            tasks = data.tasks || [];
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        showAlert('Failed to load tasks. Please refresh the page.', 'error');
    }
    renderTasks();
}

// Save tasks to API (not needed - we save individual tasks)
async function saveTaskToAPI(task) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task)
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error saving task:', error);
        return false;
    }
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Show alert message
function showAlert(message, type = 'success') {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    alert.style.display = 'block';
    
    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

// Render tasks table
function renderTasks() {
    const taskTable = document.getElementById('taskTable');
    const taskTableBody = document.getElementById('taskTableBody');
    const emptyState = document.getElementById('emptyState');
    const actions = document.getElementById('actions');
    const taskCount = document.getElementById('taskCount');
    
    taskCount.textContent = tasks.length;
    
    if (tasks.length === 0) {
        taskTable.style.display = 'none';
        emptyState.style.display = 'block';
        actions.style.display = 'none';
        return;
    }
    
    taskTable.style.display = 'table';
    emptyState.style.display = 'none';
    actions.style.display = 'flex';
    
    taskTableBody.innerHTML = '';
    
    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(task.task)}</td>
            <td>${escapeHtml(task.startDate)}</td>
            <td>${escapeHtml(task.endDate)}</td>
            <td>${escapeHtml(task.resource)}</td>
            <td>${escapeHtml(task.status)}</td>
            <td>${escapeHtml(task.remarks)}</td>
            <td>
                <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add task
async function addTask(event) {
    event.preventDefault();
    
    const task = document.getElementById('task').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const resource = document.getElementById('resource').value.trim();
    const status = document.getElementById('status').value;
    const remarks = document.getElementById('remarks').value.trim();
    
    if (!task || !startDate || !endDate || !resource || !status) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    const newTask = {
        task,
        startDate,
        endDate,
        resource,
        status,
        remarks
    };
    
    // Save to API
    const success = await saveTaskToAPI(newTask);
    if (success) {
        // Reload tasks from API to get the latest data
        await loadTasks();
        // Reset form
        document.getElementById('taskForm').reset();
        showAlert('Task added successfully!');
    } else {
        showAlert('Failed to add task. Please try again.', 'error');
    }
}

// Delete task
async function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks?id=${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                await loadTasks();
                showAlert('Task deleted successfully!');
            } else {
                showAlert('Failed to delete task. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            showAlert('Failed to delete task. Please try again.', 'error');
        }
    }
}

// Clear all tasks
async function clearAllTasks() {
    if (confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'clear' })
            });
            const data = await response.json();
            if (data.success) {
                await loadTasks();
                showAlert('All tasks cleared!');
            } else {
                showAlert('Failed to clear tasks. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error clearing tasks:', error);
            showAlert('Failed to clear tasks. Please try again.', 'error');
        }
    }
}

// Toggle email configuration
function toggleEmailConfig() {
    const emailConfig = document.getElementById('emailConfig');
    emailConfig.style.display = emailConfig.style.display === 'none' ? 'block' : 'none';
}

// Generate email content
function generateEmailContent() {
    if (tasks.length === 0) {
        return 'No tasks to report.';
    }
    
    let html = `
        <html>
            <head>
                <style>
                    table { border-collapse: collapse; width: 100%; background: #2c3e50; color: white; }
                    th, td { padding: 12px; text-align: left; border: 1px solid #34495e; }
                    th { background: #34495e; font-weight: bold; }
                    tr:hover { background: #34495e; }
                </style>
            </head>
            <body>
                <h2>Daily Task Report</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Resource</th>
                            <th>Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    tasks.forEach(task => {
        html += `
            <tr>
                <td>${escapeHtml(task.task)}</td>
                <td>${escapeHtml(task.startDate)}</td>
                <td>${escapeHtml(task.endDate)}</td>
                <td>${escapeHtml(task.resource)}</td>
                <td>${escapeHtml(task.status)}</td>
                <td>${escapeHtml(task.remarks)}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
                <p><strong>Total Tasks:</strong> ${tasks.length}</p>
                <p><em>Generated on ${new Date().toLocaleString()}</em></p>
            </body>
        </html>
    `;
    
    return html;
}

// Send email
async function sendEmail(event) {
    event.preventDefault();
    
    const recipientEmail = document.getElementById('recipientEmail').value.trim();
    const senderEmail = document.getElementById('senderEmail').value.trim();
    const senderName = document.getElementById('senderName').value.trim();
    const emailjsServiceId = document.getElementById('emailjsServiceId').value.trim();
    const emailjsTemplateId = document.getElementById('emailjsTemplateId').value.trim();
    const emailjsPublicKey = document.getElementById('emailjsPublicKey').value.trim();
    
    if (!recipientEmail || !senderEmail || !senderName || !emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
        showAlert('Please fill in all email configuration fields.', 'error');
        return;
    }
    
    if (tasks.length === 0) {
        showAlert('No tasks to send. Please add at least one task.', 'error');
        return;
    }
    
    try {
        showAlert('Sending email...', 'info');
        
        // Initialize EmailJS
        emailjs.init(emailjsPublicKey);
        
        const emailContent = generateEmailContent();
        
        const templateParams = {
            to_email: recipientEmail,
            from_name: senderName,
            from_email: senderEmail,
            subject: `Daily Task Report - ${new Date().toLocaleDateString()}`,
            message: emailContent,
            html_content: emailContent,
            htmlContent: emailContent  // Alternative variable name
        };
        
        await emailjs.send(
            emailjsServiceId,
            emailjsTemplateId,
            templateParams
        );
        
        showAlert('Email sent successfully!', 'success');
        document.getElementById('recipientEmail').value = 'suneel.rajpoot@npstx.com';
        document.getElementById('senderEmail').value = 'abhinav.verma@npstx.com';
        document.getElementById('senderName').value = 'abhinav';
        document.getElementById('emailjsServiceId').value = 'service_dmu7wsp';
        document.getElementById('emailjsTemplateId').value = 'template_jkplftf';
        document.getElementById('emailjsPublicKey').value = 'v0sBqDfGCut4AVokn';
        toggleEmailConfig();
    } catch (error) {
        console.error('Email sending error:', error);
        showAlert(`Failed to send email: ${error.text || error.message || 'Unknown error'}`, 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    
    document.getElementById('taskForm').addEventListener('submit', addTask);
    document.getElementById('emailForm').addEventListener('submit', sendEmail);
});

