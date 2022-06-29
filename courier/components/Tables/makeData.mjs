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

// console.log('makeData', makeCustomerData(3))
