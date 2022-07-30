import Axios from 'axios'
import { backendClient } from '../components/axiosClient.mjs'

export const postLogin = async (form) => {
  try {
    const loginValues = {
      email: form.loginEmail,
      password: form.password,
    }
    let response
    await backendClient
      .post('user/login', loginValues)
      .then((res) => {
        response = res
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data)
          console.log(error.response.status)
          // console.log(error.response.headers)
          response = error.response
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        console.log(error.config)
      })
    return response
  } catch (err) {
    console.error(err)
  }
}

export const getLoggedInUser = async (jwt) => {
  try {
    // console.log('jwt', jwt)
    const res = await backendClient.get('user/loggedInUser', {
      headers: {
        Authorization: 'Bearer ' + jwt,
      },
    })
    return res
  } catch (err) {
    console.error(err)
  }
}

export const postRegistration = async (form) => {
  try {
    // const registerValues = {
    //   email: form.email,
    //   firstName: form.first_name,
    //   middleName: form.middle_name,
    //   lastName: form.last_name,
    //   password: form.password,
    //   role: 'ADMIN',
    // }

    delete form.password2
    const res = await backendClient.post('user/register', form)
    console.log('REGISTER RES HERE', res)
    return res
  } catch (error) {
    console.log(error)

    return 500
  }
}
