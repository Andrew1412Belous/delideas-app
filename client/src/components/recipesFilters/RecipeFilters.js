import { useEffect, useMemo, useRef, useState } from 'react'
import useRecipeService from '../../services/RecipeService'
import setContent from '../../utils/setContent'

import '../spinner/spinner'

import './recipesFilters.scss'

const RecipeFilters = ({ onCategorySelected, isRecipesFound, FridgeProcess }) => {
  const [filters, setFilters] = useState([])

  const { getAllCategories, setProcess, process } = useRecipeService()

  useEffect(() => {
    onRequest()
  }, [])

  const onRequest = () => {
    getAllCategories()
      .then(onFiltersLoaded)
      .then(() => setProcess('confirmed'))
  }

  const onFiltersLoaded = (filters) => {
    setFilters(filters)
  }

  const itemRefs = useRef([])

  const focusOnItem = (id) => {
    itemRefs.current
      .forEach(item => {
        item.classList.remove('button__main')
        item.classList.add('button__secondary')
      })

    itemRefs.current[id].classList.add('button__main')
    itemRefs.current[id].classList.remove('button__secondary')
    itemRefs.current[id].focus()
  }

  const renderButtons = (items) => {
    const buttons = items.map((item, i) => {
      const classNames = item.name === 'all'
        ? 'button button__main'
        : 'button button__secondary'

      return (
          <button
            key={i}
            tabIndex={0}
            className={classNames}
            disabled={FridgeProcess === 'loading'}
            ref={el => {
              itemRefs.current[i] = el
            }}
            onClick={() => {
              onCategorySelected(item.name)
              focusOnItem(i)
            }}>
            <div className="inner">
               {item.label}
            </div>
          </button>
        )
    })

    return (
      <div className='btn-group'>
        {buttons}
      </div>
    )
  }
  const elements = useMemo(() => setContent(process, () => renderButtons(filters)), [isRecipesFound])

  return (
    <>
      {isRecipesFound
        ? elements
        : null}
    </>
  )
}

export default RecipeFilters
