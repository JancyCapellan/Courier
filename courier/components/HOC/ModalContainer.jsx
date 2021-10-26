import React from 'react'

const ModalContainer = ({ show, handleClose, children }) => {
  const showHideClassName = show ? 'd-block' : 'd-none'
  return (
    <div className={showHideClassName}>
      <div className='modal-container'>
        {children}
        <button className='modal-close' onClick={handleClose}>
          close
        </button>
      </div>
    </div>
  )
}

export default ModalContainer
