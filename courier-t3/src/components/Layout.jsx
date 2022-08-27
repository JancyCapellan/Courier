import Header from './Header'
import Sidebar from './Sidebar2'

// * TODO: react memo so only main rerenders and not header and sidebar, but not causing any visuale issue right now

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div className='flex flex-row h-screen'>
        <Sidebar />
        <main className='grow w-max'>{children}</main>
      </div>

      {/* <Footer /> */}
    </>
  )
}
