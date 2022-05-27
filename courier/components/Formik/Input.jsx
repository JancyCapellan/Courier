import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from './TextError'

function Input(props) {
  const { label, name, id, ...rest } = props
  return (
    <div className='formik-input-container'>
      <label htmlFor={name}>{label}</label>
      <Field id={name} name={name} {...rest} />
      <ErrorMessage component={TextError} name={name} />
    </div>
  )
}

export default Input

// const TextField = (props: FieldHookConfig<string>) => {
//   const [field] = useField(props);
//   return (
//     <div>
//       {/* no need to pass the name field because Formik will accept
//       that prop internally and pass it to the field variable */}
//       <input {...field} placeholder={props.placeholder} type={props.type} />
//     </div>
//     );
// };
