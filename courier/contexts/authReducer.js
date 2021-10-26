const authReducer = (state, action) => {
  // console.log('AUTH CONTEXT action', action)
  switch (action.type) {
    case 'LOGIN':
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

    case 'REGISTER':
      break

    case 'LOADING':
      return { ...state, loading: true }

    default:
      throw new Error('No matching action Type')
  }
}

export default authReducer
