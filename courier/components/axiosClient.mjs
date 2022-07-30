import axios from 'axios'
export const backendClient = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
})
