// import { useAuth } from '../contexts/authContext'
import Sidebar from '../components/Sidebar'
import router from 'next/router'
import ReloadButton from '../components/ReloadButton'
// import { useSession } from 'next-auth/react'
import { useSession } from '../customHooks/useSession'

// accout information, place to change information, recent orders, settings
// change payment types, add addresses, change phone numbers, send messages

const AccountInfo = () => {
  // const { firstName, email, lastName } = useAuth()
  const [session, loading] = useSession()
  console.log(session)

  let show = false
  if (!loading) {
    show = true
    const { firstName, lastName, role, email, name } = session.user
    return (
      <>
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
      </>
    )
  }
  // const { firstName, lastName } = session.userInfo

  //use effect to get user info from database
  return (
    <>
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
    </>
  )
}

export default AccountInfo

AccountInfo.getLayout = function getLayout(page) {
  return <Sidebar>{page}</Sidebar>
}
