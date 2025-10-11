import React, { useState, useRef, useEffect } from 'react'
import websocketService from './services/websocket'
import StreamingMessage from './components/StreamingMessage'
import ConnectionStatus from './components/ConnectionStatus'

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [input])

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080';

    const unsubscribeMessage = websocketService.onMessage((data) => {
      if (data.type === 'stream') {
        setStreamingContent(prev => prev + (data.content || ''))
      } else if (data.type === 'end') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: streamingContent + (data.content || '')
        }])
        setStreamingContent('')
        setIsStreaming(false)
      } else if (data.type === 'error') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Error: ${data.message || 'An error occurred'}`
        }])
        setStreamingContent('')
        setIsStreaming(false)
      }
    })

    const unsubscribeStatus = websocketService.onStatus((status) => {
      setConnectionStatus(status)
    })

    const unsubscribeError = websocketService.onError((error) => {
      console.error('WebSocket error:', error)
    })

    websocketService.connect(wsUrl)

    return () => {
      unsubscribeMessage()
      unsubscribeStatus()
      unsubscribeError()
      websocketService.disconnect()
    }
  }, [streamingContent])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsStreaming(true)
    setStreamingContent('')

    if (websocketService.isConnected()) {
      websocketService.send({
        type: 'message',
        content: userMessage
      })
    } else {
      setTimeout(() => {
        const demoResponse = 'This is a demo streaming response. To enable real AI responses with WebSocket streaming, configure your backend WebSocket server.\n\nThe WebSocket service is ready and will automatically connect when a server is available at the configured endpoint.'

        let index = 0
        const streamInterval = setInterval(() => {
          if (index < demoResponse.length) {
            setStreamingContent(prev => prev + demoResponse[index])
            index++
          } else {
            clearInterval(streamInterval)
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: demoResponse
            }])
            setStreamingContent('')
            setIsStreaming(false)
          }
        }, 20)
      }, 300)
    }
  }

  const startNewChat = () => {
    setMessages([])
    setInput('')
    setStreamingContent('')
    setIsStreaming(false)
  }

  return (
    <div className="app-container">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="new-chat" onClick={startNewChat}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>New chat</span>
          </button>
        </div>

        <div className="chat-list">
          <div className="chat-list-section">
            <div className="section-title">Today</div>
            <div className="chat-item active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Current Conversation</span>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <ConnectionStatus status={connectionStatus} />
          <div className="user-menu">
            <div className="user-avatar">U</div>
            <span>User</span>
          </div>
        </div>
      </div>

      <div className="main-area">
        <button className="mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>

        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="logo-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <h1>How can I help you today?</h1>
            <div className="example-prompts">
              <button className="prompt-card" onClick={() => setInput('Explain quantum computing in simple terms')}>
                <div className="prompt-title">Explain concepts</div>
                <div className="prompt-text">Quantum computing in simple terms</div>
              </button>
              <button className="prompt-card" onClick={() => setInput('Help me plan a trip to Japan')}>
                <div className="prompt-title">Plan something</div>
                <div className="prompt-text">A two-week trip to Japan</div>
              </button>
              <button className="prompt-card" onClick={() => setInput('Write a creative story about time travel')}>
                <div className="prompt-title">Get creative</div>
                <div className="prompt-text">A story about time travel</div>
              </button>
              <button className="prompt-card" onClick={() => setInput('Help me debug my React code')}>
                <div className="prompt-title">Code help</div>
                <div className="prompt-text">Debug my React application</div>
              </button>
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`msg-wrapper ${msg.role}`}>
                <div className="msg-container">
                  <div className="msg-avatar">
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>
                  <div className="msg-content">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="msg-wrapper assistant">
                <div className="msg-container">
                  <div className="msg-avatar">AI</div>
                  <div className="msg-content">
                    {streamingContent ? (
                      <StreamingMessage content={streamingContent} isStreaming={true} />
                    ) : (
                      <div className="thinking">
                        <span></span><span></span><span></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="input-area">
          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
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
                placeholder="Message ChatGPT..."
                rows="1"
              />
              <button type="submit" disabled={!input.trim() || isStreaming}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </form>
          <div className="input-footer">
            ChatGPT can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  )
}
