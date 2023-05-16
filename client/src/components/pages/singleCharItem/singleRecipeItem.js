import { useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import './singleRecipeItem.scss'

const SingleRecipeItem = ({ data }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const { title, ingredients, times, instructions, image } = data

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
          {item} {requiredForPurchase(i)}
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

  const recipeTime = (times) => {
    if (times.length) {
      return <div className="char__comics">Максимальний час приготування: {times[times.length - 1]}</div>
    } else {
      return null
    }
  }

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
        <div className="char__comics">Інгрідієнти:</div>
        <ul className="char__comics-list">
          {ingredientsList}
        </ul>
        <div className="char__comics">Інструкція :</div>
        <ol className="char__comics-list">
          {steps}
        </ol>
        {recipeTime(times)}
      </div>
      <div className="char__btns">
        <div className="button button__main single-comic-link"
          onClick={() => navigate(`${backLink}`, {
            state: location.state
          })}>
          <div className="inner">Повернутися назад</div>
        </div>

      </div>
    </div>
  )
}

export default SingleRecipeItem
