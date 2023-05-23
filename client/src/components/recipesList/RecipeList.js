import {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react'

import PropTypes from 'prop-types';

import ErrorMessage from '../errorMessage/errorMessage'
import Spinner from '../spinner/spinner'

import './RecipeList.scss';
import useRecipeService from '../../services/RecipeService'

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case 'waiting':
      return <Spinner/>
    case 'loading':
      return newItemLoading ? <Component/> : <Spinner/>
    case 'confirmed':
      return <Component/>
    case 'error':
      return <ErrorMessage/>
    default:
      throw new Error('Unexpected process state')
  }
}

const RecipeList = (props) => {
  const [recipesList, setRecipesList] = useState([])
  const [newItemLoading, setNewItemLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [recipesEnded, setRecipesEnded] = useState(false)

  const { getAllRecipes, process, setProcess } = useRecipeService()

  useEffect(() => {
    onRequest(offset, true)
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true)

    getAllRecipes(offset)
      .then(onRecipesListLoaded)
      .then(() => setProcess('confirmed'))
  }

  const onRecipesListLoaded = (newCharList) => {
    setRecipesList(charList => [...charList, ...newCharList])
    setNewItemLoading(false)
    setOffset(offset => offset + 9)
    setRecipesEnded(newCharList.length < 9)
  }

  const itemRefs = useRef([])

  const focusOnItem = (id) => {
    itemRefs.current
      .forEach(item => item.classList.remove('char__item_selected'))

    itemRefs.current[id].classList.add('char__item_selected')
    itemRefs.current[id].focus()
  }

  function renderChars (items) {
    const recipes = items.map((item, index) => {
      const recipeName = item.title.length > 30
        ? `${item.title.slice(0, 30)}...`
        : item.title

      return (
        <li className="char__item"
            tabIndex={0}
            ref={el => itemRefs.current[index] = el}
            key={item.id}
            onClick={() => {
              props.onRecipeSelected(item.id)
              focusOnItem(index)
            }}
            onKeyPress={(e) => {
              if (e.key === ' ' || e.key === "Enter") {
                props.onRecipeSelected(item.id);
                focusOnItem(index);
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
  }

  const elements = useMemo(() => setContent(process, () => renderChars(recipesList), newItemLoading), [process])

  return (
    <div className="char__list">
      {elements}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        onClick={() => onRequest(offset)}
        style={{display: recipesEnded ? 'none' : 'block'}}>
        <div className="inner">Завантажити ще</div>
      </button>
    </div>
  )
}

RecipeList.propTypes = {
  onRecipeSelected: PropTypes.func.isRequired
}

export default RecipeList;
