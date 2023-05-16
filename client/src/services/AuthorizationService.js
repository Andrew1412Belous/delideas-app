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

  const auth = async () => {
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

  const updateFavorites = async (userId, recipeId) => {
    try {
      const response = await axios.patch(`${_apiBase}/update`, {
        id: userId,
        recipeId
      })

      alert(`Бажане оновлено`)

      return response.data
    } catch (e) {
      alert(e.response.data.message)
    }
  }

  const getFavorites = async (userId) => {
    try {
      const response = await axios.get(`${_apiBase}/update?id=${userId}`)

      return response.data
    } catch (e) {

    }
  }

  return {
    registration,
    login,
    auth,
    getFavorites,
    updateFavorites,
  }
}

export default useAuthorizationService
