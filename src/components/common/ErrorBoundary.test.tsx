import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

function ThrowingComponent({ message }: { message: string }): React.ReactNode {
  throw new Error(message)
}

function GoodComponent() {
  return <div>Working content</div>
}

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    )
    expect(screen.getByText('Working content')).toBeInTheDocument()
  })

  it('renders fallback UI when a child throws', () => {
    // Suppress React error boundary console output during test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingComponent message="Test crash" />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Reload App')).toBeInTheDocument()
    expect(screen.getByText('Test crash')).toBeInTheDocument()

    spy.mockRestore()
  })

  it('shows a reload button that reloads the page', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload: reloadMock },
      writable: true,
    })

    render(
      <ErrorBoundary>
        <ThrowingComponent message="crash" />
      </ErrorBoundary>
    )

    screen.getByText('Reload App').click()
    expect(reloadMock).toHaveBeenCalled()

    spy.mockRestore()
  })
})
