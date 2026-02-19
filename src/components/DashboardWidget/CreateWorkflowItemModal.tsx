'use client'

import React, {useEffect, useState} from 'react'
import type {User} from '@/payload-types'
import {checkRole} from '@/collections/Users/access/checkRole'

interface CreateWorkflowItemModalProps {
  onClose: () => void
  onCreated: () => void
  serverURL: string
  user: User
}

export const CreateWorkflowItemModal: React.FC<CreateWorkflowItemModalProps> = ({
  onClose,
  onCreated,
  serverURL,
  user,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('idea')
  const [priority, setPriority] = useState('medium')
  const [createdBy, setCreatedBy] = useState<string | number>(user.id)
  const [assignedTo, setAssignedTo] = useState<(string | number)[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [creatorSearchQuery, setCreatorSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canEditCreator = checkRole(['admin', 'sauthor', 'seditor'], user)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${serverURL}/users?limit=100`, {
          credentials: 'include',
        })
        if (response.ok) {
          const data = await response.json()
          setUsers(data.docs || [])
        }
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }
    fetchUsers()
  }, [serverURL])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`${serverURL}/workflow-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          assignedTo: assignedTo.length > 0 ? assignedTo : undefined,
          createdBy: createdBy,
        }),
      })

      onCreated()
    } catch (err) {
      console.error('Error creating workflow item:', err)
      setError('Failed to create item. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const toggleAssignee = (userId: string | number) => {
    setAssignedTo(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    const name = (u.name || '').toLowerCase()
    const email = (u.email || '').toLowerCase()
    return name.includes(query) || email.includes(query)
  })

  const filteredCreators = users.filter(u => {
    if (!creatorSearchQuery.trim()) return true
    const query = creatorSearchQuery.toLowerCase()
    const name = (u.name || '').toLowerCase()
    const email = (u.email || '').toLowerCase()
    return name.includes(query) || email.includes(query)
  })

  return (
    <div className="workflow-modal-backdrop" onClick={handleBackdropClick}>
      <div className="workflow-modal">
        <div className="workflow-modal__header">
          <h3>Add Workflow Item</h3>
          <button
            type="button"
            onClick={onClose}
            className="workflow-modal__close"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="workflow-modal__form">
          {error && <div className="workflow-modal__error">{error}</div>}

          <div className="workflow-modal__field">
            <label htmlFor="title">
              Title <span className="workflow-modal__required">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Write article about..."
              required
              autoFocus
            />
          </div>

          <div className="workflow-modal__field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details (optional)"
              rows={3}
            />
          </div>

          <div className="workflow-modal__row">
            <div className="workflow-modal__field">
              <label htmlFor="status">Initial Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="idea">Idea</option>
                <option value="writing">Being Written</option>
                <option value="ready-edit">Ready for Editing</option>
                <option value="editing">Being Edited</option>
                <option value="uploading">Being Uploaded</option>
                <option value="ready-publish">Ready for Publishing</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="workflow-modal__field">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="workflow-modal__field">
            <label htmlFor="createdBy">
              Created By {!canEditCreator && <span className="workflow-modal__readonly">(Read-only)</span>}
            </label>
            {canEditCreator ? (
              <>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={creatorSearchQuery}
                  onChange={(e) => setCreatorSearchQuery(e.target.value)}
                  className="workflow-modal__search"
                  disabled={!canEditCreator}
                />
                <div className="workflow-modal__creator-list">
                  {filteredCreators.length === 0 && (
                    <p className="workflow-modal__assignees-empty">No users found matching "{creatorSearchQuery}"</p>
                  )}
                  {filteredCreators.map(u => (
                    <div
                      key={u.id}
                      className={`workflow-modal__creator-option ${createdBy === u.id ? 'workflow-modal__creator-option--selected' : ''}`}
                      onClick={() => setCreatedBy(u.id)}
                    >
                      <input
                        type="radio"
                        name="createdBy"
                        checked={createdBy === u.id}
                        onChange={() => setCreatedBy(u.id)}
                        readOnly
                      />
                      <span className="workflow-modal__creator-name">{u.name || u.email}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <input
                type="text"
                value={user.name || user.email}
                disabled
                className="workflow-modal__field-disabled"
              />
            )}
            {!canEditCreator && (
              <p className="workflow-modal__help-text">
                Only admins, super editors, and super authors can change the creator.
              </p>
            )}
          </div>

          <div className="workflow-modal__field">
            <label htmlFor="assign-search">Assign To</label>
            <input
              id="assign-search"
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="workflow-modal__search"
            />
            <div className="workflow-modal__assignees">
              {users.length === 0 && (
                <p className="workflow-modal__assignees-empty">Loading users...</p>
              )}
              {users.length > 0 && filteredUsers.length === 0 && (
                <p className="workflow-modal__assignees-empty">No users found matching "{searchQuery}"</p>
              )}
              {filteredUsers.map(u => (
                <div key={u.id} className="workflow-modal__assignee">
                  <input
                    type="checkbox"
                    id={`assignee-${u.id}`}
                    checked={assignedTo.includes(u.id)}
                    onChange={() => toggleAssignee(u.id)}
                  />
                  <label htmlFor={`assignee-${u.id}`} className="workflow-modal__assignee-label">
                    <span className="workflow-modal__assignee-name">{u.name || u.email}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="workflow-modal__actions">
            <button
              type="button"
              onClick={onClose}
              className="workflow-modal__button workflow-modal__button--secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="workflow-modal__button workflow-modal__button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
