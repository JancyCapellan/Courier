import React from 'react'

function Header() {
  return (
    <header className='header'>
      <section className='header-user-info'>
        {/* <span>
          Welcome {name}! <b>Role: {role}</b>
        </span> */}
        <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>Sign out</button>
      </section>
    </header>
  )
}

export default Header
