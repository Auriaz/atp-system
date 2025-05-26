#!/usr/bin/env node

/**
 * Simple HTTP Server for Browser Tests
 * Serves the test-auth.html file for browser-based authentication testing
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const TESTS_DIR = __dirname;

const server = http.createServer((req, res) => {
    let filePath = path.join(TESTS_DIR, req.url === '/' ? 'test-auth.html' : req.url);

    // Security check - only serve files from tests directory
    if (!filePath.startsWith(TESTS_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

server.listen(PORT, () => {
    console.log('🧪 Browser Test Server Started');
    console.log(`📱 Access browser tests at: http://localhost:${PORT}`);
    console.log(`🔗 Direct link: http://localhost:${PORT}/test-auth.html`);
    console.log('\n📋 Make sure your main app is running on http://localhost:3000');
    console.log('   Run: pnpm dev (in another terminal)');
    console.log('\n⏹️  Press Ctrl+C to stop the test server');
});

process.on('SIGINT', () => {
    console.log('\n👋 Browser test server stopped');
    process.exit(0);
});
