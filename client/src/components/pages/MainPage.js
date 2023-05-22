import { useState } from 'react'
import { Helmet } from 'react-helmet'

import ErrorBoundary from '../errorBoundary/ErrorBoundary'
import RandomRecipe from '../randomRecipe/RandomRecipe'
import RecipeList from '../recipesList/RecipeList'
import RecipeInfo from '../recipeInfo/RecipeInfo'

import decoration from '../../resources/img/bg.png'

const MainPage = () => {
  const [selectedRecipe, setRecipe] = useState(null)

  const onRecipeSelected = (id) => {
    setRecipe(id)
  }

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Recipe Information Portal"
        />
        <title>Delideas</title>
      </Helmet>
      <ErrorBoundary>
        <RandomRecipe/>
      </ErrorBoundary>
      <div className="char__content">
          <ErrorBoundary>
            <RecipeList onRecipeSelected={onRecipeSelected}/>
          </ErrorBoundary>
          <ErrorBoundary>
            <RecipeInfo recipeId={selectedRecipe}/>
          </ErrorBoundary>
      </div>
      <img className="bg-decoration" src={decoration} alt="bg"/>
    </>
  )
}

export default MainPage
