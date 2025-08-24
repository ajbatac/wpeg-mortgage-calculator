import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import api from './src/worker'

const app = new Hono()

// API routes
app.route('/api', api)

// Static assets (ensure this comes before the SPA fallback)
app.use('/assets/*', serveStatic({ root: './dist' }))

// SPA fallback: serve index.html for any other GET request
app.get('*', serveStatic({ path: './dist/index.html' }))

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running at http://localhost:${info.port}`)
})
