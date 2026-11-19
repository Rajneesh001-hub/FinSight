const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;
const BACKEND = 'http://localhost:5001';
const DIST = path.join(__dirname, 'dist');

const mime = {
  '.html': 'text/html', '.js': 'application/javascript',
  '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  // Proxy /api/* to backend
  if (req.url.startsWith('/api')) {
    const backendUrl = url.parse(BACKEND);
    const options = {
      hostname: backendUrl.hostname,
      port: backendUrl.port || 5001,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: backendUrl.hostname }
    };

    const proxy = http.request(options, (backendRes) => {
      res.writeHead(backendRes.statusCode, backendRes.headers);
      backendRes.pipe(res);
    });

    proxy.on('error', (e) => {
      res.writeHead(502);
      res.end(JSON.stringify({ error: 'Backend unavailable: ' + e.message }));
    });

    req.pipe(proxy);
    return;
  }

  // Serve static files
  let filePath = path.join(DIST, req.url === '/' ? 'index.html' : req.url);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback — serve index.html for all routes
      fs.readFile(path.join(DIST, 'index.html'), (err2, html) => {
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        });
        res.end(html);
      });
    } else {
      const ext = path.extname(filePath);
      const isHtml = ext === '.html';
      res.writeHead(200, {
        'Content-Type': mime[ext] || 'application/octet-stream',
        // No cache for HTML, long cache for hashed JS/CSS
        'Cache-Control': isHtml ? 'no-store, no-cache, must-revalidate' : 'public, max-age=31536000'
      });
      res.end(data);
    }
  });
});

server.listen(PORT, 'localhost', () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
  console.log(`Proxying /api/* → ${BACKEND}`);
});
