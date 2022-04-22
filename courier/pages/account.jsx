// import { useAuth } from '../contexts/authContext'
import Sidebar from '../components/Sidebar'
import router from 'next/router'
import ReloadButton from '../components/ReloadButton'
import { useSession } from 'next-auth/react'
// accout information, place to change information, recent orders, settings
// change payment types, add addresses, change phone numbers, send messages

const AccountInfo = () => {
  // const { firstName, email, lastName } = useAuth()
  const { data: session, status } = useSession()
  console.log(session)

  let show = false
  if (status === 'authenticated') {
    show = true
    const { firstName, lastName, role, email, name } = session.user
    return (
      <Sidebar>
        <div className='accountPage'>
          {show ? (
            <section className='accInfoPanel'>
              <h1> Account Information</h1>
              <table className='accInfoTable'>
                <thead>
                  <tr>
                    <th>Full Name:</th>
                    <td> {name}</td>
                  </tr>
                  <tr>
                    <th>Email: </th>
                    <td>{email}</td>
                  </tr>
                  <tr>
                    <th>Role: </th>
                    <td>{role}</td>
                  </tr>
                  <tr>
                    <th>Address: </th>
                    <td>123 Test st ave, ny, ny, 10087</td>
                  </tr>
                </thead>
              </table>
              <br />
            </section>
          ) : (
            <></>
          )}
        </div>
        <ReloadButton />
      </Sidebar>
    )
  }
  // const { firstName, lastName } = session.userInfo

  //use effect to get user info from database
  return (
    <Sidebar>
      <div className='accountPage'>
        {show ? (
          <section className='accInfoPanel'>
            <h1> Account Information</h1>
            <table className='accInfoTable'>
              <thead>
                <tr>
                  <th>Full Name:</th>
                  {/* <td> {name}</td> */}
                </tr>
                <tr>
                  <th>Email: </th>
                  {/* <td>{email}</td> */}
                </tr>
                <tr>
                  <th>Role: </th>
                  {/* <td>{role}</td> */}
                </tr>
                <tr>
                  <th>Address: </th>
                  <td>123 Test st ave, ny, ny, 10087</td>
                </tr>
              </thead>
            </table>
            <br />
          </section>
        ) : (
          <></>
        )}
      </div>
      <ReloadButton />
    </Sidebar>
  )
}

export default AccountInfo
