import Axios from 'axios'

export const postLogin = async (form) => {
  try {
    const loginValues = {
      email: form.loginEmail,
      password: form.password,
    }
    const res = await Axios.post('http://localhost:3000/user/login', loginValues)
    return res
  } catch (err) {
    console.error(err)
  }
}

export const postRegistration = async (form) => {
  try {
    const registerValues = {
      email: form.email,
      firstName: form.first_name,
      middleName: form.middle_name,
      lastName: form.last_name,
      password: form.password,
      role: 'ADMIN',
    }

    delete form.password2
    const res = await Axios.post('http://localhost:3000/user/register', form)
    console.log('REGISTER RES HERE', res)
    return res
  } catch (error) {
    console.log(error)

    return 500
  }
}
