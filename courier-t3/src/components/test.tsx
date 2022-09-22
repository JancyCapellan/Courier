const obj = { counter: 0 }
if (1) {
  obj.counter = 1
}

enum staffTypes {
  admin = 'admin',
  staff = 'staff',
  driver = 'driver',
}
type staffCountByEnum = Record<staffTypes, number>

const testComponent = () => {
  return <></>
}

//Record Advanced usage
type seniorRole = 'manager'
type technicalRole = 'developer'
const benefits: Partial<
  Record<seniorRole, 'Free Parking'> & Record<technicalRole, 'Free Coffee'>
> = {}
benefits.manager = 'Free Parking'
// benefits.developer = 'Free Parking'  // will not work

// Enums

//runtime
enum E {
  X,
  Y,
  Z,
}

function f(obj: { X: number }) {
  return obj.X
}

// Works, since 'E' has a property named 'X' which is a number.
f(E)

//Enums Compile Time
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

/**
 * This is equivalent to:
 * type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type LogLevelStrings = keyof typeof LogLevel

const MyArrayComponent = () => Array(5).fill(<div />) as any as JSX.Element
export const name = 'test'

interface people extends Record<string, unknown> {
  user?: {
    name?: string
  }
}
