import { useNavigate } from 'react-router-dom'
import AppBanner from '../../appBanner/AppBanner'
import useAuthorizationService from '../../../services/AuthorizationService'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

// import avatarLogo from '../../../assets/avatar.svg'

import './profile.scss'

const Profile = ({ userLoggedIn, currentUser, setCurrentUser }) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([])

  const {
    getFavorites,
    // uploadAvatar,
    // _apiBase
  } = useAuthorizationService()

  const navigate = useNavigate()

  // const avatar = currentUser.avatar
  //   ? `${_apiBase}/${currentUser.avatar}`
  //   : avatarLogo

  useEffect(() => {
    updateFavoriteRecipes()
  }, [])

  // const changeHandler = (e) => {
  //   const file = e.target.files[0]
  //
  //   if (!file.type.indexOf('image')) {
  //     if (file.size > 2097152) {
  //       alert('Зображення завелике\nМаксимальний розмір 2MB')
  //     } else {
  //       uploadAvatar(file)
  //         .then(response => {
  //           setCurrentUser(response)
  //         })
  //     }
  //   } else {
  //     alert('Невірний тип файлу')
  //   }
  // }

  const updateFavoriteRecipes = () => {
    getFavorites()
      .then(onFavoritesLoaded)
  }

  const onFavoritesLoaded = (recipes) => {
    setFavoriteRecipes(recipes)
  }

  const renderRecipes = (items) => {
    if (currentUser.favorites.length) {
      const recipes = items.map((item, index) => {
        const recipeName = item.title.length > 30
          ? `${item.title.slice(0, 30)}...`
          : item.title

        return (
          <li className="comics__item"
              tabIndex={0}
              key={index}
              onClick={() => navigate(`/recipes/${items[index]._id}`)}
              onKeyPress={(e) => {
                if (e.key === ' ' || e.key === "Enter") {
                  navigate(`/recipes/${recipes[index].id}`)
                }
              }}>
            <img src={item.image} alt={item.title} className="comics__item-img" style={{objectFit: 'cover'}}/>
            <div className="comics__item-name">{recipeName}</div>
          </li>
        )
      })

      return (
        <ul className="comics__grid">
          {recipes}
        </ul>
      )
    } else {
      return (
        <div className="comics__title">Немає рецептів в бажаних</div>
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
      <Helmet>
        <meta
          name="description"
          content="profile"
        />
        <title>Profile</title>
      </Helmet>
      <AppBanner/>
      <div className="profile">
        <div className="profile-info">
          <div className="profile-logo">
            <h2 className="single-comic__name">{`email: ${currentUser.email}`}</h2>
            {/*<img src={avatar} alt='user avatar' className="single-comic__char-img"/>*/}
            {/*<input className='profile-file' accept="image/*" onChange={e => changeHandler(e)} type="file" placeholder="Загрузить аватар"/>*/}
          </div>
          <div className="char__btns">
            <div className="button button__main single-comic-link"
                 onClick={() => logout()}>
              <div className="inner">
                Вийти з аккаунта
              </div>
            </div>
            {currentUser.role === 'admin' &&
              <div className="button button__main single-comic-link"
                   onClick={() => navigate('/recipe-editor')}>
                <div className="inner">
                  Додати рецепт
                </div>
              </div>
            }
          </div>
        </div>
        {renderRecipes(favoriteRecipes)}
      </div>
    </>
  )
}

export default Profile
