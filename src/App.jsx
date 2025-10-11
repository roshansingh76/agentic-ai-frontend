import React, { useState } from 'react'

const apiBase = (typeof window !== 'undefined' && window.__env && window.__env.API_URL) ? window.__env.API_URL : 'http://localhost:8000'

export default function App() {
  const [resp, setResp] = useState('')
  const callBackend = async () => {
    try {
      const r = await fetch(`${apiBase}/user/me`)
      const txt = await r.text()
      setResp(`Status: ${r.status} - ${txt}`)
    } catch (e) {
      setResp('Error: ' + e.message)
    }
  }
  return (
    <div className="app">
      <h1>Agentic AI Frontend</h1>
      <p>Backend base URL: <code>{apiBase}</code></p>
      <button onClick={callBackend}>Call Backend /user/me</button>
      <pre>{resp}</pre>
    </div>
  )
}
