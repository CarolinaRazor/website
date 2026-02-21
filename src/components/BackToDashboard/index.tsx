'use client'

import React from 'react'
import {useRouter} from 'next/navigation'
import {FiArrowLeft} from 'react-icons/fi'
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
        <FiArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>
    </div>
  )
}

export default BackToDashboard
