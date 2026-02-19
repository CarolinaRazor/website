'use client'

import React from 'react'
import type {User, WorkflowItem} from '@/payload-types'

interface WorkflowItemWithPopulated extends Omit<WorkflowItem, 'createdBy' | 'assignedTo'> {
  createdBy: User
  assignedTo?: User[]
}

interface WorkflowItemCardProps {
  item: WorkflowItemWithPopulated
  color: string
  adminURL: string
  formatDate: (date: string) => string
  onDragStart: (item: WorkflowItemWithPopulated) => void
  onDragEnd: () => void
}

export const WorkflowItemCard: React.FC<WorkflowItemCardProps> = ({
  item,
  color,
  adminURL,
  formatDate,
  onDragStart,
  onDragEnd,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    onDragStart(item)
  }

  return (
    <a
      href={`${adminURL}/collections/workflow-items/${item.id}`}
      className="workflow-widget__kanban-card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      style={{ borderLeftColor: color }}
    >
      <div className="workflow-widget__kanban-card-header">
        <div className="workflow-widget__kanban-card-avatar">
          {item.createdBy.avatar && typeof item.createdBy.avatar === 'object' && item.createdBy.avatar.url ? (
            <img
              src={item.createdBy.avatar.url}
              alt={item.createdBy.name || 'User'}
              title={item.createdBy.name || item.createdBy.email}
            />
          ) : (
            <div
              className="workflow-widget__kanban-card-avatar-placeholder"
              title={item.createdBy.name || item.createdBy.email}
            >
              {(item.createdBy.name || item.createdBy.email || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>
        {item.priority && item.priority !== 'medium' && (
          <div className={`workflow-widget__kanban-card-priority workflow-widget__kanban-card-priority--${item.priority}`}>
            {item.priority === 'urgent' && '🔴'}
            {item.priority === 'high' && '🟠'}
            {item.priority === 'low' && '🟢'}
          </div>
        )}
      </div>

      <div className="workflow-widget__kanban-card-title">{item.title}</div>

      {item.description && (
        <div className="workflow-widget__kanban-card-description">{item.description}</div>
      )}

      {item.linkedPost && (
        <div className="workflow-widget__kanban-card-linked">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <span>Linked to post</span>
        </div>
      )}

      <div className="workflow-widget__kanban-card-footer">
        {item.assignedTo && item.assignedTo.length > 0 && (
          <div className="workflow-widget__kanban-card-assigned">
            <div className="workflow-widget__kanban-card-assigned-avatars">
              {item.assignedTo.slice(0, 3).map((assignee, index) => (
                <div
                  key={assignee.id}
                  className="workflow-widget__kanban-card-assigned-avatar"
                  title={assignee.name || assignee.email}
                  style={{ zIndex: 3 - index }}
                >
                  {assignee.avatar && typeof assignee.avatar === 'object' && assignee.avatar.url ? (
                    <img
                      src={assignee.avatar.url}
                      alt={assignee.name || 'User'}
                    />
                  ) : (
                    <div className="workflow-widget__kanban-card-assigned-avatar-placeholder">
                      {(assignee.name || assignee.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
              {item.assignedTo.length > 3 && (
                <div
                  className="workflow-widget__kanban-card-assigned-avatar workflow-widget__kanban-card-assigned-more"
                  title={`+${item.assignedTo.length - 3} more`}
                >
                  <div className="workflow-widget__kanban-card-assigned-avatar-placeholder">
                    +{item.assignedTo.length - 3}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="workflow-widget__kanban-card-date">{formatDate(item.updatedAt)}</div>
      </div>

      {item.dueDate && (
        <div className="workflow-widget__kanban-card-due">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Due {new Date(item.dueDate).toLocaleDateString()}</span>
        </div>
      )}
    </a>
  )
}
