import { useLocation, useParams } from 'react-router-dom'
import {
  useEffect,
  useState,
} from 'react'

import AppBanner from '../appBanner/AppBanner'
import setContent from '../../utils/setContent'
import useRecipeService from '../../services/RecipeService'

const SinglePage = ({ Component }) => {
  const location = useLocation()
  const { id } = useParams()

  const [data, setData] = useState(null)

  const { getRecipe, getRecipeByIngredients, clearError, process, setProcess } = useRecipeService()

  useEffect(() => updateData(), [id])

  const updateData = () => {
    clearError()

    if (location.state) {
      getRecipeByIngredients(id, location.state)
        .then(onDataLoaded)
        .then(() => setProcess('confirmed'))
    } else {
      getRecipe(id)
        .then(onDataLoaded)
        .then(() => setProcess('confirmed'))
    }
  }

  const onDataLoaded = (data) => {
    setData(data)
  }

  return (
    <>
      <AppBanner/>
      {setContent(process, Component, data)}
    </>
  )
}

export default SinglePage
