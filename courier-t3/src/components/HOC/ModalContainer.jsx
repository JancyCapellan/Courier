import React from 'react'
import { useEffect } from 'react'

//show is the state of the display t/f
//handleclose is the toggle/close fn for the modal
const ModalContainer = ({ show, handleClose, children }) => {
  const showHideClassName = show ? 'd-block' : 'd-none'

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (show) {
        // console.log('User pressed: ', event.key)

        if (event.key === 'Escape') {
          event.preventDefault()

          // 👇️ your logic here
          handleClose()
        }
      }
    }

    document.addEventListener('keydown', keyDownHandler)

    // 👇️ clean up event listener
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [show])
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
