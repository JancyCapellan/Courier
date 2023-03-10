import * as trpc from '@trpc/server'
import { createRouter } from './context'
import { userRole } from 'types/next-auth'

/**
 * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
 */

// all roles, just have to be logged in
export function createProtectedRouter() {
  return createRouter().middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new trpc.TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `session` is non-nullable to downstream resolvers
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })
}

//TODO: Make router for admin and office staff only routes
export function createProtectedStaffRouter() {
  return createRouter().middleware(({ ctx, next }) => {
    if (
      !ctx.session ||
      !ctx.session.user ||
      ctx.session.user.role !== 'ADMIN' ||
      'STAFF'
    ) {
      throw new trpc.TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `session` is non-nullable to downstream resolvers
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })
}

//! add roles check routers
export function dynamicCreateProtectedRouter(role: userRole) {
  return createRouter().middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user || ctx.session.user.role !== role) {
      throw new trpc.TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
      ctx: {
        ...ctx,
        // infers that `session` is non-nullable to downstream resolvers
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })
}
