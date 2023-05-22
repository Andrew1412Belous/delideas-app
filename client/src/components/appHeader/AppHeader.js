import {
  Link,
  NavLink,
} from 'react-router-dom'

import './appHeader.scss';

const AppHeader = ({ isAuth }) => {
  return (
      <header className="app__header">
          <h1 className="app__title">
              <Link to="/">
                  <span>Delideas</span> all about recipes
              </Link>
          </h1>
          <nav className="app__menu">
              <ul>
                  <li><NavLink style={({ isActive }) => ({ color: isActive ? '#086423' : 'inherit'})} to="/">Recipes</NavLink></li>
                  /
                  <li><NavLink style={({ isActive }) => ({ color: isActive ? '#086423' : 'inherit'})} to="/fridge">Smart fridge</NavLink></li>
                  /
                  {!isAuth && <li><NavLink style={({ isActive }) => ({ color: isActive ? '#086423' : 'inherit'})} to={"/login"}>Увійти</NavLink></li>}
                  {!isAuth && <li>/ <NavLink style={({ isActive }) => ({ color: isActive ? '#086423' : 'inherit'})} to={"/registration"}>Зареєструватися</NavLink></li>}
                  {isAuth && <li><NavLink style={({ isActive }) => ({ color: isActive ? '#086423' : 'inherit'})} to={"/profile"}>My account</NavLink></li>}
              </ul>
          </nav>
      </header>
  )
}

export default AppHeader;
