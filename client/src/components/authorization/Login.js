import Input from '../../utils/input/Input'
import { useState } from 'react'
import useAuthorizationService from '../../services/AuthorizationService'
import { useNavigate } from 'react-router-dom'

import './authorization.scss'
const Login = ({ userLoggedIn }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const { login } = useAuthorizationService()

  const uploadUserInfo = (email, password) => {
    login(email, password)
      .then(userLoggedIn)
      .then(() => navigate(-1))
  }

  return (
    <div className='authorization'>
      <div className="authorization__header">Авторизація</div>
      <Input value={email} setValue={setEmail} type="text" placeholder="Введите email..."/>
      <Input value={password} setValue={setPassword} type="password" placeholder="Введите пароль..."/>
      <button className="authorization__btn" onClick={() => uploadUserInfo(email, password)}>Увійти</button>
    </div>
  )
}

export default Login
