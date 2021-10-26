const authReducer = (state, action) => {
  // console.log('AUTH CONTEXT action', action)
  switch (action.type) {
    case 'LOGIN':
      let info = action.payload.data
      return {
        ...state,
        firstName: info.first_name,
        middleName: info.middle_name,
        lastName: info.last_name,
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
