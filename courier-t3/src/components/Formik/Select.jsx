import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from './TextError'

// use react memo for optimaztion
function Select(props) {
  const { label, name, options, ...rest } = props
  // console.log('select field option', options)
  return (
    <div className='form-control'>
      <label htmlFor={name}>{label}</label>
      <Field as='select' id={name} name={name} {...rest}>
        {options.map((option) => {
          // console.log('select field option', option)
          return (
            <option
              key={option.key || option.type}
              value={option.value || option.id}
            >
              {option.type || option.key}
            </option>
          )
        })}
      </Field>
      <ErrorMessage component={TextError} name={name} />
    </div>
  )
}

export default Select
