import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { staticPlugin } from '@elysiajs/static'
import UserController from './controllers/Controller_User';
import { performance } from "node:perf_hooks";
const app = new Elysia()

// Request logging with performance timing
app.on('beforeHandle', ( { set}) => {
  set.headers['X-Request-Timestamp'] = performance.now().toString()
}).on('afterHandle', ( { request, set}) => {
  const time = Math.round((performance.now() - parseFloat(set.headers['X-Request-Timestamp'])) * 1000) / 1000
  console.log(`${time > 100 ? '⚠️' : '✅'} ${request.method} ${request.url} ${time}ms`)
})

// Swagger documentation
app.use(swagger({
  path: '/api/v1/docs',
  exclude: [
    '/',
    '/api/v1/docs',
    '/api/v1/docs/json'
  ],
  documentation: {
    info: {
      title: 'Web API',
      description: 'Web API Documentation',
      version: '1.0.0'
    }
  }
}));

// Error handling
app.onError(({ code, error }) => {
  console.log(`Error ${code}: ${error}`)
  return new Response(error.toString())
})

// Set static folder path to /public but serve it at /
app.use(staticPlugin({prefix: '/'}))

// Redirect root domain to index.html
app.get('/', ({ set }) => {
  set.redirect = '/index.html'
})

/* API Controllers */
const apicontrollers = [
  new UserController()
];

// Register API Controllers
apicontrollers.forEach(x => {
  app.get(x.path, x.getAllUsers)
  app.get(x.path + '/id/:id', x.getUserByID as any)
  app.post(x.path, x.createUser as any)
  app.delete(x.path + '/id/:id', x.deleteUser as any)
});

app.listen(process.env.PORT || 80)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)