// just for development testing

import namor from 'namor'
import { faker } from '@faker-js/faker'

const range = (len) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  const statusChance = Math.random()
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status: statusChance > 0.66 ? 'relationship' : statusChance > 0.33 ? 'complicated' : 'single',
  }
}

const newCustomer = () => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  return {
    firstName: firstName,
    middleName: faker.name.middleName(),
    lastName: lastName,
    email: faker.internet.email(firstName, lastName, 'email.com'),
    password: '123',
    role: 'CUSTOMER',
  }
}

export function makeCustomerData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map((d) => {
      return {
        ...newCustomer(),
        // subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}

const newOrder = () => {
  return {
    cart: [
      {
        name: ' Box of Clothes',
        price: 85,
        amount: 3,
        productsId: 1,
      },
    ],
    total_price: 255,
    amount_items: 3,
    form: {
      shipper: {
        userId: 'cl506emsh00059guy28cion51',
        firstName: 'Schuyler',
        lastName: 'Mosciski',
        shippedFrom: {
          address: '314 East 100st apt 6f',
          address2: '',
          address3: '',
          city: 'New York City',
          state: 'NY',
          postalCode: 10029,
          country: 'USA',
          cellphone: '123213123123',
          telephone: '123123123',
          default: false,
        },
      },
      reciever: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        shippedTo: {
          address: faker.address.streetAddress(),
          address2: '',
          address3: '',
          city: faker.address.city(),
          state: faker.address.state(),
          postalCode: 10029,
          country: 'USA',
          cellphone: faker.phone.number('###-###-####'),
          telephone: faker.phone.number('###-###-####'),
          recipient: true,
        },
      },
    },
    paymentType: 'CASH',
  }
}

export function makeOrder(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map((d) => {
      return {
        ...newOrder(),
        // subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}

function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map((d) => {
      return {
        ...newCustomer(),
        // subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}

// console.log('makeData', makeOrder(3))
