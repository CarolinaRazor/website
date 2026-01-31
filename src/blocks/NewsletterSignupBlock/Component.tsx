'use client'

import React, {useState} from 'react'
import isEmail from 'validator/lib/isEmail'


export function NewsletterSignupBlock() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [waitTime, setWaitTime] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // lock submissions
    if (status === 'success') {
      return
    }

    const trimmedEmail = email.trim()

    if (!isEmail(trimmedEmail)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    if (!trimmedEmail) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    setStatus('loading')
    setMessage('')
    setWaitTime(null)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: trimmedEmail}),
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.message)
        if (data.waitTime) {
          setWaitTime(data.waitTime)
        }
      }
    } catch (_error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again later.')
    }
  }

  return (
    <section className="py-12">
      <div className="px-4">
        <div className="rounded-2xl border border-solid p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-blue-400 bg-clip-text text-transparent">
              Stay Updated
            </h2>
            <p className="text-lg">
              Subscribe to our newsletter and get articles delivered to your inbox weekly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === 'loading' || status === 'success'}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-400
                         disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="px-6 py-3 bg-blue-400
                         text-white font-semibold rounded-lg
                         hover:bg-blue-600
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 ease-in-out
                         shadow-lg hover:shadow-xl"
              >
                {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
              </button>
            </div>

            {message && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  status === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                }`}
                role="alert"
              >
                <p className="font-medium">{message}</p>
                {waitTime !== null && (
                  <p className="text-sm mt-1">
                    You can request a new confirmation email in {waitTime} minute{waitTime !== 1 ? 's' : ''}.
                  </p>
                )}
              </div>
            )}
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
