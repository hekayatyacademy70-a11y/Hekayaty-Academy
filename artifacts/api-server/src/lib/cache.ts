import { LRUCache } from "lru-cache";
import { Request, Response, NextFunction } from "express";

// Singleton cache instance
export const apiCache = new LRUCache<string, any>({
  max: 500, // maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes default TTL
});

/**
 * Express middleware to cache responses based on the request URL.
 * It caches successful GET requests.
 */
export const cacheMiddleware = (ttlMinutes: number = 5) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = req.originalUrl;
    const cachedResponse = apiCache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Override res.json to intercept and cache the response
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      // Only cache success responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        apiCache.set(key, body, { ttl: 1000 * 60 * ttlMinutes });
      }
      return originalJson(body);
    };

    next();
  };
};
