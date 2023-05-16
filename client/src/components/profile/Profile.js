import { useNavigate } from 'react-router-dom'

const Profile = ({ userLoggedIn }) => {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')

    navigate(-1)

    userLoggedIn({})
  }

  return (
    <div onClick={() => logout()}>ВИЙТИ</div>
  )
}

export default Profile
