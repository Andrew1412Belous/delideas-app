import {
  lazy,
  Suspense,
  useEffect,
  useState
} from 'react'

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'

import AppHeader from '../appHeader/AppHeader'

import Spinner from '../spinner/spinner'
import useAuthorizationService from '../../services/AuthorizationService'

const Page404 = lazy(() => import('../pages/404'))
const MainPage = lazy(() => import('../pages/MainPage'))
const SingleRecipePage = lazy(() => import('../pages/singleRecipePage/SingleRecipePage'))
const FridgePage = lazy(() => import('../pages/FridgePage'))
const Profile = lazy(() => import('../pages/profile/Profile'))

const Registration = lazy(() => import('../authorization/Registration'))
const Login = lazy(() => import('../authorization/Login'))
const CreateRecipeForm = lazy(() => import('../admin/createRecipeForm/CreateRecipeForm'))

const App = () => {
  const [currentUser, setCurrentUser] = useState({})
  const [isAuth, setIsAuth] = useState(false)

  const { auth } = useAuthorizationService()

  useEffect(() => {
    auth()
      .then(userLoggedIn)
  }, [])

  const userLoggedIn = (data) => {
    setCurrentUser(data)
    setIsAuth(!!Object.keys(data).length)
  }

  return (
   <Router>
     <div className="App">
       <div className="app">
         <AppHeader isAuth={isAuth}/>
         <main>
           <Suspense fallback={<Spinner/>}>
             <Routes>
               <Route path="/" element={<MainPage/>}/>
               <Route path="/fridge" element={<FridgePage/>}/>
               <Route path="/recipes/:id"
                      element={<SingleRecipePage
                        isAuth={isAuth}
                        currentUser={currentUser}
                        userLoggedIn={userLoggedIn}
                      />}/>
               <Route path='/registration' element={isAuth ? null : <Registration userLoggedIn={userLoggedIn}/>}/>
               <Route path='/login' element={isAuth ? null : <Login userLoggedIn={userLoggedIn}/>}/>
               <Route path='/profile' element={isAuth ? <Profile
                  userLoggedIn={userLoggedIn}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}/> : null}/>
               <Route path='/recipe-editor' element={<CreateRecipeForm/>}/>
               <Route path="*" element={<Page404/>}/>
             </Routes>
           </Suspense>
         </main>
       </div>
     </div>
   </Router>
  )
}

export default App;
