import Input from '../../utils/input/Input'
import { useState } from 'react'

import './authorization.scss'
import useAuthorizationService from '../../services/AuthorizationService'
import { useNavigate } from 'react-router-dom'

const Registration = ({ userLoggedIn }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const { registration } = useAuthorizationService()

  const uploadUserInfo = (email, password) => {
    registration(email, password)
      .then(userLoggedIn)
      .then(() => navigate(-1))
  }

  return (
    <div className='authorization'>
      <div className="authorization__header">Регистрация</div>
      <Input value={email} setValue={setEmail} type="text" placeholder="Введите email..."/>
      <Input value={password} setValue={setPassword} type="password" placeholder="Введите пароль..."/>
      <button className="authorization__btn" onClick={() => uploadUserInfo(email, password)}>Зарегистрироваться</button>
    </div>
  )
}

export default Registration
