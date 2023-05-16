import axios from 'axios'

const useAuthorizationService = () => {
  const _apiBase = 'http://localhost:5000/auth'

  const registration = async (email, password) => {
    try {
      const response = await axios.post(`${_apiBase}/registration`, {
        email,
        password
      })

      alert(response.data.message)

      localStorage.setItem('token', response.data.token)

      return response.data.user
    } catch (e) {
      alert(e.response.data.message)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${_apiBase}/login`, {
        email,
        password
      })

      localStorage.setItem('token', response.data.token)

      return response.data.user
    } catch (e) {
      alert(e.response.data.message)
    }
  }

  const auth = async (email, password) => {
    try {
      const response = await axios.get(`${_apiBase}/auth`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      localStorage.setItem('token', response.data.token)

      return response.data.user
    } catch (e) {
      // alert(e.response.data.message)
      localStorage.removeItem('token')
    }
  }

  return {
    registration,
    login,
    auth
  }
}

export default useAuthorizationService
