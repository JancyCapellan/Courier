// ! make sure that routes are all unique, that i can use the same route plus params  to get to the same page with same state granted that the user has permission

// * finish order, connect to api submit order with new admin form, test submission
// * new add customer form,new edit customer form with prefilled fields
// TODO: create a favorite list for recipient to help cut down on duplicate addresses
// * create account info page that can be used to edit specified
// * update create order so that admins can select which customer to make a order for. this goes into have selects for choosing customer and anyone they have delivered to before

// ########### Invoices/ pickup manager ####################################

// TODO: create pickup manager that shows all current uncompleted orders and its info/ delvierty info
// TODO: claim manager that can be used to see all drivers and make an necessary changes

// pickups manager - orders, routes
//  will shows orders with tracking/sattust location, update orders, delete orders
// button to choose routes for orders ( eventaully automatic system)

// ** need to create drivers to assing to routes that are assigned orders
// * currently making it so the add user form is dynamic and it can add users depending on the accoutn being used to create it to avoid some hacking schemes since the role currently dictates web security and its a easy to change form value.
// CRUD for products/services that staff can change

// brain storming
// create new empty route tha can be filled with different orders based on their proximity and area code.
// assign orders to those routes manually, or with a system as soon as order is confirmed?
// invoices will allow staff to see relevant data on current orders and past orders

// branch manager will have the routes for that branch/warehouse/ for anything under super admin it will show only that users branch. here you can create routes for packages, edit supplies at warehouse, and anything to do with the management of the branch.

// ####################################################################################

// * also working on checking the registartion logic to nnot use objects because i dont see the benefit in this case.

//creating sessions so the user doesnt have to keep signing in to the same device in a timeframe

// *make registration dynamic but changing form depending on the type: admin, cust, staff, any, etc
// down size similar forms to one. two createcustomer modals should be based on the original registration with more inputs

// create folders to hold polymorphic forms for reuse
// change add customer address form api call and change route/controller to prisma model

// ** create transaction for prisma submit order. change orderForm shape to match. // nested writes are transactions in primsa 2.

// update orders
// table fo drivers
// tables of packages waiting for pickup by branch

// move branch selector to be global for the enitre app, admin will efficetly have multiple versions of each page that just changes the info with the specific branch they are trying to work with

// TODO: get pickup driver options from database, choose user role driver
// TODO: change tables to react-table for more advnaced filtering and inline editing
// TODO: update driverId page under administration to show the drivers pickups routes, supplies, etc
