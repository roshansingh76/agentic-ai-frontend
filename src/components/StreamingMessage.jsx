import React from 'react';

export default function StreamingMessage({ content, isStreaming }) {
  return (
    <div className="streaming-content">
      {content}
      {isStreaming && (
        <span className="streaming-cursor" aria-label="Streaming">
          <span className="cursor-blink"></span>
        </span>
      )}
    </div>
  );
}
