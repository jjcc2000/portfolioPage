import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Catches render-time crashes anywhere in the tree below it. Without this,
// an uncaught error unmounts the whole app and leaves a blank page with
// nothing visible — only a stack trace in the console a visitor would
// never open.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Portfolio crashed:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="crash-fallback">
          <p>Something went wrong loading this page.</p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
