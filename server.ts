import { serve } from '@hono/node-server'
import app from './src/worker'

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`API server is running at http://localhost:${info.port}`)
})
