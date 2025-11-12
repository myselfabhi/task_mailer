'use client'

import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import EmailConfig from './components/EmailConfig'

interface Task {
  id: string
  task: string
  startDate: string
  endDate: string
  resource: string
  status: string
  remarks: string
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showEmailConfig, setShowEmailConfig] = useState(false)
  const [alert, setAlert] = useState<{ message: string; type: string } | null>(null)

  const API_BASE_URL = '/api/tasks'

  useEffect(() => {
    loadTasks()
  }, [])

  const showAlertMessage = (message: string, type: string = 'success') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 3000)
  }

  const loadTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_BASE_URL)
      const data = await response.json()
      if (data.success) {
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
      showAlertMessage('Failed to load tasks. Please refresh the page.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskAdded = () => {
    loadTasks()
    showAlertMessage('Task added successfully!')
  }

  const handleTaskDeleted = () => {
    loadTasks()
    showAlertMessage('Task deleted successfully!')
  }

  const handleTasksCleared = () => {
    loadTasks()
    showAlertMessage('All tasks cleared!')
  }

  return (
    <div className="container">
      <h1>Daily Task Entry</h1>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {showEmailConfig && (
        <EmailConfig
          tasks={tasks}
          onClose={() => setShowEmailConfig(false)}
          onSuccess={() => {
            setShowEmailConfig(false)
            showAlertMessage('Email sent successfully!')
          }}
          onError={(message) => showAlertMessage(message, 'error')}
        />
      )}

      <TaskForm onTaskAdded={handleTaskAdded} onError={(msg) => showAlertMessage(msg, 'error')} />

      <TaskList
        tasks={tasks}
        loading={loading}
        onTaskDeleted={handleTaskDeleted}
        onTasksCleared={handleTasksCleared}
        onShowEmailConfig={() => setShowEmailConfig(true)}
      />
    </div>
  )
}


