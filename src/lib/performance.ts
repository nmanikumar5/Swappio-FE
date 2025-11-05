/**
 * Performance monitoring utilities for Swappio
 */

export class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private metrics: Map<string, number[]> = new Map();

    private constructor() { }

    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    /**
     * Measure execution time of a function
     */
    async measureAsync<T>(
        name: string,
        fn: () => Promise<T>
    ): Promise<T> {
        const start = performance.now();
        try {
            const result = await fn();
            const duration = performance.now() - start;
            this.recordMetric(name, duration);
            return result;
        } catch (error) {
            const duration = performance.now() - start;
            this.recordMetric(`${name}_error`, duration);
            throw error;
        }
    }

    /**
     * Measure execution time of a synchronous function
     */
    measure<T>(name: string, fn: () => T): T {
        const start = performance.now();
        try {
            const result = fn();
            const duration = performance.now() - start;
            this.recordMetric(name, duration);
            return result;
        } catch (error) {
            const duration = performance.now() - start;
            this.recordMetric(`${name}_error`, duration);
            throw error;
        }
    }

    /**
     * Record a metric manually
     */
    recordMetric(name: string, duration: number): void {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        this.metrics.get(name)!.push(duration);

        // Log slow operations in development
        if (process.env.NODE_ENV === "development" && duration > 1000) {
            console.warn(`⚠️ Slow operation: ${name} took ${duration.toFixed(2)}ms`);
        }
    }

    /**
     * Get statistics for a metric
     */
    getStats(name: string) {
        const values = this.metrics.get(name) || [];
        if (values.length === 0) {
            return null;
        }

        const sorted = [...values].sort((a, b) => a - b);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const p50 = sorted[Math.floor(sorted.length * 0.5)];
        const p95 = sorted[Math.floor(sorted.length * 0.95)];
        const p99 = sorted[Math.floor(sorted.length * 0.99)];

        return {
            count: values.length,
            avg: Math.round(avg * 100) / 100,
            min: Math.round(min * 100) / 100,
            max: Math.round(max * 100) / 100,
            p50: Math.round(p50 * 100) / 100,
            p95: Math.round(p95 * 100) / 100,
            p99: Math.round(p99 * 100) / 100,
        };
    }

    /**
     * Get all metrics
     */
    getAllStats() {
        const stats: Record<string, ReturnType<typeof this.getStats>> = {};
        for (const [name] of this.metrics) {
            stats[name] = this.getStats(name);
        }
        return stats;
    }

    /**
     * Clear all metrics
     */
    clear(): void {
        this.metrics.clear();
    }

    /**
     * Log performance report to console
     */
    report(): void {
        console.log("📊 Performance Report:");
        console.table(this.getAllStats());
    }
}

/**
 * Web Vitals tracking
 */
export function reportWebVitals(metric: {
    id: string;
    name: string;
    value: number;
    label: string;
}) {
    const monitor = PerformanceMonitor.getInstance();
    monitor.recordMetric(`web_vitals_${metric.name}`, metric.value);

    if (process.env.NODE_ENV === "development") {
        console.log(`📈 ${metric.name}:`, metric.value);
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === "production") {
        // Example: send to Google Analytics, Vercel Analytics, etc.
        // gtag('event', metric.name, {
        //   value: Math.round(metric.value),
        //   event_label: metric.id,
        // });
    }
}

/**
 * Image optimization helper
 */
export function getOptimizedImageUrl(
    url: string,
    width?: number,
    quality?: number
): string {
    if (!url) return "";

    // If using Cloudinary
    if (url.includes("cloudinary.com")) {
        const baseUrl = url.split("/upload/")[0];
        const imagePath = url.split("/upload/")[1];

        const transformations = [];
        if (width) transformations.push(`w_${width}`);
        if (quality) transformations.push(`q_${quality}`);
        transformations.push("f_auto"); // Auto format

        return `${baseUrl}/upload/${transformations.join(",")}/${imagePath}`;
    }

    return url;
}

/**
 * Debounce function for search/filter inputs
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll/resize events
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Lazy load images intersection observer
 */
export function createImageObserver(
    callback: (entry: IntersectionObserverEntry) => void
): IntersectionObserver | null {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
        return null;
    }

    return new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    callback(entry);
                }
            });
        },
        {
            rootMargin: "50px",
            threshold: 0.01,
        }
    );
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default PerformanceMonitor;
