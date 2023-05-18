import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  useEffect,
  useState,
} from 'react'

import AppBanner from '../../appBanner/AppBanner'
import setContent from '../../../utils/setContent'
import useRecipeService from '../../../services/RecipeService'
import { Helmet } from 'react-helmet'

import './singleRecipePage.scss'
import useAuthorizationService from '../../../services/AuthorizationService'

const SingleRecipePage = ({ isAuth, currentUser, userLoggedIn }) => {
  const [data, setData] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()

  const { id } = useParams()

  const { getRecipe, getRecipeByIngredients, clearError, process, setProcess } = useRecipeService()
  const { updateFavorites } = useAuthorizationService()

  useEffect(() => updateData(), [id])

  const setFavorite = () => {
    updateFavorites(id)
      .then(userLoggedIn)
  }

  const updateData = () => {
    clearError()

    if (location.state) {
      getRecipeByIngredients(id, location.state)
        .then(onDataLoaded)
        .then(() => setProcess('confirmed'))
    } else {
      getRecipe(id)
        .then(onDataLoaded)
        .then(() => setProcess('confirmed'))
    }
  }

  const onDataLoaded = (data) => {
    setData(data)
  }

  const renderPage = (data) => {
    const { title, ingredients, times, instructions, image, category } = data

    const backLink = location.state
      ? '/fridge'
      : '/'

    const isFromFridgePage = data.hasOwnProperty('ingredientsCount')

    const requiredForPurchase = (index) => isFromFridgePage
      ? data.ingredientsCount
        .every(ingredientIndex => ingredientIndex !== index)
        ? <span style={{color: '#9F0013'}}>(ДОКУПИТИ)</span>
        : null
      : null

    const ingredientsList = ingredients.length
      ? ingredients.map((item, i) => {
        return (
          <li key={i} className="char__comics-item">
            {item[0].toUpperCase() + item.slice(1)} {requiredForPurchase(i)}
          </li>
        )
      })
      : null

    const steps = instructions.length
      ? instructions.map((item, i) => {
        return (
          <li key={i} className="single-comic__descr">
            {i+1}) {item}
          </li>
        )
      })
      : null

    return (
      <div className="single-comic">
        <Helmet>
          <meta
            name="description"
            content={`${title} page information`}
          />
          <title>{title}</title>
        </Helmet>
        <img src={image} alt={title} className="single-comic__char-img"/>
        <div className="single-comic__info">
          <h2 className="single-comic__name">{title}</h2>
          <div className="char__comics">Категорія:
            <span className="single-comic__descr"> {category}</span>
          </div>
          <div className="char__comics">Інгрідієнти:</div>
          <ul className="char__comics-list">
            {ingredientsList}
          </ul>
          <div className="char__comics">Інструкція :</div>
          <ol className="char__comics-list">
            {steps}
          </ol>
          <div className="char__comics">{`Максимальний час приготування: ${times}`}</div>
        </div>
        <div className="char__btns">
          <div className="button button__main single-comic-link"
               onClick={() => navigate(`${backLink}`, {
                 state: location.state
               })}>
            <div className="inner">Повернутися назад</div>
          </div>
          {isAuth &&
            <div className="button button__main single-comic-link"
                 onClick={() => setFavorite()}>
              <div className="inner">
              {
                currentUser.favorites.some(item => item == id)
                  ? 'Видалити з бажаного'
                  : 'Додати в бажане'
              }
              </div>
            </div>
          }
        </div>
      </div>
    )
  }

  return (
    <>
      <AppBanner/>
      {setContent(process, () => renderPage(data), data)}
    </>
  )
}

export default SingleRecipePage
