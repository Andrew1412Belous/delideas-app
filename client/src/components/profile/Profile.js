import { useNavigate } from 'react-router-dom'

import './profile.scss'
import AppBanner from '../appBanner/AppBanner'
import useAuthorizationService from '../../services/AuthorizationService'
import { useEffect, useState } from 'react'

import avatarLogo from '../../assets/avatar.svg'

const Profile = ({ userLoggedIn, currentUser, setCurrentUser }) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([])

  const { getFavorites, uploadAvatar, _apiBase } = useAuthorizationService()

  const navigate = useNavigate()

  const avatar = currentUser.avatar
    ? `${_apiBase}/${currentUser.avatar}`
    : avatarLogo

  useEffect(() => {
    updateFavoriteRecipes()
  }, [])

  const changeHandler = (e) => {
    const file = e.target.files[0]
    // console.log(file)
    uploadAvatar(file)
      .then(response => {
        console.log(response)

        setCurrentUser(response)
      })
  }

  const updateFavoriteRecipes = () => {
    getFavorites()
      .then(setFavoriteRecipes)
  }

  const renderRecipes = (items) => {
    if (items.length) {
      const recipes = items.map((item, index) => {
        const recipeName = item.title.length > 30
          ? `${item.title.slice(0, 30)}...`
          : item.title

        return (
          <li className="char__item"
              tabIndex={0}
              key={index}
              onClick={() => navigate(`/recipes/${recipes[index].id}`)}
              onKeyPress={(e) => {
                if (e.key === ' ' || e.key === "Enter") {
                  navigate(`/recipes/${recipes[index].id}`)
                }
              }}>
            <img src={item.image} alt={item.title} style={{objectFit: 'cover'}}/>
            <div className="char__name">{recipeName}</div>
          </li>
        )
      })

      return (
        <ul className="char__grid">
          {recipes}
        </ul>
      )
    } else {
      return (
        <div className="char__comics">Немає рецептів в бажаних</div>
      )
    }
  }

  const logout = () => {
    localStorage.removeItem('token')

    navigate(-1)

    userLoggedIn({})
  }

  return (
    <>
      <AppBanner/>
      <div className="profile">
        <img src={avatar} alt='user avatar' className="single-comic__char-img"/>
        <div className="profile-info">
          <h2 className="single-comic__name">{`email: ${currentUser.email}`}</h2>
        </div>
        <div className="char__btns">
          <div className="button button__main single-comic-link"
               onClick={() => logout()}>
            <div className="inner">
              Вийти з аккаунта
            </div>
          </div>
          <input accept="image/*" onChange={e => changeHandler(e)} type="file" placeholder="Загрузить аватар"/>
        </div>
        {renderRecipes(favoriteRecipes)}
        {/*<ul className="comics__grid">*/}

        {/*</ul>*/}
      </div>
    </>
  )
}

export default Profile
