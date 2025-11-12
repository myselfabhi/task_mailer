'use client'

import { useState } from 'react'

interface TaskFormProps {
  onTaskAdded: () => void
  onError: (message: string) => void
}

export default function TaskForm({ onTaskAdded, onError }: TaskFormProps) {
  const [formData, setFormData] = useState({
    task: '',
    startDate: '',
    endDate: '',
    resource: '',
    status: '',
    remarks: ''
  })

  const API_BASE_URL = '/api/tasks'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.task || !formData.startDate || !formData.endDate || !formData.resource || !formData.status) {
      onError('Please fill in all required fields.')
      return
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        setFormData({
          task: '',
          startDate: '',
          endDate: '',
          resource: '',
          status: '',
          remarks: ''
        })
        onTaskAdded()
      } else {
        onError('Failed to add task. Please try again.')
      }
    } catch (error) {
      console.error('Error adding task:', error)
      onError('Failed to add task. Please try again.')
    }
  }

  return (
    <div className="form-box">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task">Task *</label>
            <input
              type="text"
              id="task"
              name="task"
              value={formData.task}
              onChange={handleChange}
              placeholder="e.g., OC183/OC185B"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="resource">Resource *</label>
            <input
              type="text"
              id="resource"
              name="resource"
              value={formData.resource}
              onChange={handleChange}
              placeholder="e.g., Ruchika"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date *</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="remarks">Remarks</label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="e.g., OC183 Testing completed but OC185B is pending"
          />
        </div>
        <button type="submit">Add Task</button>
      </form>
    </div>
  )
}


