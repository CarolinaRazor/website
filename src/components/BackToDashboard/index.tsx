'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import './styles.scss'

export const BackToDashboard: React.FC = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push('/admin')
  }

  return (
    <div className="back-to-dashboard">
      <button
        onClick={handleClick}
        className="back-to-dashboard__button"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Back to Dashboard</span>
      </button>
    </div>
  )
}

export default BackToDashboard
