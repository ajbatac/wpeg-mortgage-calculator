import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import api from './src/worker'
import fs from 'fs'
import path from 'path'

const app = new Hono()

// 1. API routes are highest priority
app.route('/api', api)

// 2. Serve static files from the 'dist' directory
app.use('*', serveStatic({ root: './dist' }))

// 3. SPA fallback: for any request that doesn't match a static file, serve index.html
app.get('*', (c) => {
  const indexPath = path.join(process.cwd(), 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, 'utf-8');
    return c.html(html);
  }
  return c.text('Frontend not found. Please run `npm run build`', 404);
})

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running at http://localhost:${info.port}`)
})
