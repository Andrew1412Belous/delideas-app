import Input from '../../utils/input/Input'
import { useState } from 'react'
import useAuthorizationService from '../../services/AuthorizationService'
import { useNavigate } from 'react-router-dom'

import './authorization.scss'

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
      <div className="authorization__header">Реєстрація</div>
      <Input value={email} setValue={setEmail} type="text" placeholder="Введіть email..."/>
      <Input value={password} setValue={setPassword} type="password" placeholder="Введіть пароль..."/>
      <button className="authorization__btn" onClick={() => uploadUserInfo(email, password)}>Зареєструватися</button>
    </div>
  )
}

export default Registration
