'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Preferences {
  alertGameweekStart: boolean
  alertNewUploads: boolean
}

export default function PreferencesForm() {
  useSession() // Keep the session hook for authentication without destructuring
  const [preferences, setPreferences] = useState<Preferences>({
    alertGameweekStart: false,
    alertNewUploads: false,
  })
  const [isSaving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Load user preferences
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/preferences')
        if (response.ok) {
          const data = await response.json()
          setPreferences(data)
        }
      } catch (err) {
        console.error('Failed to load preferences:', err)
      }
    }

    loadPreferences()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        setMessage('Preferences saved successfully!')
      } else {
        setMessage('Failed to save preferences')
      }
    } catch (err) {
      console.error('Failed to save preferences:', err)
      setMessage('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (name: keyof Preferences) => {
    setPreferences(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={preferences.alertGameweekStart}
            onChange={() => handleChange('alertGameweekStart')}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 dark:text-gray-300">
            Alert me when a Sorare gameweek is about to start
          </span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={preferences.alertNewUploads}
            onChange={() => handleChange('alertNewUploads')}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 dark:text-gray-300">
            Alert me when new predictions are uploaded
          </span>
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
        {message && (
          <p className={`text-sm ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
      </div>
    </form>
  )
} 