
export const API_BASE_URL = 
  typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    ? 'https://task-mailer-1.onrender.com/api/tasks'
    : '/api/tasks';



