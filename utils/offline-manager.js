class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.offlineQueue = [];
    this.init();
  }

  init() {
    this.setupOnlineOfflineListeners();
    this.setupOfflineUI();
    this.loadOfflineQueue();
  }

  setupOnlineOfflineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('✅ Back online');
      this.hideOfflineMessage();
      this.processOfflineQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📵 Gone offline');
      this.showOfflineMessage();
    });
  }

  setupOfflineUI() {
    // Create offline indicator
    const offlineIndicator = document.createElement('div');
    offlineIndicator.id = 'offline-indicator';
    offlineIndicator.className = 'offline-indicator hidden';
    offlineIndicator.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #f59e0b;
        color: white;
        text-align: center;
        padding: 10px;
        z-index: 1002;
        font-weight: 600;
      ">
        📵 You're offline. Some features may be limited.
      </div>
    `;
    
    document.body.appendChild(offlineIndicator);
  }

  showOfflineMessage() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.classList.remove('hidden');
    }
  }

  hideOfflineMessage() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.classList.add('hidden');
    }
  }

  queueOfflineAction(action) {
    this.offlineQueue.push({
      ...action,
      timestamp: Date.now()
    });
    
    localStorage.setItem('fluence_offline_queue', JSON.stringify(this.offlineQueue));
    console.log('📋 Action queued for when online:', action.type);
  }

  loadOfflineQueue() {
    const stored = localStorage.getItem('fluence_offline_queue');
    if (stored) {
      this.offlineQueue = JSON.parse(stored);
    }
  }

  async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;
    
    console.log(`🔄 Processing ${this.offlineQueue.length} offline actions...`);
    
    const results = await Promise.allSettled(
      this.offlineQueue.map(action => this.processAction(action))
    );
    
    // Remove successfully processed actions
    this.offlineQueue = this.offlineQueue.filter((action, index) => 
      results[index].status === 'rejected'
    );
    
    localStorage.setItem('fluence_offline_queue', JSON.stringify(this.offlineQueue));
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    console.log(`✅ Successfully processed ${successful} offline actions`);
  }

  async processAction(action) {
    switch (action.type) {
      case 'quiz_result':
        return this.syncQuizResult(action.data);
      case 'progress_update':
        return this.syncProgress(action.data);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  async syncQuizResult(data) {
    const response = await fetch('/api/quiz-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync quiz result');
    }
    
    return response.json();
  }

  async syncProgress(data) {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync progress');
    }
    
    return response.json();
  }
} 