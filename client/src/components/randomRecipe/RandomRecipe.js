import {
  useState,
  useEffect,
} from 'react'

import setContent from '../../utils/setContent'

import chef from '../../resources/img/pngegg.png';

import './randomRecipe.scss';
import useRecipeService from '../../services/RecipeService'
import { Link } from 'react-router-dom'

const RandomRecipe = () => {
  const [recipe, setRecipe] = useState({})
  const { clearError, process, setProcess, getRandomRecipe } = useRecipeService()

  useEffect(() => updateRecipe(), [])

  const onRecipeLoaded = (recipe) => {
    setRecipe(recipe)
  }

  const updateRecipe = () => {
    clearError()

    getRandomRecipe(recipe.id)
      .then(onRecipeLoaded)
      .then(() => setProcess('confirmed'))
  }

  return (
    <div className="randomchar">
      {setContent(process, View, recipe)}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Випадковий рецепт на сьогодні!<br/>
          Бажаєте отримати всю інформацію?
        </p>
        <p className="randomchar__title">
          Або виберіть інший
        </p>
        <button
          className="button button__main"
          onClick={updateRecipe}>
          <div className="inner">Спробувати</div>
        </button>
        <img src={chef} alt="mjolnir" className="randomchar__decoration"/>
      </div>
    </div>)
}

const View = ({ data }) => {
  const { title, image, instructions, id } = data

  const name = title.length > 30 ? `${title.slice(0, 30)}...` : title
  const descr = instructions[0].length > 150 ? `${instructions[0].slice(0, 150)}...` : instructions[0]

  return (
    <div className="randomchar__block">
      <img src={image} alt={title} className="randomchar__img"/>
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">
          {descr}
        </p>
        <div className="randomchar__btns">
          <Link to={`/recipes/${id}`} className="button button__main">
            <div className="inner">До рецепту</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RandomRecipe;
