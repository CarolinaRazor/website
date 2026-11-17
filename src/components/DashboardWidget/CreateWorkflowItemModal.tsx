'use client'

import React, {useEffect, useState} from 'react'
import type {User} from '@/payload-types'
import {checkRole} from '@/collections/Users/access/checkRole'
import {FiPlus, FiX} from 'react-icons/fi'

type AssigneeRole = 'author' | 'editor' | 'other'

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
  const [createArticle, setCreateArticle] = useState(false)
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('idea')
  const [priority, setPriority] = useState('medium')
  const [createdBy, setCreatedBy] = useState<string | number>(user.id)
  const [assignedTo, setAssignedTo] = useState<Array<{ user: string | number; role: AssigneeRole }>>([])
  const [links, setLinks] = useState<Array<{ label: string; url: string }>>([])
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
      let linkedPost: number | undefined
      if (createArticle) {
        const authors = assignedTo
          .filter(assignee => assignee.role === 'author')
          .map(assignee => assignee.user)
        const articleResponse = await fetch(`${serverURL}/posts?draft=true`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            title: title.trim(),
            ...(authors.length > 0 ? { authors } : {}),
          }),
        })

        if (!articleResponse.ok) {
          throw new Error(`Failed to create article: ${articleResponse.status}`)
        }

        const articleData = await articleResponse.json()
        if (!articleData.doc?.id) {
          throw new Error('Article creation response did not include an article ID')
        }
        linkedPost = articleData.doc.id
      }

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
          linkedPost,
          assignedTo: assignedTo.length > 0 ? assignedTo : undefined,
          createdBy: createdBy,
          links: links.filter(link => link.label.trim() && link.url.trim()).length > 0
            ? links.filter(link => link.label.trim() && link.url.trim())
            : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create workflow item: ${response.status}`)
      }

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
    setAssignedTo(prev => prev.some(assignee => String(assignee.user) === String(userId))
      ? prev.filter(assignee => String(assignee.user) !== String(userId))
      : [...prev, { user: userId, role: 'other' }]
    )
  }

  const setAssigneeRole = (userId: string | number, role: AssigneeRole) => {
    setAssignedTo(prev => prev.map(assignee =>
      String(assignee.user) === String(userId) ? { ...assignee, role } : assignee
    ))
  }

  const addLink = () => {
    setLinks(prev => [...prev, { label: '', url: '' }])
  }

  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index))
  }

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    setLinks(prev => prev.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    ))
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
            <FiX size={20} />
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
            <label className="workflow-modal__create-article">
              <input
                type="checkbox"
                checked={createArticle}
                onChange={(e) => setCreateArticle(e.target.checked)}
              />
              Create and link a new article
            </label>
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
            <label>Links</label>
            <div className="workflow-modal__links-container">
              {links.map((link, index) => (
                <div key={index} className="workflow-modal__link-row">
                  <input
                    type="text"
                    placeholder="Label (e.g., Google Doc)"
                    value={link.label}
                    onChange={(e) => updateLink(index, 'label', e.target.value)}
                    className="workflow-modal__link-input"
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    className="workflow-modal__link-input"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="workflow-modal__link-remove"
                    aria-label="Remove link"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                className="workflow-modal__link-add"
              >
                <FiPlus size={16} />
                <span>Add Link</span>
              </button>
            </div>
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
                    checked={assignedTo.some(assignee => String(assignee.user) === String(u.id))}
                    onChange={() => toggleAssignee(u.id)}
                  />
                  <label htmlFor={`assignee-${u.id}`} className="workflow-modal__assignee-label">
                    <span className="workflow-modal__assignee-name">{u.name || u.email}</span>
                  </label>
                  {assignedTo.some(assignee => String(assignee.user) === String(u.id)) && (
                    <fieldset className="workflow-modal__assignee-roles">
                      <legend className="sr-only">Role for {u.name || u.email}</legend>
                      {(['author', 'editor', 'other'] as const).map(role => (
                        <label key={role}>
                          <input
                            type="radio"
                            name={`assignee-role-${u.id}`}
                            value={role}
                            checked={assignedTo.find(assignee => String(assignee.user) === String(u.id))?.role === role}
                            onChange={() => setAssigneeRole(u.id, role)}
                          />
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </label>
                      ))}
                    </fieldset>
                  )}
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
