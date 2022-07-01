import Header from './Header'
import Sidebar from './Sidebar'

// * TODO: react memo so only main rerenders and not header and sidebar, but not causing any visuale issue right now
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
