# Task Mailer - Frontend Only

A simple, frontend-only daily task entry and email reporting system. No build process required - just open the HTML file in your browser!

## Features

- **Task Entry Form**: Add tasks with Task name, Start Date, End Date, Resource, Status, and Remarks
- **Task Management**: View all tasks in a table format matching your requirements
- **Email Reporting**: Send formatted email reports with all tasks to recipients using EmailJS
- **Local Storage**: Tasks are saved locally in the browser
- **Responsive Design**: Works on desktop and mobile devices
- **No Build Required**: Pure HTML, CSS, and JavaScript - just open and use!

## Usage

1. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or use a local server: `python -m http.server 8000` then visit `http://localhost:8000`

2. **Add Tasks**: Fill in the task form with all required fields and click "Add Task"

3. **View Tasks**: All added tasks appear in the table below

4. **Delete Tasks**: Click the "Delete" button on any task row to remove it

5. **Send Email**: 
   - Click "Send Email Report"
   - Configure EmailJS settings (see EmailJS Setup below)
   - Click "Send Email"

6. **Clear All**: Use "Clear All Tasks" to remove all entries

## EmailJS Setup

To enable email functionality, you need to set up EmailJS:

1. **Create an EmailJS account** at [https://www.emailjs.com/](https://www.emailjs.com/)

2. **Create an Email Service**:
   - Go to Email Services in your EmailJS dashboard
   - Add a new service (Gmail, Outlook, etc.)
   - Note your Service ID

3. **Create an Email Template**:
   - Go to Email Templates
   - Create a new template
   - Use these template variables:
     - `{{to_email}}` - Recipient email
     - `{{from_name}}` - Sender name
     - `{{from_email}}` - Sender email
     - `{{subject}}` - Email subject
     - `{{html_content}}` - HTML formatted task table
   - Note your Template ID

4. **Get your Public Key**:
   - Go to Account > API Keys
   - Copy your Public Key

5. **Configure in the App**:
   - Click "Send Email Report" button
   - Fill in all the EmailJS configuration fields

## File Structure

```
task_mailer/
├── index.html      # Main HTML file
├── styles.css      # All styles
├── script.js       # All JavaScript functionality
└── README.md       # This file
```

## Technologies Used

- Pure HTML5
- CSS3 (with modern features)
- Vanilla JavaScript (ES6+)
- EmailJS (for frontend email sending)
- LocalStorage API (for data persistence)

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Notes

- Tasks are stored in browser localStorage
- Each team member can use the same application independently
- EmailJS allows sending emails directly from the frontend without a backend server
- The email template includes a formatted HTML table with all task details
- No server or build process required - just open and use!

## Troubleshooting

**Email Not Sending**: 
- Verify all EmailJS credentials are correct
- Check EmailJS dashboard for service status
- Ensure the email template uses the correct variable names
- Check browser console for error messages (F12)

**Tasks Not Saving**:
- Check if localStorage is enabled in your browser
- Try clearing browser cache and reloading

## License

This project is open source and available for use.
