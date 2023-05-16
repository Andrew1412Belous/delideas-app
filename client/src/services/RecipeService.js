import { useHttp } from '../hooks/http.hook'

const useRecipeService = () => {
  const { request, clearError, process, setProcess } = useHttp()

  const _apiBase = 'http://localhost:5000'
  const _baseRecipeOffset = 0

  const getRandomRecipe = async () => {
    const result = await request(`${_apiBase}/random`)

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
    const products = item.ingredients
      .map(product => product.toLowerCase()
        .replace(/[\,./()^0-9]/g, '')
          .split(' ')
      .filter(word => word.length >= 3 && !parseInt(word)))

    let ingredientsCount = []
    let currentProduct = ''

    ingredients.forEach(ingredient => {
      products.forEach((product, i) => {
        if (product.includes(ingredient)) {
          if (currentProduct !== ingredient) {
            ingredientsCount.push(i)

            currentProduct = ingredient
          }
        }
      })
    })

    return {
      ...item,
      ingredientsCount: [...new Set(ingredientsCount)],
      instructions: item.instructions.map(step => step.text)
    }
  }

  const getAllFilters = async () => request(`${_apiBase}/filters`)

  const _transformRecipe = (recipe) => ({
      id: recipe.id,
      title: recipe.title,
      ingredients: recipe.ingredients,
      times: recipe.times,
      instructions: recipe.instructions.map(step => typeof step === 'string' ? step :step.text),
      image: recipe.image,
    })

  return {
    getRecipe,
    getAllRecipes,
    getAllFilters,
    getAllRecipesByIngredients,
    getRecipeByIngredients,
    getRandomRecipe,
    clearError,
    process,
    setProcess,
  }
}

export default useRecipeService
