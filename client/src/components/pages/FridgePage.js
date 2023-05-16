import { Helmet } from 'react-helmet'
import AppBanner from '../appBanner/AppBanner'
import CharSearchForm from '../charSearchForm/CharSearchForm'
import { useEffect, useState } from 'react'
import ErrorBoundary from '../errorBoundary/ErrorBoundary'
import FridgeRecipesList from '../fridgeRecipesList/fridgeRecipesList'
import useRecipeService from '../../services/RecipeService'
import RecipeFilters from '../recipesFilters/RecipeFilters'
import { useLocation } from 'react-router-dom'

const FridgePage = () => {
  const location = useLocation()

  const [fridgeIngredients, setFridgeIngredients] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isRecipesFound, setIsRecipesFound] = useState(null)
  const [comicsList, setComicsList] = useState([])
  const [offset, setOffset] = useState(8)

  const { process, setProcess, getAllRecipesByIngredients } = useRecipeService()

  useEffect(() => {
    if (location.state) {
      onIngredientsIntroduced(location.state)
    }
  }, [])

  useEffect(() => {
    if (fridgeIngredients) {
      onRequest(fridgeIngredients)
    }
  }, [fridgeIngredients])

  const onFilterSelected = (id) => {
    setSelectedFilter(id)
  }

  const onRequest = (ingredients) => {
    getAllRecipesByIngredients(ingredients)
      .then(onComicsListLoaded)
      .then(() => setProcess('confirmed'))
  }

  const onComicsListLoaded = (recipesList) => {
    setOffset(8)
    setComicsList(recipesList)
    setIsRecipesFound(recipesList === null ? null : recipesList.length)
  }

  const onIngredientsIntroduced = (ingredients) => {
    setFridgeIngredients(ingredients)
  }

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Smart Fridge"
        />
        <title>Smart Fridge</title>
      </Helmet>
      <AppBanner/>
      <div className="content">
        <ErrorBoundary>
          <CharSearchForm
            onIngredientsIntroduced={onIngredientsIntroduced}
            isRecipesFound={isRecipesFound}
            process={process}
            fridgeIngredients={fridgeIngredients}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <RecipeFilters
            selectedFilter={selectedFilter}
            onFilterSelected={onFilterSelected}
            isRecipesFound={isRecipesFound}
            fridgeIngredients={fridgeIngredients}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <FridgeRecipesList
            comicsList={comicsList}
            offset={offset}
            setOffset={setOffset}
            fridgeIngredients={fridgeIngredients}
            process={process}
          />
        </ErrorBoundary>
      </div>
    </>
  )
}

export default FridgePage
