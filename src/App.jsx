import React, { useState, useRef, useEffect } from 'react'

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsStreaming(true)

    // Simulate streaming response
    const response = "Hello! I'm a demo AI assistant. This is a streaming response that appears character by character. You can integrate this with your backend API for real AI responses."
    let currentText = ''
    
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }])

    for (let i = 0; i < response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20))
      currentText += response[i]
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = { role: 'assistant', content: currentText, streaming: true }
        return newMessages
      })
    }

    setMessages(prev => {
      const newMessages = [...prev]
      newMessages[newMessages.length - 1] = { role: 'assistant', content: currentText, streaming: false }
      return newMessages
    })
    setIsStreaming(false)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={() => setMessages([])}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New chat
        </button>
        
        <div className="chat-history">
          <div className="history-group">
            <h3>Today</h3>
            <div className="history-item active">Current chat</div>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="chat-container">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <h1>How can I help you today?</h1>
              <div className="suggestions">
                <button onClick={() => setInput('Explain quantum computing')}>
                  <div className="suggestion-title">Explain</div>
                  <div className="suggestion-text">Quantum computing concepts</div>
                </button>
                <button onClick={() => setInput('Write a Python function')}>
                  <div className="suggestion-title">Code</div>
                  <div className="suggestion-text">Python function example</div>
                </button>
                <button onClick={() => setInput('Plan a healthy meal')}>
                  <div className="suggestion-title">Plan</div>
                  <div className="suggestion-text">Healthy meal ideas</div>
                </button>
                <button onClick={() => setInput('Creative story idea')}>
                  <div className="suggestion-title">Create</div>
                  <div className="suggestion-text">Write a story</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.role}`}>
                  <div className="avatar">{msg.role === 'user' ? 'U' : 'AI'}</div>
                  <div className="content">
                    {msg.content}
                    {msg.streaming && <span className="cursor">▋</span>}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="input-container">
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Message AI..."
                rows="1"
                disabled={isStreaming}
              />
              <button type="submit" disabled={!input.trim() || isStreaming}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </form>
          <p className="disclaimer">AI can make mistakes. Verify important information.</p>
        </div>
      </main>
    </div>
  )
}
