import axios from 'axios'

const useAuthorizationService = () => {
  // const _apiBase = 'http://localhost:5000'
  const _apiBase = 'https://mern-delideas-app-server.vercel.app'

  const registration = async (email, password) => {
    try {
      const response = await axios.post(`${_apiBase}/auth/registration`, {
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
      const response = await axios.post(`${_apiBase}/auth/login`, {
        email,
        password
      })

      console.log(response)

      localStorage.setItem('token', response.data.token)

      return response.data.user
    } catch (e) {
      alert(e.response.data.message)
    }
  }

  const auth = async () => {
    try {
      const response = await axios.get(`${_apiBase}/auth/auth`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      localStorage.setItem('token', response.data.token)

      return response.data.user
    } catch (e) {
      localStorage.removeItem('token')
    }
  }

  const updateFavorites = async (recipeId) => {
    try {
      const response = await axios.patch(`${_apiBase}/auth/update`, {
        recipeId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      alert(response.data.message)

      return response.data.user
    } catch (e) {
      alert(e.response.data.message)
    }
  }

  const getFavorites = async () => {
    try {
      const response = await axios.get(`${_apiBase}/auth/favorites`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      return response.data
    } catch (e) {

    }
  }

  const uploadAvatar = async (file) => {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await axios.post(`${_apiBase}/files/avatar`, formData,
          {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
        )

        return response.data
      } catch (e) {
        console.log(e)
      }
  }

  return {
    registration,
    login,
    auth,
    getFavorites,
    updateFavorites,
    uploadAvatar,
    _apiBase,
  }
}

export default useAuthorizationService
