import { Helmet } from 'react-helmet'
import AppBanner from '../appBanner/AppBanner'
import RecipeSearchForm from '../recipeSearchForm/RecipeSearchForm'
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
  const [filteredRecipes, setFilteredRecipes] = useState([])
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

  const onCategorySelected = (name) => {
    if (name === 'all') {
      setFilteredRecipes(comicsList)
      setSelectedFilter(name)
      setOffset(8)
    } else {
      const result = comicsList
        .filter(item => item.category.name === name)

      setFilteredRecipes(result)
      setSelectedFilter(name)
    }
  }

  const onRequest = (ingredients) => {
    getAllRecipesByIngredients(ingredients)
      .then(onComicsListLoaded)
      .then(() => setProcess('confirmed'))
  }

  const onComicsListLoaded = (recipesList) => {
    setOffset(8)
    setComicsList(recipesList)
    setFilteredRecipes(recipesList)
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
          <RecipeSearchForm
            onIngredientsIntroduced={onIngredientsIntroduced}
            isRecipesFound={isRecipesFound}
            process={process}
            fridgeIngredients={fridgeIngredients}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <RecipeFilters
            onCategorySelected={onCategorySelected}
            isRecipesFound={isRecipesFound}
            FridgeProcess={process}
            fridgeIngredients={fridgeIngredients}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <FridgeRecipesList
            filteredRecipes={filteredRecipes}
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
