import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import worker from './src/worker'

const app = new Hono()

app.route('/api', worker)

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`API server is running at http://localhost:${info.port}`)
})
