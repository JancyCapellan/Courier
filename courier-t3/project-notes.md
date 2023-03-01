# GOALs:

1. app/website to handle day to day opertaions
2. app handles multiple clients, refined features and capabilites
3. app opens up third phase, companies have open orders for pickups like other popular apps but this is for delivery. can put order needed to be returned to warehouse to prepare for shipping overseas. random people that are signed up to work get paid a fee for bringing box, effectively removing the need for inhouse drivers and going to contract based work for pickuing up packages, filling containers, etc.

### brainstroming

multi tenat Saas app, frontend is the same for all tenants and so should the backend, but each tenant gets access to their own schema.

create an admin tool to create new tenants and add database schema to database

mikroOrm has easy multi schema

Problem: i hava a schema that will be used for all the tenants, but i want them to be serpeated for isolation benefits and if a schema needs to be customized in the future. prisma is currently in the works of making this happen. currently, i have no way of changing the database that is being queried based on the tenantId being used.

If a customer is part of multiple tenants...probably treat them as only a customer of that tenant. meaning that each tenant may need its own url login page.

customer must choose what tenat they want to log into, so backend follows the same logic as a tenant logging in to their specific schema. this way the front end is one application, the application could be made to have a single site and database per tenenat and use sub-urls lcs.couriersDashboard.com for example

this might not work if every company want a different something different than the core, so their customers would have to go to another place but that defeats the purpose of what we are trying to accomplish.

### TOOLING

creating a tool baed on prisma-multi-tenaant and the idea of creating prisma client based on a new datasource url. this can allow the client to switch to another schema. every schema is named after the tenant(company/client) that owns the data. when a new tenant account is made, a database is created copying the same prisma schema in use (differnet schema probably means differnet front end per tenant, more advanced and costly use case that hopefully wont be needed with the simplistic nature of the courier shipping industry). the first database schema can be made with prisma migrate but no native way currently to migrate with mutliple schemas. so instead the main database sql file from the migration will be used to make other sql schemas, in theory prisma would be connecting to a different schema that follows all the same structure that prisma code gen created. this is the start of the developer panel for the app that in the future i hope to havve analysis and stats about the full stack of the app available for easy tracking.

### TESTING

playwright for e2e and integrations, can connect to jest
jest + React testing Library (RTL) for unit testing
storybook is a frontend workshop for building UI components and pages in isolation

**Tests** folder is for jest unit test
e2e folder is for playwright tests, may move this structure around.

playwright intergration trpc test: https://github.com/trpc/examples-next-prisma-starter/blob/main/src/server/routers/post.test.ts
