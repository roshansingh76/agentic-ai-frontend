class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 2000;
    this.messageHandlers = new Set();
    this.errorHandlers = new Set();
    this.statusHandlers = new Set();
  }

  connect(url) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.notifyStatus('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyMessage(data);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      this.ws.onerror = (error) => {
        this.notifyError(error);
        this.notifyStatus('error');
      };

      this.ws.onclose = () => {
        this.notifyStatus('disconnected');
        this.attemptReconnect(url);
      };
    } catch (error) {
      this.notifyError(error);
      this.attemptReconnect(url);
    }
  }

  attemptReconnect(url) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.notifyStatus('reconnecting');
      setTimeout(() => {
        this.connect(url);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      this.notifyStatus('failed');
    }
  }

  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  onMessage(handler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onError(handler) {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  onStatus(handler) {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  notifyMessage(data) {
    this.messageHandlers.forEach(handler => handler(data));
  }

  notifyError(error) {
    this.errorHandlers.forEach(handler => handler(error));
  }

  notifyStatus(status) {
    this.statusHandlers.forEach(handler => handler(status));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export default new WebSocketService();
