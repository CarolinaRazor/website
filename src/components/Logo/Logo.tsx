import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const {loading: loadingFromProps, priority: priorityFromProps, className} = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="LiberatorCH Logo"
      width={230}
      height={50}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('', className)} // max-w-[9.375rem] w-full h-[34px]
      src="/logo.svg"
    />
  )
}

export const Icon = (props: Props) => {
  const {loading: loadingFromProps, priority: priorityFromProps, className} = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'
  return (
    <img
      alt="LiberatorCH Icon"
      width={50}
      height={50}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('', className)} // max-w-[9.375rem] w-full h-[34px]
      src="/favicon.svg"
    />
  )
}

export const LogoTagline = (props: Props) => {
  const {loading: loadingFromProps, priority: priorityFromProps, className} = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="LiberatorCH Logo"
      width={230}
      height={50}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('', className)} // max-w-[9.375rem] w-full h-[34px]
      src="/logo_tagline.svg"
    />
  )
}
