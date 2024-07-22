import { SpeedInsights } from "@vercel/speed-insights/react"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SpeedInsights />
    <App />
  </React.StrictMode>,
)
