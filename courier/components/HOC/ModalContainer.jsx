import React from 'react'

//show is the state of the display t/f
//handleclose is the toggle/close fn for the modal
const ModalContainer = ({ show, handleClose, children }) => {
  const showHideClassName = show ? 'd-block' : 'd-none'
  return (
    show && (
      <div
        className='modal-backdrop'
        onClick={() => {
          // close modal when outside of modal is clicked
          handleClose()
        }}
      >
        <div className={showHideClassName}>
          <div
            className='modal-container'
            onClick={(e) => {
              // do not close modal if anything inside modal content is clicked
              e.stopPropagation()
            }}
          >
            {children}
            <button className='modal-close' onClick={handleClose}>
              close
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default ModalContainer
