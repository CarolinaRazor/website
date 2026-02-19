import React from 'react'
import {Icon as BaseIcon, Logo as BaseLogo} from './Logo'
import './admin-logo.css'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  return (
    <div className="admin-logo-wrapper">
      <BaseLogo {...props} />
    </div>
  )
}

export const Icon = (props: Props) => {
  return (
    <div className="admin-logo-wrapper">
      <BaseIcon {...props} />
    </div>
  )
}
