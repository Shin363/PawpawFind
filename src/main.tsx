import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { env } from './config/env'
import './styles.css'

async function bootstrap() {
  if (env.enableMsw) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

void bootstrap()
