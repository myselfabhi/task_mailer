'use client'

import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'

interface Task {
  id: string
  task: string
  startDate: string
  endDate: string
  resource: string
  status: string
  remarks: string
}

interface EmailConfigProps {
  tasks: Task[]
  onClose: () => void
  onSuccess: () => void
  onError: (message: string) => void
}

export default function EmailConfig({ tasks, onClose, onSuccess, onError }: EmailConfigProps) {
  // Pre-filled email configuration values
  const formData = {
    recipientEmail: 'suneel.rajpoot@npstx.com',
    senderEmail: 'abhinav.verma@npstx.com',
    senderName: 'abhinav',
    emailjsServiceId: 'service_dmu7wsp',
    emailjsTemplateId: 'template_jkplftf',
    emailjsPublicKey: 'v0sBqDfGCut4AVokn'
  }
  const [isSending, setIsSending] = useState(false)

  // Close modal if no tasks
  useEffect(() => {
    if (tasks.length === 0) {
      onError('No tasks to send. Please add at least one task.')
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generateEmailContent = () => {
    if (tasks.length === 0) {
      return 'No tasks to report.'
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
    `

    const escapeHtml = (text: string) => {
      if (typeof window === 'undefined') {
        return String(text)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      }
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    }

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
      `
    })

    html += `
            </tbody>
          </table>
          <p><strong>Total Tasks:</strong> ${tasks.length}</p>
          <p><em>Generated on ${new Date().toLocaleString()}</em></p>
        </body>
      </html>
    `

    return html
  }


  const handleConfirmSend = async () => {
    setIsSending(true)
    try {
      emailjs.init(formData.emailjsPublicKey)
      const emailContent = generateEmailContent()

      const templateParams = {
        to_email: formData.recipientEmail,
        from_name: formData.senderName,
        from_email: formData.senderEmail,
        subject: `Daily Task Report - ${new Date().toLocaleDateString()}`,
        message: emailContent,
        html_content: emailContent,
        htmlContent: emailContent
      }

      await emailjs.send(
        formData.emailjsServiceId,
        formData.emailjsTemplateId,
        templateParams
      )

      onSuccess()
    } catch (error: any) {
      console.error('Email sending error:', error)
      setIsSending(false)
      onError(`Failed to send email: ${error.text || error.message || 'Unknown error'}`)
    }
  }

  const handleCancelPreview = () => {
    onClose()
  }

  if (tasks.length === 0) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={handleCancelPreview}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Email Preview - Confirm Send</h3>
        <div className="email-preview">
          <div className="preview-header">
            <p><strong>To:</strong> {formData.recipientEmail}</p>
            <p><strong>From:</strong> {formData.senderName} &lt;{formData.senderEmail}&gt;</p>
            <p><strong>Subject:</strong> Daily Task Report - {new Date().toLocaleDateString()}</p>
          </div>
          <div className="preview-body">
            <h4>Daily Task Report</h4>
            <table className="task-table">
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
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.task}</td>
                    <td>{task.startDate}</td>
                    <td>{task.endDate}</td>
                    <td>{task.resource}</td>
                    <td>{task.status}</td>
                    <td>{task.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p><strong>Total Tasks:</strong> {tasks.length}</p>
            <p><em>Generated on {new Date().toLocaleString()}</em></p>
          </div>
        </div>
        <div className="modal-actions">
          <button 
            type="button" 
            className="btn-success" 
            onClick={handleConfirmSend}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Yes, Send Email'}
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={handleCancelPreview}
            disabled={isSending}
          >
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  )
}


