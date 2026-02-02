const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();
const { verifyToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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
    protected: true, // Requires authentication
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
      // Pass user info to backend services if authenticated
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.userId);
        proxyReq.setHeader('X-User-Admin', req.user.isAdmin);
      }
    },
    onError: (err, req, res) => {
      console.error(`Error proxying request to ${target}:`, err);
      res.status(503).json({ error: 'Service Unavailable' });
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
