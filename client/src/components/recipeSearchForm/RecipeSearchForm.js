import {
  Field,
  Form,
  Formik,
  ErrorMessage as FormikErrorMessage,
} from 'formik'

import { useLocation } from 'react-router-dom'

import * as Yup from 'yup'

import './recipeSearchForm.scss'

const RecipeSearchForm = ({ isRecipesFound, onIngredientsIntroduced, process, fridgeIngredients }) => {
  const location = useLocation()

  let results = isRecipesFound === null
    ? null
    : isRecipesFound === 0
      ? <p className="char__search-error">Рецептів з даними продуктами немає, перевірте правильність написання та спробуйте ще раз</p>
      : <div className="char__search-wrapper">
           <div className="char__search-success">{`Знайдено ${isRecipesFound} рецептів`}</div>
        </div>

  return (
    <div className="char__search-form">
      <Formik
        initialValues={{
          ingredients: location.state
            ? location.state.join(', ')
            : ''
        }}
        onSubmit={({ ingredients }) => {
          if (fridgeIngredients !== ingredients) {
            onIngredientsIntroduced(ingredients.split(', '))
          }
        }}
        validationSchema={Yup.object({
          ingredients: Yup.string().required("Це поле обов'язковим!")
        })}
        validateOnBlur={false}>
        <Form>
          <label className="char__search-label">Знайти рецепт по продуктах з вашого дому</label>
          <div className="char__search-wrapper">
            <Field
              id='ingredients'
              type='text'
              name='ingredients'
              placeholder='Введіть продукти які є в вашому холодильнику (через ", ")'>
            </Field>
            <button
              type='submit'
              className='button button__main'
              disabled={process === 'loading'}
            >
              <div className="inner">Знайти</div>
            </button>
          </div>
          <FormikErrorMessage name='ingredients' className='char__search-error' component='div'></FormikErrorMessage>
        </Form>
      </Formik>
      {results}
    </div>
  )
}

export default RecipeSearchForm
