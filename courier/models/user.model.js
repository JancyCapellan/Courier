// const res = require('express/lib/response')
const sql = require('./db.js')

// object constructor
// TODO: add hidden field in forms for role
const User = function (user) {
  this.email = user.email
  this.first_name = user.firstName
  this.middle_name = user.middleName
  this.last_name = user.lastName
  this.password = user.password
  this.role = 'CUST'
}

User.register = (newUser, result) => {
  // let stmt = 'INSERT INTO user_details SET ? WHERE NOT EXISTS(SELECT 1 FROM user_details WHERE email ?'
  sql.query('INSERT INTO users2 SET ?', newUser, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(err, null)
      return
    } else return result(null, 'Registered')
  })
}

// Result is function that is  passed in controller to send respond status back to api caller
User.login = (userEmail, userPassword, result) => {
  let DATETIME = new Date().toISOString().slice(0, 19).replace('T', ' ')
  let stmt = `SELECT * FROM users WHERE email = "${userEmail}" and password = "${userPassword}";`

  let update = `UPDATE users SET last_login = "${DATETIME}" where email= "${userEmail}";`
  sql.query(stmt, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(err, null)
      return
    }

    if (res.length === 1) {
      console.log('found User: ', res[0])
      result(null, res[0])

      sql.query(update, (err, res) => {
        if (err) {
          console.log('error: ', err)
          result(err, null)
          return
        }
      })
      return
    }

    if (res.length === 0) {
      result(null, 0)
    }
  })
}

User.submitOrder = (userId, cart, senderAddress, recieverAddress, result) => {
  let stmt = `INSERT INTO orders (users_id) VALUES (${userId})`

  sql.query(stmt, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(err, null)
      return
    }
    let cartArray = []
    let orderId = res.insertId
    cart.map((item) => cartArray.push([item.id, item.amount, orderId, userId]))
    // console.log('cartArray', cartArray)

    let testStmt = `INSERT INTO order_items (products_ID, quantity, order_ID, users_ID) VALUES ? `

    // console.log('TEST', testStmt)
    // 6 is order id, 1 is userID

    // adds cart items to order_item tables
    sql.query(testStmt, [cartArray], (err, res) => {
      if (err) {
        console.log('error: ', err)
        result(err, null)
        return
      }
      // console.log('TEST ORDER ITEMS RESULT', res)
    })

    senderAddress.unshift(orderId)
    recieverAddress.unshift(orderId)

    // adds addys for orders to orders_addressess table
    let addresseStmt = `INSERT INTO order_addressess (order_id, first_name, last_name, company_name, address, city , state, postal_code, country, type, cellphone, telephone) VALUES ?`
    sql.query(addressStmt, [[senderAddress, recieverAddress]], (err, res) => {
      if (err) {
        console.log('error: ', err)
        result(err, null)
        return
      }
      console.log('TEST ADDRESS RESULT', res)
      result(null, res)
    })
    let addressesInsertStmt = `INSERT INTO order_addressess (order_id, first_name, last_name, company_name, address, city , state, postal_code, country, type, cellphone, telephone) VALUES ?`
    sql.query(addressesInsertStmt, [[senderAddress, recieverAddress]], (err, res) => {
      if (err) {
        console.log('error: ', err)
        result(err, null)
        return
      }
      console.log('TEST ADDRESS RESULT', res)
      result(null, res)
    })
  })
}
User.submitOrder2 = (userId, cart, addresses, total_price, amount_items, result) => {
  // console.log('DATA', userId, cart, addresses, total_price, amount_items)
  sql.getConnection((err, sql) => {
    if (err) {
      console.log('pool connection error')
      throw err
    }

    sql.beginTransaction((err) => {
      if (err) {
        throw err
      }

      //create new order, mysql set auto order Id
      var recieverFN = addresses.reciever.FirstName
      var recieverLN = addresses.reciever.LastName
      console.log(recieverFN, recieverLN)

      let insertOrderID = `INSERT INTO orders (user_id, reciever_first_name, reciever_last_name, total_items, total_price) VALUES (? ,  ? ,  ? ,  ? , ?)`

      sql.query(
        insertOrderID,
        [userId, recieverFN, recieverLN, amount_items, total_price],
        (err, res) => {
          if (err) {
            return sql.rollback(() => {
              console.log('error: ', err)
              // result(err, null)
              // throw err
            })
          }

          // ! order ID
          let orderId = res.insertId

          let insertOrderItems = `INSERT INTO order_items (product_id, quantity, order_id) VALUES ? `
          let cartArray = []
          cart.map((item) => cartArray.push([item.id, item.amount, orderId]))

          sql.query(insertOrderItems, [cartArray], (err, res) => {
            if (err) {
              return sql.rollback(() => {
                console.log('error: ', err)
                result(err, null)
                throw err
              })
            }
            const { shipper, reciever } = addresses
            let {
              address_id,
              id,
              FirstName,
              LastName,
              Address,
              Address2,
              Address3,
              City,
              State,
              PostalCode,
              Country,
              Cellphone,
              Telephone,
            } = shipper

            // if address from form was manually inputted
            console.log('address_id', shipper.address_id)
            if (shipper.address_id === -1) {
              console.log('SELECTED ADDRESS LOGIC')
              let insertShipperOrderAddresses = `INSERT INTO addresses(users_id,address,address2,address3,city,\
state,postal_code,country,cellphone,telephone) VALUES (?,?,?,?,?,?,?,?,?,?)`
              sql.query(
                insertShipperOrderAddresses,
                [
                  id,
                  Address,
                  Address2,
                  Address3,
                  City,
                  State,
                  PostalCode,
                  Country,
                  Cellphone,
                  Telephone,
                ],
                (err, res) => {
                  if (err) {
                    return sql.rollback(() => {
                      console.log('error: ', err)
                      result(err, null)
                      throw err
                    })
                  }

                  let shipped_from = res.insertId
                  // if successful
                  console.log('IOA', res)
                  // result(null, res)

                  // should re-init their previous values from shipper
                  let {
                    Address,
                    Address2,
                    Address3,
                    City,
                    State,
                    PostalCode,
                    Country,
                    Cellphone,
                    Telephone,
                    recipient,
                  } = reciever

                  let insertRecieverOrderAddresses = `INSERT INTO addresses(users_id,address,address2,address3,city,\
state,postal_code,country,cellphone,telephone,recipient) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
                  sql.query(
                    insertRecieverOrderAddresses,
                    [
                      id,
                      Address,
                      Address2,
                      Address3,
                      City,
                      State,
                      PostalCode,
                      Country,
                      Cellphone,
                      Telephone,
                      recipient,
                    ],
                    (err, res) => {
                      if (err) {
                        return sql.rollback(() => {
                          console.log('error: ', err)
                          result(err, null)
                          throw err
                        })
                      }

                      let shipped_to = res.insertId
                      console.log('IROA', res)
                      // result(null, res)

                      let insertOrderAddresses = `INSERT INTO order_addresses (shipped_from, shipped_to, order_id) VALUES (?,?,?)`
                      sql.query(
                        insertOrderAddresses,
                        [shipped_from, shipped_to, orderId],
                        (err, res) => {
                          if (err) {
                            return sql.rollback(() => {
                              console.log('error: ', err)
                              result(err, null)
                              throw err
                            })
                          }

                          sql.commit(function (err) {
                            if (err) {
                              return sql.rollback(function () {
                                throw err
                              })
                            }
                            console.log('order successfuly submitted!')
                          })
                        }
                      )
                    }
                  )
                }
              )
            }
            if (shipper.address_id !== -1) {
              // if shipper address was not manually inputted

              let {
                Address,
                Address2,
                Address3,
                City,
                State,
                PostalCode,
                Country,
                Cellphone,
                Telephone,
                recipient,
              } = reciever

              let insertRecieverOrderAddresses = `INSERT INTO addresses(users_id,address,address2,address3,city,\
state,postal_code,country,cellphone,telephone,recipient) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
              sql.query(
                insertRecieverOrderAddresses,
                [
                  id,
                  Address,
                  Address2,
                  Address3,
                  City,
                  State,
                  PostalCode,
                  Country,
                  Cellphone,
                  Telephone,
                  recipient,
                ],
                (err, res) => {
                  if (err) {
                    return sql.rollback(() => {
                      console.log('error: ', err)
                      result(err, null)
                      throw err
                    })
                  }

                  console.log('IROA', res)
                  result(null, res)

                  let shipped_to = res.insertId
                  let shipped_from = shipper.address_id
                  let insertOrderAddresses = `INSERT INTO order_addresses (shipped_from, shipped_to, order_id) VALUES (?,?,?)`
                  sql.query(
                    insertOrderAddresses,
                    [shipped_from, shipped_to, orderId],
                    (err, res) => {
                      if (err) {
                        return sql.rollback(() => {
                          console.log('error: ', err)
                          result(err, null)
                          throw err
                        })
                      }

                      sql.commit(function (err) {
                        if (err) {
                          return sql.rollback(function () {
                            throw err
                          })
                        }
                        console.log('order successfuly submitted!')
                      })
                    }
                  )
                }
              )
            }
          })
        }
      )
    })
  })
}

User.addItemToProductList = (list, result) => {
  let stmt = `INSERT INTO products (ID, name, price, product_types_ID) VALUES ? `
  sql.query(stmt, [list], (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(err, null)
      return
    }
    result(null, res)
  })
}

User.findAll = (result) => {
  sql.query(`SELECT * FROM users`, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(err, null)
      return
    }

    if (res.length) {
      console.log('found User: ', res[0])
      result(null, res[0])
      return
    }

    // not found User with the id
    result({ kind: 'not_found' }, null)
  })
}

User.findById = (userId, result) => {
  sql.query(`SELECT * FROM customers WHERE customerID = ${userId}`, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(err, null)
      return
    }

    if (res.length) {
      console.log('found User: ', res[0])
      result(null, res[0])
      return
    }

    // not found User with the id
    result({ kind: 'not_found' }, null)
  })
}

// getAll
User.getAllWithSearch = (search, result) => {
  console.log('searchh', search)
  let stmt = `SELECT * FROM users WHERE LOCATE(${search},first_name)>0 or locate(${search}, last_name)>0 or locate(${search},id)>0`
  sql.query(stmt, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    console.log('users: ', res)
    result(null, res)
  })
}

User.updateById = (form, result) => {
  // console.log('form', form)
  let stmt = `UPDATE users SET ? WHERE id = ${form.id}  ;`
  sql.query(stmt, form, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: 'not_found' }, null)
      return
    }

    console.log('updated User: ', { id: form.id, ...form })
    result(null, { id: form.id, ...form })
  })
}

User.remove = (id, result) => {
  sql.query('DELETE FROM users WHERE id = ?', id, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: 'not_found' }, null)
      return
    }

    console.log('deleted User with id: ', id)
    result(null, res)
  })
}

User.removeAll = (result) => {
  sql.query('DELETE FROM users', (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    console.log(`deleted ${res.affectedRows} users`)
    result(null, res)
  })
}

User.getAddresses = (id, result) => {
  sql.query('SELECT * FROM addresses WHERE users_id = ? and recipient = 0', id, (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(null, err)
      return
    }

    console.log(`Retrieved users ${id} addresses`, res)
    result(null, res)
  })
}

User.addAddress = (addressForm, result) => {
  // console.log(address)
  let stmt = `INSERT INTO addresses (users_id, address, address2, address3, city,\
  state, postal_code, country, cellphone, telephone) VALUES ?`
  sql.query(stmt, [[addressForm]], (err, res) => {
    if (err) {
      console.log('error: ', err)
      result(err, null)
      return
    }

    result(null, res)
  })
}

User.updateAddress = (addressId, addressData, result) => {
  const { address, address2, address3, city, state, postal_code, country, cellphone, telephone } =
    addressData
  let stmt = `UPDATE addresses SET address = ?, address2 = ?, address3 = ?,\
  city = ?, state = ?, postal_code = ?, country = ?, cellphone = ?, telephone = ? \
  WHERE address_id = ${addressId};`

  sql.query(
    stmt,
    [address, address2, address3, city, state, postal_code, country, cellphone, telephone],
    (err, res) => {
      if (err) {
        result(err, null)
        return
      }

      result(null, res)
    }
  )
}

User.getAllOrders = (result) => {
  let stmt = `SELECT * FROM user_orders;`

  sql.query(stmt, (err, res) => {
    if (err) {
      result(err, null)
      return
    }

    result(null, res)
  })
}

User.prisma = {
  register: {},
}

module.exports = User
