type userResponse = {
  id: number
  name: string
  email: string
  role: string
}

const createTokenUser = (user: any): userResponse => {
  return {
    name: user.name,
    id: user._id,
    email: user.email,
    role: user.role,
  }
}

export default createTokenUser
