import React from 'react';

export default function ConnectionStatus({ status }) {
  const statusConfig = {
    connected: {
      color: '#10a37f',
      text: 'Connected',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )
    },
    disconnected: {
      color: '#9ca3af',
      text: 'Disconnected',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      )
    },
    reconnecting: {
      color: '#f59e0b',
      text: 'Reconnecting...',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin">
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
      )
    },
    error: {
      color: '#ef4444',
      text: 'Connection Error',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      )
    },
    failed: {
      color: '#ef4444',
      text: 'Failed to Connect',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      )
    }
  };

  const config = statusConfig[status] || statusConfig.disconnected;

  return (
    <div className="connection-status" style={{ color: config.color }}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}
