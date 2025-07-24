const CACHE_NAME = 'fluence-learning-v2.1';
const STATIC_CACHE = 'fluence-static-v2.1';
const DYNAMIC_CACHE = 'fluence-dynamic-v2.1';

// Critical assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/fluence-icon-192.png',
  '/fluence-icon-512.png',
  '/fluence-favicon.ico',
  // Critical sprites
  '/assets/sprites/creatures/math-dragon.svg',
  '/assets/sprites/creatures/science-owl.svg',
  '/assets/sprites/creatures/general-fox.svg',
  // Critical sounds
  '/assets/sounds/effects/click.mp3',
  '/assets/sounds/effects/correct.mp3',
  '/assets/sounds/effects/incorrect.mp3',
  // Critical icons
  '/assets/icons/quiz-shortcut.png',
  '/assets/icons/progress-shortcut.png',
  '/assets/icons/report-shortcut.png',
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Caveat:wght@400;700&display=swap'
];

// Assets to cache on first request
const CACHE_ON_REQUEST = [
  '/assets/sprites/',
  '/assets/sounds/',
  '/assets/images/',
  'https://api.github.com/',
  'https://fonts.gstatic.com/'
];

// Install event - cache critical assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS.filter(url => !url.includes('fonts.googleapis')));
      }),
      // Handle Google Fonts separately (they can be tricky)
      caches.open(STATIC_CACHE).then(cache => {
        return fetch('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Caveat:wght@400;700&display=swap')
          .then(response => {
            if (response.ok) {
              return cache.put('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Caveat:wght@400;700&display=swap', response);
            }
          })
          .catch(() => console.log('Google Fonts caching failed - will work offline without custom fonts'));
      })
    ]).then(() => {
      console.log('✅ Service Worker installed successfully');
      return self.skipWaiting(); // Force activation
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker activated successfully');
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip Chrome extension requests
  if (requestUrl.protocol === 'chrome-extension:') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached version if available
      if (cachedResponse) {
        console.log('📦 Serving from cache:', event.request.url);
        return cachedResponse;
      }
      
      // Network request with caching strategy
      return fetch(event.request).then(networkResponse => {
        // Don't cache if response is not ok
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        
        // Determine which cache to use
        const shouldCache = CACHE_ON_REQUEST.some(pattern => 
          event.request.url.includes(pattern)
        );
        
        if (shouldCache) {
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            console.log('💾 Caching new asset:', event.request.url);
            cache.put(event.request, responseToCache);
          });
        }
        
        return networkResponse;
      }).catch(() => {
        // Return offline fallback for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/') || new Response('Offline - Please check your connection', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        }
        
        // Return placeholder for images
        if (event.request.destination === 'image') {
          return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">Image unavailable</text></svg>', {
            headers: { 'Content-Type': 'image/svg+xml' }
          });
        }
        
        throw new Error('Network failed and no cache available');
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'quiz-results') {
    event.waitUntil(syncQuizResults());
  }
});

// Sync quiz results when back online
async function syncQuizResults() {
  try {
    const offlineData = await getOfflineQuizData();
    if (offlineData.length > 0) {
      // Send to server when online
      await fetch('/api/sync-quiz-results', {
        method: 'POST',
        body: JSON.stringify(offlineData),
        headers: { 'Content-Type': 'application/json' }
      });
      // Clear offline data
      await clearOfflineQuizData();
      console.log('✅ Quiz results synced successfully');
    }
  } catch (error) {
    console.error('❌ Failed to sync quiz results:', error);
  }
}

// Helper functions for offline data management
async function getOfflineQuizData() {
  // This would typically read from IndexedDB or localStorage
  // For now, return empty array
  return [];
}

async function clearOfflineQuizData() {
  // This would typically clear from IndexedDB or localStorage
  console.log('Clearing offline quiz data');
} 