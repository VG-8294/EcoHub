const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();
const { verifyToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - order matters!
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check (public)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'API Gateway' });
});

// Service Routes Configuration
const services = [
  {
    route: '/challenges',
    target: 'http://localhost:8081',
    changeOrigin: true,
    protected: true,
  },
  {
    route: '/wallet',
    target: 'http://localhost:8084',
    changeOrigin: true,
    protected: true,
  },
  {
    route: '/shop',
    target: 'http://localhost:8085',
    changeOrigin: true,
    protected: true,
  },
  {
    route: '/workshop',
    target: 'http://localhost:8083',
    changeOrigin: true,
    protected: true,
  }
];

// Apply Proxy Rules
services.forEach(({ route, target, changeOrigin, protected: isProtected }) => {
  const proxyMiddleware = createProxyMiddleware({
    target,
    changeOrigin,
    pathRewrite: {
      [`^${route}`]: '',
    },
    onProxyReq: (proxyReq, req, res) => {
      // Log the request
      console.log(`[PROXY] ${req.method} ${req.originalUrl} -> ${target}${req.url}`);
      
      // Pass user info to backend services if authenticated
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId);
        proxyReq.setHeader('X-User-Admin', req.user.isAdmin);
        console.log(`[AUTH] User ${req.user.userId} (Admin: ${req.user.isAdmin})`);
      }
      
      // Properly handle body for POST, PUT, PATCH
      if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
        const bodyString = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyString));
        proxyReq.write(bodyString);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log response
      console.log(`[RESPONSE] ${req.method} ${req.originalUrl} -> ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error(`[ERROR] Proxy error for ${req.method} ${req.originalUrl}:`, err.message);
      res.status(503).json({ 
        error: 'Service Unavailable', 
        message: err.message,
        service: target
      });
    }
  });

  // Apply authentication middleware if route is protected
  if (isProtected) {
    app.use(route, verifyToken, proxyMiddleware);
  } else {
    app.use(route, proxyMiddleware);
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
