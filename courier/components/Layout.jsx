import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className='layout-dashboard'>
      <Header />
      <Sidebar />
      <main className='main-content'>{children}</main>
      {/* <Footer /> */}
    </div>
  )
}
