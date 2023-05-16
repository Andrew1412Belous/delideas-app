import { useEffect, useMemo, useRef, useState } from 'react'
import useRecipeService from '../../services/RecipeService'
import setContent from '../../utils/setContent'

import './recipesFilters.scss'

const RecipeFilters = ({ onFilterSelected, isRecipesFound }) => {
  const [filters, setFilters] = useState([])

  const { getAllFilters, setProcess, process } = useRecipeService()

  useEffect(() => {
    onRequest()
  }, [])

  const onRequest = () => {
    getAllFilters()
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
      const classNames = item.id === 'all'
        ? 'button button__main'
        : 'button button__secondary'

      return (
          <button
            key={i}
            tabIndex={0}
            className={classNames}
            ref={el => {
              itemRefs.current[i] = el
            }}
            onClick={() => {
              onFilterSelected(item.id)
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
