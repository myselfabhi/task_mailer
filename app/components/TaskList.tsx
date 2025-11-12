'use client'

import { useState } from 'react'

interface Task {
  id: string
  task: string
  startDate: string
  endDate: string
  resource: string
  status: string
  remarks: string
}

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  onTaskDeleted: () => void
  onTasksCleared: () => void
  onShowEmailConfig: () => void
}

export default function TaskList({ tasks, loading, onTaskDeleted, onTasksCleared, onShowEmailConfig }: TaskListProps) {
  const API_BASE_URL = '/api/tasks'

  const deleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`${API_BASE_URL}?id=${id}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        if (data.success) {
          onTaskDeleted()
        } else {
          alert('Failed to delete task. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting task:', error)
        alert('Failed to delete task. Please try again.')
      }
    }
  }

  const clearAllTasks = async () => {
    if (confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
      try {
        const response = await fetch(API_BASE_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'clear' })
        })
        const data = await response.json()
        if (data.success) {
          onTasksCleared()
        } else {
          alert('Failed to clear tasks. Please try again.')
        }
      } catch (error) {
        console.error('Error clearing tasks:', error)
        alert('Failed to clear tasks. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="task-list-box">
        <h2>Task List</h2>
        <div className="empty-state">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="task-list-box">
      <h2>Task List ({tasks.length})</h2>
      {tasks.length === 0 ? (
        <div className="empty-state">
          No tasks added yet. Start by adding a task above.
        </div>
      ) : (
        <>
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Resource</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Action</th>
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
                  <td>
                    <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="actions">
            <div>
              <button className="btn-success" onClick={onShowEmailConfig}>
                Send Email Report
              </button>
              <button className="btn-danger" onClick={clearAllTasks}>
                Clear All Tasks
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


