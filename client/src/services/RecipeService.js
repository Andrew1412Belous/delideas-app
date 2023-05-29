import { useHttp } from '../hooks/http.hook'
import axios from 'axios'

const useRecipeService = () => {
  const { request, clearError, process, setProcess } = useHttp()

  const _apiBase = 'https://mern-delideas-app-server.vercel.app'
  const _baseRecipeOffset = 0

  const getRandomRecipe = async (id) => {
    const result = await request(`${_apiBase}/random?id=${id}`)

    return _transformRecipe(result)
  }

  const getRecipe = async (id) => {
    const result = await request(`${_apiBase}/recipe/${id}`)

    return _transformRecipe(result)
  }

  const getAllRecipes = async (offset = _baseRecipeOffset) => {
    const result = await request(`${_apiBase}/recipes?offset=${offset}&limit=${offset + 9}`)

    return result.map(_transformRecipe)
  }

  const getRecipeByIngredients = async (id, ingredients) => {
    const result = await request(`${_apiBase}/recipe/${id}`)

    return filterRecipesByIngredient(result, ingredients)
  }

  const getAllRecipesByIngredients = async (ingredients) => {
    const result = await request(`${_apiBase}/search?ingredients=${ingredients.join(',')}`)

    return result
      .map(item => filterRecipesByIngredient(item, ingredients))
      .sort(function (a, b) {
        return b.ingredientsCount.length - a.ingredientsCount.length
      })
  }

  const filterRecipesByIngredient = (item, ingredients) => {
    let ingredientsCount = []
    let currentProduct = ''

    ingredients.forEach(ingredient => {
      item.ingredients.forEach((product, i) => {
        if (product.indexOf(ingredient) !== -1 && currentProduct !== ingredient) {
          ingredientsCount.push(i)

          currentProduct = ingredient
        }
      })
    })

    return {
      ...item,
      ingredientsCount: [...new Set(ingredientsCount)],
    }
  }

  const getAllCategories = async () => request(`${_apiBase}/categories`)

  const createRecipe = async (recipe) => {
    try {
      const response = await axios.post(`${_apiBase}/add-recipe`, recipe,
        {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
      )

      alert(response.data.message)

      return response.data
    } catch (e) {
      alert('Помилка')
      console.log(e)
    }
  }

  const deleteRecipe = async (recipeId) => {
    try {
      const response = await axios.delete(`${_apiBase}/delete-recipe/${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

      alert(response.data.message)

      return response.data.message
    } catch (e) {
      alert('Помилка')
      console.log(e)
    }
  }

  const changeRecipe = async (recipe, recipeId) => {
    try {
      const response = await axios.patch(`${_apiBase}/change-recipe/${recipeId}`, recipe,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

      alert(response.data.message)

      return response.data.message
    } catch (e) {
      alert('Помилка')
      console.log(e)
    }
  }

  const _transformRecipe = (recipe) => ({
      id: recipe["_id"],
      title: recipe.title,
      ingredients: recipe.ingredients,
      times: recipe.times,
      instructions: recipe.instructions,
      image: recipe.image,
      category: recipe.category
    })

  return {
    getRecipe,
    getAllRecipes,
    getAllCategories,
    getAllRecipesByIngredients,
    getRecipeByIngredients,
    getRandomRecipe,
    createRecipe,
    deleteRecipe,
    changeRecipe,
    clearError,
    process,
    setProcess,
  }
}

export default useRecipeService
