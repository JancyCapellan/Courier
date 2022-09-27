import Header from './Header'
import Sidebar from './Sidebar2'

// * TODO: react memo so only main rerenders and not header and sidebar, but not causing any visuale issue right now

export default function Layout({ children }) {
  return (
    <div className='flex h-screen'>
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header />
        <div className='flex h-full'>
          <Sidebar />
          <main className='flex flex-col w-full bg-white overflow-x-hidden overflow-y-auto p-6'>
            {children}
          </main>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  )
}
