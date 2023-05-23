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
                  <span>Delideas</span> все про рецепти
              </Link>
          </h1>
          <nav className="app__menu">
              <ul>
                  <li><NavLink style={({ isActive }) => ({ color: isActive ? '#086423' : 'inherit'})} to="/">Рецепти</NavLink></li>
                  /
                  <li><NavLink style={({ isActive }) => ({ color: isActive ? '#086423' : 'inherit'})} to="/fridge">Пошук</NavLink></li>
                  /
                  {!isAuth && <li><NavLink style={({ isActive }) => ({ color: isActive ? '#086423' : 'inherit'})} to={"/login"}>Увійти</NavLink></li>}
                  {!isAuth && <li>/ <NavLink style={({ isActive }) => ({ color: isActive ? '#086423' : 'inherit'})} to={"/registration"}>Зареєструватися</NavLink></li>}
                  {isAuth && <li><NavLink style={({ isActive }) => ({ color: isActive ? '#086423' : 'inherit'})} to={"/profile"}>Мій аккаунт</NavLink></li>}
              </ul>
          </nav>
      </header>
  )
}

export default AppHeader;
