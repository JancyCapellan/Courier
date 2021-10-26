import React, { useState } from 'react'
import { useCart } from '../../contexts/cartContext'
import '../../index.css'
import { useHistory } from 'react-router'

const defaultFormValues = {
  shipperFirstName: '',
  shipperLastName: '',
  shipperAddress: '',
  shipperCity: '',
  shipperState: '',
  shipperPostalCode: '',
  shipperUsaPhone: '',
  recieverFirstName: '',
  recieverLastName: '',
  recieverAddress: '',
  recieverCity: '',
  recieverState: '',
  recieverPostalCode: '',
  recieverPhone: '',
}

const SenderForm = ({ handlePage }) => {
  const [formData, setFormData] = useState(defaultFormValues)
  const [submitting, setSubmitting] = useState(false)
  const { addForm } = useCart()
  const history = useHistory()

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    //order matters here, setSubmitting must come first to avoid dismounting
    // moved setsubmitting to middle as logic would dictate, so far no problems
    // console.log(formData)
    addForm(formData)
    setSubmitting(false)
    // handlePage('NEXT')
    history.push('/checkout')
  }

  const handleChange = (e) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    setFormData({ ...formData, [name]: value })
  }
  return (
    <section id='deliveryInformation'>
      <h2> Delviery Information</h2>
      <form className='contactForm' onSubmit={handleSubmit}>
        {/* {submitting && <div>Submtting Form...</div>} */}
        <div className='senderForm'>
          <h3>Sender</h3>
          <fieldset>
            <label>
              <p>First Name</p>
              <input name='shipperFirstName' onChange={handleChange} />
            </label>
            <label>
              <p>Last Name</p>
              <input name='shipperLastName' onChange={handleChange} />
            </label>
            <label>
              <p>Address</p>
              <input name='shipperAddress' onChange={handleChange} />
            </label>
            <label>
              <p>City</p>
              <input name='shipperCity' onChange={handleChange} />
            </label>
            <label>
              <p>State</p>
              <input name='shipperState' onChange={handleChange} />
            </label>
            <label>
              <p>Postal Code</p>
              <input name='shipperPostalCode' onChange={handleChange} />
            </label>
            <label>
              <p>Phone Number</p>
              <input name='shipperUsaPhone' onChange={handleChange} />
            </label>
          </fieldset>
        </div>
        <div className='recieverForm'>
          <h3>Reciever</h3>
          <fieldset>
            <label>
              <p>First Name</p>
              <input name='recieverFirstName' onChange={handleChange} />
            </label>
            <label>
              <p>Last Name</p>
              <input name='recieverLastName' onChange={handleChange} />
            </label>
            <label>
              <p>Address</p>
              <input name='recieverAddress' onChange={handleChange} />
            </label>
            <label>
              <p>City</p>
              <input name='recieverCity' onChange={handleChange} />
            </label>
            <label>
              <p>State</p>
              <input name='recieverState' onChange={handleChange} />
            </label>
            <label>
              <p>Postal Code</p>
              <input name='recieverPostalCode' onChange={handleChange} />
            </label>
            <label>
              <p>Phone Number</p>
              <input name='recieverPhone' onChange={handleChange} />
            </label>
          </fieldset>
        </div>
      </form>
      <button type='submit' form='contactForm' onClick={handleSubmit} disabled={submitting}>
        continue
      </button>
    </section>
  )
}

export default SenderForm
