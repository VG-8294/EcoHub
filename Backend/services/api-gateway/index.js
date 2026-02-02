const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'API Gateway' });
});

// Service Routes Configuration
const services = [
  {
    route: '/auth',
    target: 'http://localhost:4000',
    changeOrigin: true,
  },
  {
    route: '/challenges',
    target: 'http://localhost:8081',
    changeOrigin: true,
  },
  {
    route: '/wallet',
    target: 'http://localhost:8084',
    changeOrigin: true,
  },
  {
    route: '/shop',
    target: 'http://localhost:8085',
    changeOrigin: true,
  },
  {
    route: '/workshop',
    target: 'http://localhost:8083',
    changeOrigin: true,
  }
];

// Apply Proxy Rules
services.forEach(({ route, target, changeOrigin }) => {
  app.use(route, createProxyMiddleware({
    target,
    changeOrigin,
    pathRewrite: {
      [`^${route}`]: '', // Remove the route prefix when forwarding if needed, but usually microservices might be root or have their own context. 
      // For now, assuming the services don't expect the prefix if I remove it.
      // However, if the services are "Auth Service" likely it has /login, /register at root? 
      // Or does it have /auth/login? 
      // Standard pattern: 
      // Gateway: /auth/login -> Service: /login  (pathRewrite needed)
      // Gateway: /auth/login -> Service: /auth/login (no pathRewrite needed)
      // I'll assume pathRewrite is safest to strip the prefix for now, unless the services are spaced out. 
      // If I look at the service names "daily-challenges", "reward-wallet", they hint at domains. 
      // Let's keep the rewrite to strip the prefix for now.
    },
    onProxyReq: (proxyReq, req, res) => {
      // Optional: Add custom headers or logging
    },
    onError: (err, req, res) => {
      console.error(`Error proxing request to ${target}:`, err);
      res.status(503).json({ error: 'Service Unavailable' });
    }
  }));
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
