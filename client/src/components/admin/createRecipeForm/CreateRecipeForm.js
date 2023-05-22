import {
  ErrorMessage,
  Field,
  Form,
  Formik
} from 'formik'

import * as Yup from 'yup'

import useRecipeService from '../../../services/RecipeService'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Spinner from '../../spinner/spinner'

import './createRecipeForm.scss'

const CreateRecipeForm = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [filters, setFilters] = useState([])
  const [inputValue, setInputValue] = useState(location.state ? location.state.image : null)

  const { getAllCategories, setProcess, createRecipe, changeRecipe } = useRecipeService()

  useEffect(() => {
    onRequest()
  }, [])

  const handleChange = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0]

      if (!file.type.indexOf('image')) {
        const reader = new FileReader()

        reader.onload = function (ev) {
          setInputValue(ev.target.result)
        }

        reader.readAsDataURL(file)
      }
    }
  }

  const onRequest = () => {
    getAllCategories()
      .then(onFiltersLoaded)
      .then(() => setProcess('confirmed'))
  }

  const onFiltersLoaded = (filters) => {
    setFilters(filters)
  }

  const renderFilter = (items) => {
    const options =  items.map((item, i) => {
      if (item.name === 'all') {
        return
      }

       return <option key={i} value={item.name}>{item.label}</option>
    })
    return (
      <>
        {options}
      </>
    )
  }

  const getRecipe = (values, image) => {
    const recipe = {
      ...values,
      image,
      ingredients: values.ingredients.split(', '),
      instructions: values.instructions.split('. ').map((item, i, arr) => {
        return i === arr.length - 1
          ? item.indexOf('.') !== -1
            ? item
            : `${item}.`
          : `${item}.`
      })
    }

    if (location.state) {
      changeRecipe(recipe, location.state.id)
        .then(() => navigate(-1))
    } else {
      createRecipe(recipe)
        .then(() => navigate(-1))
    }
  }

  const initialRecipe = () => {
    return location.state
      ? {
        title: location.state.title,
        ingredients: location.state.ingredients.join(', '),
        times: parseInt(location.state.times),
        instructions: location.state.instructions.join(' '),
        image: location.state.image,
        category: filters.filter(item => item.label === location.state.category)[0].name,
      }
      : {
        title: '',
        ingredients: '',
        times: 0,
        instructions: '',
        image: ``,
        category: '',
      }
  }

  const elements = renderFilter(filters)

  return (
    <>
      {filters.length
        ?  <Formik
          initialValues = {initialRecipe()}
          validationSchema = {Yup.object({
            title: Yup.string()
              .min(3, 'Too small')
              .required('Required'),
            ingredients: Yup.string()
              .matches(/[,]/, {
                message: 'Invalid format'
              })
              .required('Required'),
            instructions: Yup.string()
              .matches(/[.]/, {
                message: 'Invalid format'
              })
              .required('Required'),
            category: Yup.string().required('Виберіть категорію'),
            times: Yup.number()
              .min(10, 'Minimum 10')
              .integer('Invalid format')
              .required('Required'),
          })}
          onSubmit={values => {
            getRecipe(values, inputValue)
          }}
        >
          <Form className="form">
            <h2>{location.state ? 'Змінити рецепт' : 'Створити рецепт'}</h2>
            <label htmlFor="title">Заголовок рецепту</label>
            <Field
              id="title"
              name="title"
              type="text"
            />
            <ErrorMessage className='error' name='title' component='div'/>
            <label htmlFor="ingredients">Інгредієнти</label>
            <Field
              id="ingredients"
              name="ingredients"
              type="ingredients"
            />
            <ErrorMessage className='error' name='ingredients' component='div'/>
            <label htmlFor="instructions">Інструкція</label>
            <Field
              id="instructions"
              name="instructions"
              as='textarea'
            />
            <ErrorMessage className='error' name='instructions' component='div'/>
            <label htmlFor="category">Категорія</label>
            <Field
              id="category"
              name="category"
              as='select'
            >
              <option value="">Виберіть категорію</option>
              {elements}
            </Field>
            <ErrorMessage className='error' name='category' component='div'/>
            <label htmlFor="times">Час на приготування (в хвилинах)</label>
            <Field
              id="times"
              name="times"
              type="number"
            />
            <ErrorMessage className='error' name='times' component='div'/>
            <label htmlFor="image">Картинка рецепту</label>
            <input type="file" onChange={e => handleChange(e)}/>
            {!inputValue
              ? <div className='form-error'>Виберіть зображення</div>
              : <img className='form-image' src={inputValue} alt="recipe image"/>}
            <Field
              id="image"
              name="image"
              type="text"
              value={inputValue ? inputValue : ''}
              disabled={true}
            />
            <ErrorMessage className='error' name='image' component='div'/>
            <button type="submit" disabled={!inputValue}>{location.state ? 'Змінити' : 'Створити'}</button>
          </Form>
        </Formik>
        : <Spinner/>
      }
    </>
  )
}

export default CreateRecipeForm
