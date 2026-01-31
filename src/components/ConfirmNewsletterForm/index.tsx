'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {MdOutlineEmail} from "react-icons/md";

interface ConfirmNewsletterFormProps {
  token: string
}

export function ConfirmNewsletterForm({token}: ConfirmNewsletterFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleConfirm = async () => {
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({token}),
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.message)
      }
    } catch (_error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again later.')
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="border border-solid rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center">
            {status === 'idle' && (
              <>
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
                    <MdOutlineEmail className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Confirm Your Subscription
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Click the button below to confirm your newsletter subscription and start receiving our latest articles.
                </p>
                <button
                  onClick={handleConfirm}
                  className="w-full px-6 py-3 bg-blue-400
                           text-white font-semibold rounded-lg
                           hover:bg-blue-700
                           transition-all duration-200 ease-in-out
                           shadow-lg hover:shadow-xl"
                >
                  Confirm Subscription
                </button>
              </>
            )}

            {status === 'loading' && (
              <>
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center animate-pulse">
                    <svg
                      className="w-8 h-8 text-white animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  Confirming...
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Please wait while we confirm your subscription.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Success!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">{message}</p>
                <button
                  onClick={() => router.push('/')}
                  className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700
                           text-gray-900 dark:text-white font-semibold rounded-lg
                           hover:bg-gray-300 dark:hover:bg-gray-600
                           focus:outline-none focus:ring-2 focus:ring-gray-500
                           transition-all duration-200 ease-in-out"
                >
                  Return to Home
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Error
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">{message}</p>
                <div className="space-y-3">
                  <button
                    onClick={handleConfirm}
                    className="w-full px-6 py-3 bg-blue-400
                             text-white font-semibold rounded-lg
                             hover:bg-blue-700
                             transition-all duration-200 ease-in-out"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700
                             text-gray-900 dark:text-white font-semibold rounded-lg
                             hover:bg-gray-300 dark:hover:bg-gray-600
                             focus:outline-none focus:ring-2 focus:ring-gray-500
                             transition-all duration-200 ease-in-out"
                  >
                    Return to Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
