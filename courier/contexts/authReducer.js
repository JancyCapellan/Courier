const authReducer = (state, action) => {
  // console.log('AUTH CONTEXT action', action)
  switch (action.type) {
    case 'LOGIN_USER':
      let info = action.payload.data
      return {
        ...state,
        firstName: info.firstName,
        middleName: info.middleName,
        lastName: info.lastName,
        email: info.email,
        role: info.role,
        id: info.id,
      }

    case 'LOGIN_JWT':
      let jwt = action.payload
      return {
        ...state,
        JWT: jwt,
      }

    case 'LOADING':
      return { ...state, loading: true }

    default:
      throw new Error('No matching action Type')
  }
}

export default authReducer
