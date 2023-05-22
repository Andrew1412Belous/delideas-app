import { useNavigate } from 'react-router-dom'
import setContent from '../../utils/setContent'

import './fridgeRecipeList.scss'

const FridgeRecipesList = ({ filteredRecipes, offset, setOffset, fridgeIngredients, process }) => {
  const navigate = useNavigate()

  const loadMore = () => {
    offset + 8 >= filteredRecipes.length
      ? setOffset(filteredRecipes.length)
      :  setOffset(offset + 8)
  }

  function renderComics (recipes) {
    if (recipes.length) {
      const length = recipes.length < 8
        ? recipes.length
        : offset

      const items = []

      for (let i = 0; i < length; i++) {
        const productsForPurchases = recipes[i].ingredients
          .filter((item, index) => recipes[i].ingredientsCount.every(i => i !== index))

        const item = (
          <li className='comics__item'
              onClick={() => navigate(`/recipes/${recipes[i].id}`, {
                state: fridgeIngredients
              })}
              tabIndex={0}
              key={i}>
            <img src={recipes[i].image} alt={recipes[i].title} className="comics__item-img" style={{objectFit: 'cover'}}/>
            <div className="comics__item-name">{recipes[i].title}</div>
            <div className="comics__item-name">Потрібно докупити</div>
            {productsForPurchases.map((product, i) => {
              if (i > 2) return

              return (
                <div className='comics__item-price' key={i}>{product}</div>
              )
            })}
            <div className="comics__item-price">...</div>
          </li>
        )

        items.push(item)
      }

      return (
        <ul className="comics__grid">
          {items}
        </ul>
      )
    } else {
      return (
        <div className='comics__title'>За даною категорією рецептів не знайдено</div>
      )
    }
  }

  return (
    fridgeIngredients
      ? <div className="comics__list">
          {setContent(process, () => renderComics(filteredRecipes))}
          {filteredRecipes.length && filteredRecipes.length > 8
            ? <button
                disabled={process === 'loading'}
                style={{'display' : offset === filteredRecipes.length ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={loadMore}>
                <div className="inner">Завантажити ще</div>
              </button>
            : null}
        </div>
      : null
  )
}

export default FridgeRecipesList
