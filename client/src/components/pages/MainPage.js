import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import ErrorBoundary from '../errorBoundary/ErrorBoundary'
import RandomRecipe from '../randomRecipe/RandomRecipe'
import CharList from '../recipesList/CharList'
import CharInfo from '../charInfo/CharInfo'

import decoration from '../../resources/img/bg.png'

const MainPage = () => {
  const [selectedRecipe, setRecipe] = useState(null)

  useEffect(() => {
    sessionStorage.removeItem('fridge-filter')
  }, [])

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
            <CharList onRecipeSelected={onRecipeSelected}/>
          </ErrorBoundary>
          <ErrorBoundary>
            <CharInfo recipeId={selectedRecipe}/>
          </ErrorBoundary>
      </div>
      <img className="bg-decoration" src={decoration} alt="bg"/>
    </>
  )
}

export default MainPage
