// setupProxy.js
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://port-back-sbs1.onrender.com',
      changeOrigin: true,
    })
  );
}
