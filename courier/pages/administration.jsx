import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import CreateCustomerModal from '../components/Customers/CreateCustomerModal'
import RegistrationForm from '../components/RegistrationForm.jsx'
import ModalContainer from '../components/HOC/ModalContainer'

const Administration = () => {
  const [branch, setBranch] = useState()
  const [showModal, setShowModal] = useState(false)

  const handleModalClose = () => setShowModal(false)

  const bulkAddItems = () => {
    let itemArray = []
    let itemListJSON = action.payload
    // console.log(state, order)

    itemListJSON.map((item) => itemArray.push([item.id, item.name, item.price, item.type]))
    console.log('cartArray', itemArray)

    Axios.post('http://localhost:3000/user/bulkAdd', itemArray)
      .then((res) => {
        console.log('res:', res)

        if (res.status === 200) {
          console.log('completed')
        }
      })
      .catch((error) => {
        console.log('Bulk Items', error)
        // alert('Error')
      })
  }

  const BranchOfficeData = (branch) => {
    return (
      <section>
        <section></section>
      </section>
    )
  }
  return (
    <Sidebar>
      <section>
        <h1>Staff Manager</h1>
        <ModalContainer show={showModal} handleClose={handleModalClose}>
          <RegistrationForm staff={true} />
        </ModalContainer>

        <button className='btn add-customer-btn' onClick={() => setShowModal(true)}>
          Create Staff
        </button>
      </section>
    </Sidebar>
  )
}

export default Administration
