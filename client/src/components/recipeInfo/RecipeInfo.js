import {
  useState,
  useEffect,
} from 'react'

import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';

import setContent from '../../utils/setContent'

import './recipeInfo.scss';
import useRecipeService from '../../services/RecipeService'

const RecipeInfo = (props) => {
  const [recipe, setRecipe] = useState(null)

  const {
    getRecipe,
    clearError,
    process,
    setProcess,
  } = useRecipeService()

  useEffect(() => updateRecipe(), [props.recipeId])

  const updateRecipe = () => {
    const { recipeId } = props

    if (!recipeId) return

    clearError()

    getRecipe(recipeId)
      .then(onRecipeLoaded)
      .then(() => setProcess('confirmed'))
  }

  const onRecipeLoaded = (char) => {
    setRecipe(char)
  }

  return (
    <div className="char__info">
      {setContent(process, View, recipe)}
    </div>
  )
}

const View = ({ data }) => {
  const { title, image, ingredients, id } = data

  const ingredientsList = ingredients.length === 0
    ? null
    : ingredients.map((item, i) => {
      return (
        <li key={i} className="char__comics-item">
          {item[0].toUpperCase() + item.slice(1)}
        </li>
      )
    })

  return (
    <>
      <div className="char__basics">
        <img src={image} alt={title} style={{objectFit: 'cover'}}/>
        <div>
          <div className="char__info-name">{title}</div>
          <div className="char__btns">
            <Link to={`/recipes/${id}`} className="button button__main">
              <div className="inner">До рецепту</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="char__comics">Інгредієнти:</div>
      <ul className="char__comics-list">
        {ingredientsList}
      </ul>
    </>
  )
}

RecipeInfo.propTypes = {
  charId: PropTypes.string
}

export default RecipeInfo
