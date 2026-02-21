'use client'

import React from 'react'
import type {User, WorkflowItem} from '@/payload-types'
import {FiEdit2, FiExternalLink, FiFileText, FiTrash2, FiX} from 'react-icons/fi'

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
            <FiX size={20} />
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
              <FiFileText size={20} />
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
                    <FiExternalLink size={20} />
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
            <FiEdit2 size={20} />
            <span>Edit Task</span>
          </a>

          <button
            className="workflow-modal__action workflow-modal__action--danger"
            onClick={handleDelete}
          >
            <FiTrash2 size={20} />
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
