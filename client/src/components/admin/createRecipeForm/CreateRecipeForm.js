import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import './createRecipeForm.scss'
import useRecipeService from '../../../services/RecipeService'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateRecipeForm = () => {
  const [filters, setFilters] = useState([])
  const [inputValue, setInputValue] = useState('')

  const navigate = useNavigate()

  const { getAllCategories, setProcess, createRecipe } = useRecipeService()

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
    return items.map((item, i) => {
      if (item.name === 'all') {
        return
      }

      return  <option key={i} value={item.name}>{item.label}</option>
    })
  }

  const addRecipe = (values, image) => {
    const recipe = {
      ...values,
      image,
      ingredients: values.ingredients.split(', '),
      instructions: values.instructions.split('. '),
    }

    createRecipe(recipe)
      .then(() => navigate(-1))
  }

  return (
    <Formik
      initialValues = {{
        title: '',
        ingredients: '',
        times: 0,
        instructions: '',
        image: ``,
        category: '',
      }}
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
          addRecipe(values, inputValue)
      }}
    >
      <Form className="form">
        <h2>Створити рецепт</h2>
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
          as='select'>
          <option value="">Виберіть категорію</option>
          {renderFilter(filters)}
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
        <button type="submit" disabled={!inputValue}>Отправить</button>
      </Form>
    </Formik>
  )
}

export default CreateRecipeForm
