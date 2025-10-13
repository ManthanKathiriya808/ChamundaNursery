// Global Error Boundary to catch runtime errors in React components
import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log for diagnostics; could integrate with monitoring service
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-container">
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
            <h1 className="text-lg font-semibold">Something went wrong</h1>
            <p className="mt-1 text-sm">An unexpected error occurred in the UI.</p>
            {this.state.error && (
              <pre className="mt-2 overflow-auto text-xs whitespace-pre-wrap" aria-live="polite">
                {String(this.state.error)}
              </pre>
            )}
            <div className="mt-3 flex gap-2">
              <button className="btn btn-outline" onClick={() => this.setState({ hasError: false, error: null })}>Try Again</button>
              <button className="btn btn-primary" onClick={() => window.location.assign('/')}>Go Home</button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}