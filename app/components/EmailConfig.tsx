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
  const [formData, setFormData] = useState({
    recipientEmail: 'suneel.rajpoot@npstx.com',
    senderEmail: 'abhinav.verma@npstx.com',
    senderName: 'abhinav',
    emailjsServiceId: 'service_dmu7wsp',
    emailjsTemplateId: 'template_jkplftf',
    emailjsPublicKey: 'v0sBqDfGCut4AVokn'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
        // Server-side: simple escape
        return String(text)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      }
      // Client-side: use DOM
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.recipientEmail || !formData.senderEmail || !formData.senderName || 
        !formData.emailjsServiceId || !formData.emailjsTemplateId || !formData.emailjsPublicKey) {
      onError('Please fill in all email configuration fields.')
      return
    }

    if (tasks.length === 0) {
      onError('No tasks to send. Please add at least one task.')
      return
    }

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
      onError(`Failed to send email: ${error.text || error.message || 'Unknown error'}`)
    }
  }

  return (
    <div className="email-config">
      <h3>Email Configuration</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="recipientEmail">Recipient Email *</label>
            <input
              type="email"
              id="recipientEmail"
              name="recipientEmail"
              value={formData.recipientEmail}
              onChange={handleChange}
              placeholder="recipient@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senderEmail">Sender Email *</label>
            <input
              type="email"
              id="senderEmail"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleChange}
              placeholder="sender@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senderName">Sender Name *</label>
            <input
              type="text"
              id="senderName"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="emailjsServiceId">EmailJS Service ID *</label>
            <input
              type="text"
              id="emailjsServiceId"
              name="emailjsServiceId"
              value={formData.emailjsServiceId}
              onChange={handleChange}
              placeholder="service_xxxxx"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="emailjsTemplateId">EmailJS Template ID *</label>
            <input
              type="text"
              id="emailjsTemplateId"
              name="emailjsTemplateId"
              value={formData.emailjsTemplateId}
              onChange={handleChange}
              placeholder="template_xxxxx"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="emailjsPublicKey">EmailJS Public Key *</label>
            <input
              type="text"
              id="emailjsPublicKey"
              name="emailjsPublicKey"
              value={formData.emailjsPublicKey}
              onChange={handleChange}
              placeholder="xxxxxxxxxxxxx"
              required
            />
          </div>
        </div>
        <button type="submit">Send Email</button>
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  )
}


