import React, { useContext, useReducer, useEffect } from 'react'
import authReducer from './authReducer'
import { getLoggedInUser, postLogin, postRegistration } from './authActions'
// import History from '../components/History'
// import Axios from 'axios'
// import { useHistory } from 'react-router'
import Router from 'next/router'
import { routes } from '../components/SidebarData'

const initialState = {
  email: '',
  firstName: '',
  middleName: '',
  lastName: '',
  role: '',
  id: '',
  isAuthenticated: false,
  JWT: '',
  loading: false,
}

const AuthContext = React.createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  // const history = useHistory()

  // useEffect(() => {
  //   const loggedInUser = localStorage.getItem('cu')
  //   console.log(loggedInUser)
  //   if (loggedInUser) {
  //     const foundUser = JSON.parse(loggedInUser)
  // dispatch({ type: 'LOGIN', payload: foundUser })
  //   }
  // }, [])

  useEffect(() => {
    console.log(state)
  }, [state])

  const login = async (form) => {
    const res = await postLogin(form)
    switch (res.status) {
      case 200:
        console.log('ACCESS TOKEN', res.data.accessToken)
        dispatch({ type: 'LOGIN_JWT', payload: res.data.accessToken })

        const user = await getLoggedInUser(res.data.accessToken)
        console.log('user', user.data)
        dispatch({ type: 'LOGIN_USER', payload: user.data })

        Router.push(routes.account.path)
        break

      case 204:
        alert('INCORRET USERNAME OR PASSWORD')
        break

      default:
        throw new Error('status code not handled')
    }
  }

  const register = async (form) => {
    console.log('Registeration form', form)
    const res = await postRegistration(form)
    console.log('REGISTRATION', res)
    // a hack, res is just returning 500 from try/catch
    switch (res.status || res) {
      case 200:
        alert('registration completed')
        // if after registrtation, i want to autologin user, dispatch would have run with these forms values
        return true

      case 204:
        alert('ERROR WHILE COMPLETING REGISTRATION')
        return false

      case 500:
        alert('ERROR WHILE REGISTRATING')
        return false

      default:
        throw new Error('status code not 200 or 204')
      // dispatch({ type: 'REGISTER', payload: form })
    }
  }

  const getUserAccInfo = () => {}

  const value = {
    ...state,
    login,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
