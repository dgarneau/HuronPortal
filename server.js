// Custom server.js with enhanced logging for Azure diagnostics
console.log('========================================');
console.log('SERVER STARTUP - BEGIN');
console.log('========================================');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('CWD:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || 3000);
console.log('Memory usage:', process.memoryUsage());
console.log('========================================');

// Log module paths
console.log('Module paths:', require('module').globalPaths);
console.log('========================================');

// Check for bcryptjs in node_modules
const fs = require('fs');
const path = require('path');

const nodeModulesPath = path.join(process.cwd(), 'node_modules');
console.log('Checking node_modules at:', nodeModulesPath);
console.log('node_modules exists:', fs.existsSync(nodeModulesPath));

if (fs.existsSync(nodeModulesPath)) {
  const bcryptjsPath = path.join(nodeModulesPath, 'bcryptjs');
  console.log('Checking bcryptjs at:', bcryptjsPath);
  console.log('bcryptjs exists:', fs.existsSync(bcryptjsPath));
  
  if (fs.existsSync(bcryptjsPath)) {
    console.log('bcryptjs directory contents:');
    const files = fs.readdirSync(bcryptjsPath);
    files.forEach(file => {
      const filePath = path.join(bcryptjsPath, file);
      const stats = fs.statSync(filePath);
      console.log(`  ${stats.isDirectory() ? '[DIR]' : '[FILE]'} ${file}`);
    });
    
    // Try to require bcryptjs
    try {
      console.log('Attempting to require bcryptjs...');
      const bcrypt = require('bcryptjs');
      console.log('✓ bcryptjs loaded successfully!');
      console.log('bcryptjs exports:', Object.keys(bcrypt));
    } catch (error) {
      console.error('✗ FAILED to require bcryptjs:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
    }
  } else {
    console.error('✗ bcryptjs directory NOT FOUND in node_modules!');
    console.log('Available packages in node_modules:');
    try {
      const packages = fs.readdirSync(nodeModulesPath)
        .filter(name => !name.startsWith('.'))
        .slice(0, 20); // First 20 packages
      packages.forEach(pkg => console.log(`  - ${pkg}`));
      console.log(`  ... (showing first 20 of many packages)`);
    } catch (e) {
      console.error('Could not list node_modules:', e);
    }
  }
} else {
  console.error('✗ node_modules directory NOT FOUND!');
}

console.log('========================================');
console.log('Starting Next.js server...');
console.log('========================================');

// Start Next.js server
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

console.log(`Initializing Next.js (dev: ${dev})...`);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    console.log('Next.js prepared successfully');
    
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error handling request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, (err) => {
      if (err) {
        console.error('Failed to start server:', err);
        throw err;
      }
      console.log('========================================');
      console.log(`✓ Server ready on http://${hostname}:${port}`);
      console.log('========================================');
    });
  })
  .catch((err) => {
    console.error('========================================');
    console.error('✗ FATAL: Failed to start Next.js');
    console.error('========================================');
    console.error(err);
    process.exit(1);
  });
