'use client'

import React, {useCallback, useEffect, useState} from 'react'
import {useAuth} from '@payloadcms/ui'
import type {User, WorkflowItem} from '@/payload-types'
import {getClientSideURL} from '@/utilities/getURL'
import {checkRole} from '@/collections/Users/access/checkRole'
import {CreateWorkflowItemModal} from './CreateWorkflowItemModal'
import {WorkflowItemCard} from './WorkflowItemCard'
import {WorkflowItemModal} from './WorkflowItemModal'
import {notifyWorkflowMove} from '@/utilities/notifications/workflowNotifications'
import {FiEdit, FiFileText, FiFolder, FiGrid, FiPlus, FiUser} from 'react-icons/fi'
import './styles.scss'

interface WorkflowItemWithPopulated extends Omit<WorkflowItem, 'createdBy' | 'assignedTo'> {
  createdBy: User
  assignedTo?: User[]
}

interface KanbanColumn {
  id: string
  label: string
  items: WorkflowItemWithPopulated[]
}

const WORKFLOW_STATUSES = [
  { id: 'idea', label: 'Ideas', color: '#8B5CF6' },
  { id: 'writing', label: 'Being Written', color: '#3B82F6' },
  { id: 'ready-edit', label: 'Ready for Editing', color: '#10B981' },
  { id: 'editing', label: 'Being Edited', color: '#F59E0B' },
  { id: 'uploading', label: 'Being Uploaded', color: '#EF4444' },
  { id: 'ready-publish', label: 'Ready for Publishing', color: '#EC4899' },
  { id: 'published', label: 'Published', color: '#14B8A6' },
]

const DashboardWidget: React.FC = () => {
  const { user } = useAuth()
  const [workflowItems, setWorkflowItems] = useState<WorkflowItemWithPopulated[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<WorkflowItemWithPopulated | null>(null)
  const [draggedItem, setDraggedItem] = useState<WorkflowItemWithPopulated | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const baseURL = getClientSideURL()
  const serverURL = `${baseURL}/api`
  const adminURL = `${baseURL}/admin`

  const canCreatePost = user && checkRole(['author', 'editor', 'sauthor', 'seditor', 'admin'], user as User)

  const canMoveItem = (item: WorkflowItemWithPopulated): boolean => {
    if (!user) return false

    if (checkRole(['admin', 'sauthor', 'seditor', 'editor'], user as User)) {
      return true
    }

    if (item.createdBy.id === user.id) {
      return true
    }

    return item.assignedTo?.some(assignee => assignee.id === user.id) ?? false
  }

  const fetchWorkflowItems = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${serverURL}/workflow-items?limit=200&depth=2`, {
        credentials: 'include',
      })

      const data = await response.json()
      setWorkflowItems(data.docs || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching workflow items:', err)
      setError('Failed to load workflow items')
    } finally {
      setLoading(false)
    }
  }, [serverURL])

  useEffect(() => {
    if (user) {
      fetchWorkflowItems()
    }
  }, [user, fetchWorkflowItems])

  const getKanbanColumns = (): KanbanColumn[] => {
    const columns: KanbanColumn[] = WORKFLOW_STATUSES.map(status => ({
      id: status.id,
      label: status.label,
      items: [],
    }))

    workflowItems.forEach(item => {
      const column = columns.find(col => col.id === item.status)
      if (column) {
        column.items.push(item)
      }
    })

    columns.forEach(column => {
      column.items.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    })

    return columns
  }

  const getRecentActivity = () => {
    return [...workflowItems]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
  }

  const handleDragStart = (item: WorkflowItemWithPopulated) => {
    if (!canMoveItem(item)) {
      return
    }
    setDraggedItem(item)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    setDragOverColumn(null)

    if (!draggedItem || draggedItem.status === newStatus) {
      setDraggedItem(null)
      return
    }

    if (!canMoveItem(draggedItem)) {
      setDraggedItem(null)
      alert('You do not have permission to move this item.')
      return
    }

    const previousStatus = draggedItem.status

    // assumes the update works on the server's end for speed
    setWorkflowItems(prev =>
      prev.map(item =>
        item.id === draggedItem.id ? { ...item, status: newStatus as any } : item
      )
    )

    try {
      const response = await fetch(`${serverURL}/workflow-items/${draggedItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })

      await notifyWorkflowMove({
        workflowItem: { ...draggedItem, status: newStatus as any },
        fromStatus: previousStatus || 'unknown',
        toStatus: newStatus,
        movedBy: user as User,
      })

      await fetchWorkflowItems()
    } catch (err) {
      console.error('Error updating workflow item:', err)
      // revert the optimistic update
      setWorkflowItems(prev =>
        prev.map(item =>
          item.id === draggedItem.id ? { ...item, status: previousStatus } : item
        )
      )
      alert('Failed to move item. Please try again.')
    }

    setDraggedItem(null)
  }

  const handleItemCreated = () => {
    setShowCreateModal(false)
    fetchWorkflowItems()
  }

  const handleItemClick = (item: WorkflowItemWithPopulated) => {
    setSelectedItem(item)
  }

  const handleDeleteItem = async (itemId: number | string) => {
    try {
      await fetch(`${serverURL}/workflow-items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      await fetchWorkflowItems()
    } catch (err) {
      console.error('Error deleting workflow item:', err)
      alert('Failed to delete item. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: string): string => {
    return WORKFLOW_STATUSES.find(s => s.id === status)?.color || '#6B7280'
  }

  if (!user) {
    return null
  }

  const kanbanColumns = getKanbanColumns()
  const recentActivity = getRecentActivity()

  return (
    <div className="workflow-widget">
      <div className="workflow-widget__header">
        <div>
          <h2>Workflow Dashboard</h2>
          <p className="workflow-widget__greeting">
            Welcome back, <strong>{user.name || user.email}</strong>!
          </p>
        </div>
      </div>

      <div className="workflow-widget__quick-links">
        <div className="workflow-widget__links-grid">
          {canCreatePost && (
            <a
              href={`${adminURL}/collections/posts/create`}
              className="workflow-widget__link workflow-widget__link--primary"
            >
              <FiFileText size={20} />
              <span>Create New Article</span>
            </a>
          )}
          <a
            href={process.env.NEXT_PUBLIC_DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="workflow-widget__link"
          >
            <FiFolder size={20} />
            <span>Shared Drive</span>
          </a>
          <a
            href={`${adminURL}/collections/workflow-items`}
            className="workflow-widget__link"
          >
            <FiGrid size={20} />
            <span>All Workflow Items</span>
          </a>
          {(user as User).page && (
            <a
              href={`${adminURL}/collections/authors/${(user as User).page}`}
              className="workflow-widget__link"
            >
              <FiEdit size={20} />
              <span>Edit Bio</span>
            </a>
          )}
          <a
            href={`${adminURL}/collections/users/${user.id}`}
            className="workflow-widget__link"
          >
            <FiUser size={20} />
            <span>User Settings</span>
          </a>
        </div>
      </div>

      <div className="workflow-widget__stats">
        <div className="workflow-widget__stat">
          <div className="workflow-widget__stat-value">{workflowItems.length}</div>
          <div className="workflow-widget__stat-label">Total Items</div>
        </div>
        <div className="workflow-widget__stat">
          <div className="workflow-widget__stat-value">
            {workflowItems.filter(item =>
              item.assignedTo?.some(u => u.id === user.id)
            ).length}
          </div>
          <div className="workflow-widget__stat-label">Assigned to You</div>
        </div>
        <div className="workflow-widget__stat">
          <div className="workflow-widget__stat-value">
            {workflowItems.filter(item => item.status === 'published').length}
          </div>
          <div className="workflow-widget__stat-label">Published</div>
        </div>
      </div>

      <div className="workflow-widget__kanban">
        <div className="workflow-widget__kanban-header">
          <h3>Workflow Board</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="workflow-widget__add-button"
            title="Add new workflow item"
          >
            <FiPlus size={20} />
            <span>Add Item</span>
          </button>
        </div>

        {loading && <p className="workflow-widget__loading">Loading workflow items...</p>}
        {error && <p className="workflow-widget__error">{error}</p>}

        {!loading && !error && (
          <div className="workflow-widget__kanban-board">
            {kanbanColumns.map(column => (
              <div
                key={column.id}
                className={`workflow-widget__kanban-column ${
                  dragOverColumn === column.id ? 'workflow-widget__kanban-column--drag-over' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
                onDragLeave={() => setDragOverColumn(null)}
              >
                <div className="workflow-widget__kanban-column-header">
                  <div className="workflow-widget__kanban-column-title">
                    <div
                      className="workflow-widget__kanban-column-indicator"
                      style={{ backgroundColor: getStatusColor(column.id) }}
                    />
                    <h4>{column.label}</h4>
                  </div>
                  <span className="workflow-widget__kanban-count">{column.items.length}</span>
                </div>
                <div className="workflow-widget__kanban-items">
                  {column.items.length === 0 && (
                    <div className="workflow-widget__kanban-empty">
                      Drop items here or click + to add
                    </div>
                  )}
                  {column.items.map(item => (
                    <WorkflowItemCard
                      key={item.id}
                      item={item}
                      color={getStatusColor(column.id)}
                      adminURL={adminURL}
                      formatDate={formatDate}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onClick={handleItemClick}
                      canMove={canMoveItem(item)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="workflow-widget__recent">
        <h3>Recent Activity</h3>
        {!loading && !error && recentActivity.length === 0 && (
          <p className="workflow-widget__empty">No workflow items yet. Click "+ Add Item" to create your first one!</p>
        )}
        {!loading && !error && recentActivity.length > 0 && (
          <div className="workflow-widget__activity-list">
            {recentActivity.map(item => (
              <a
                key={item.id}
                href={`${adminURL}/collections/workflow-items/${item.id}`}
                className="workflow-widget__activity-item"
              >
                <div className="workflow-widget__activity-avatar">
                  {item.createdBy.avatar && typeof item.createdBy.avatar === 'object' && item.createdBy.avatar.url ? (
                    <img
                      src={item.createdBy.avatar.url}
                      alt={item.createdBy.name || 'User'}
                    />
                  ) : (
                    <div className="workflow-widget__activity-avatar-placeholder">
                      {(item.createdBy.name || item.createdBy.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="workflow-widget__activity-content">
                  <div className="workflow-widget__activity-title">{item.title}</div>
                  <div className="workflow-widget__activity-meta">
                    <span className="workflow-widget__activity-user">
                      {item.createdBy.name || item.createdBy.email}
                    </span>
                    <span
                      className="workflow-widget__activity-status"
                      style={{ backgroundColor: getStatusColor(item.status || 'idea') }}
                    >
                      {WORKFLOW_STATUSES.find(s => s.id === item.status)?.label || item.status}
                    </span>
                    <span className="workflow-widget__activity-date">
                      {formatDate(item.updatedAt)}
                    </span>
                  </div>
                  {item.assignedTo && item.assignedTo.length > 0 && (
                    <div className="workflow-widget__activity-assigned">
                      Assigned to: {item.assignedTo.map(u => u.name || u.email).join(', ')}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateWorkflowItemModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleItemCreated}
          serverURL={serverURL}
          user={user as User}
        />
      )}

      {selectedItem && (
        <WorkflowItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          adminURL={adminURL}
          onDelete={handleDeleteItem}
        />
      )}
    </div>
  )
}

export default DashboardWidget
