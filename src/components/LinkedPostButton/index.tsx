'use client'

import React from 'react'
import {useFormFields} from '@payloadcms/ui'
import type {Post} from '@/payload-types'
import './styles.scss'

export const LinkedPostButton: React.FC = () => {
  const linkedPost = useFormFields(([fields]) => fields.linkedPost?.value)

  if (!linkedPost) {
    return null
  }

  const postId = typeof linkedPost === 'object' && 'id' in linkedPost ? linkedPost.id : linkedPost
  const postTitle = typeof linkedPost === 'object' && 'title' in linkedPost
    ? (linkedPost as Post).title
    : 'Linked Post'

  const handleClick = () => {
    window.open(`/admin/collections/posts/${postId}`, '_blank')
  }

  return (
    <div className="linked-post-button">
      <button
        onClick={handleClick}
        className="linked-post-button__btn"
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
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
        <span>View Linked Post: <strong>{postTitle}</strong></span>
        <span className="linked-post-button__badge">Opens in new tab</span>
      </button>
    </div>
  )
}

export default LinkedPostButton
