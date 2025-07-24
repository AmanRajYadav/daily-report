class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    this.measurePageLoad();
    this.measureResourceTiming();
    this.setupLongTaskObserver();
    this.setupLayoutShiftObserver();
    this.setupNavigationTiming();
  }

  measurePageLoad() {
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      
      this.metrics = {
        ...this.metrics,
        pageLoadTime,
        domContentLoaded,
        connectTime,
        timestamp: Date.now()
      };
      
      console.log('📊 Performance Metrics:', {
        'Page Load Time': `${pageLoadTime}ms`,
        'DOM Content Loaded': `${domContentLoaded}ms`,
        'Connect Time': `${connectTime}ms`
      });
      
      this.reportMetrics();
    });
  }

  measureResourceTiming() {
    // Measure resource loading performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('/assets/')) {
          const loadTime = entry.responseEnd - entry.requestStart;
          console.log(`🎯 Asset Load: ${entry.name.split('/').pop()} - ${loadTime.toFixed(2)}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }

  setupLongTaskObserver() {
    // Monitor for long tasks that block the main thread
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.warn(`⚠️ Long Task detected: ${entry.duration.toFixed(2)}ms`);
          
          this.trackEvent('long_task', {
            duration: entry.duration,
            startTime: entry.startTime
          });
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  setupLayoutShiftObserver() {
    // Monitor Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        
        console.log(`📐 Cumulative Layout Shift: ${clsValue.toFixed(4)}`);
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  setupNavigationTiming() {
    // Measure navigation timing with Navigation Timing API Level 2
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const ttfb = entry.responseStart - entry.requestStart;
          const fcp = entry.loadEventEnd - entry.fetchStart;
          
          console.log('🚀 Navigation Timing:', {
            'Time to First Byte': `${ttfb.toFixed(2)}ms`,
            'First Contentful Paint': `${fcp.toFixed(2)}ms`
          });
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  reportMetrics() {
    // Report to analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        event_category: 'Performance',
        name: 'load',
        value: this.metrics.pageLoadTime,
        custom_map: {
          'metric1': this.metrics.domContentLoaded,
          'metric2': this.metrics.connectTime
        }
      });
    }
    
    // Store in localStorage for debugging
    localStorage.setItem('fluence_performance_metrics', JSON.stringify(this.metrics));
  }

  trackEvent(eventName, properties) {
    console.log(`📊 Performance Event: ${eventName}`, properties);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'Performance',
        ...properties
      });
    }
  }

  getMetrics() {
    return this.metrics;
  }
} 