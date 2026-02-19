'use client'

import React from 'react'
import type {User, WorkflowItem} from '@/payload-types'

interface WorkflowItemWithPopulated extends Omit<WorkflowItem, 'createdBy' | 'assignedTo'> {
  createdBy: User
  assignedTo?: User[]
}

interface WorkflowItemModalProps {
  item: WorkflowItemWithPopulated
  onClose: () => void
  adminURL: string
  onDelete?: (itemId: number | string) => void
}

export const WorkflowItemModal: React.FC<WorkflowItemModalProps> = ({
  item,
  onClose,
  adminURL,
  onDelete,
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      if (onDelete) {
        onDelete(item.id)
      }
      onClose()
    }
  }

  return (
    <div className="workflow-modal-backdrop" onClick={handleBackdropClick}>
      <div className="workflow-modal">
        <div className="workflow-modal__header">
          <h3>{item.title}</h3>
          <button
            className="workflow-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {item.description && (
          <div className="workflow-modal__description">
            {item.description}
          </div>
        )}

        <div className="workflow-modal__actions">
          {item.linkedPost && (
            <a
              href={`${adminURL}/collections/posts/${typeof item.linkedPost === 'object' ? item.linkedPost.id : item.linkedPost}`}
              className="workflow-modal__action workflow-modal__action--primary"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>Open Linked Post</span>
            </a>
          )}

          {item.links && item.links.length > 0 && (
            <div className="workflow-modal__links-section">
              <h4>Links</h4>
              {item.links.map((link, index) => (
                link.url && (
                  <a
                    key={link.id || index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="workflow-modal__action"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    <span>{link.label || link.url}</span>
                  </a>
                )
              ))}
            </div>
          )}

          <a
            href={`${adminURL}/collections/workflow-items/${item.id}`}
            className="workflow-modal__action"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span>Edit Task</span>
          </a>

          <button
            className="workflow-modal__action workflow-modal__action--danger"
            onClick={handleDelete}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <span>Delete Task</span>
          </button>
        </div>

        <div className="workflow-modal__meta">
          <div className="workflow-modal__meta-item">
            <span className="workflow-modal__meta-label">Created by:</span>
            <span className="workflow-modal__meta-value">
              {item.createdBy.name || item.createdBy.email}
            </span>
          </div>

          {item.assignedTo && item.assignedTo.length > 0 && (
            <div className="workflow-modal__meta-item">
              <span className="workflow-modal__meta-label">Assigned to:</span>
              <span className="workflow-modal__meta-value">
                {item.assignedTo.map(u => u.name || u.email).join(', ')}
              </span>
            </div>
          )}

          {item.priority && item.priority !== 'medium' && (
            <div className="workflow-modal__meta-item">
              <span className="workflow-modal__meta-label">Priority:</span>
              <span className="workflow-modal__meta-value">
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </span>
            </div>
          )}

          {item.dueDate && (
            <div className="workflow-modal__meta-item">
              <span className="workflow-modal__meta-label">Due date:</span>
              <span className="workflow-modal__meta-value">
                {new Date(item.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
