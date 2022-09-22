import { publicApiRouter } from './publicApi'
// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'

import { exampleRouter } from './example'
import { userRouter } from './user'
import { customerRouter } from './customers'
import { staffApi } from './staffProtected'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('example.', exampleRouter)
  .merge('user.', userRouter)
  .merge('public.', publicApiRouter)
  .merge('customers.', customerRouter)
  .merge('staff.', staffApi)

// export type definition of API
export type AppRouter = typeof appRouter
