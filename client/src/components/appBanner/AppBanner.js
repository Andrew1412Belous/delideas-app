import burger from '../../resources/img/burger.png';
import plate from '../../resources/img/plate.png';

import './appBanner.scss';

const AppBanner = () => {
  return (
    <div className="app__banner">
      <img className="app__banner-img" src={burger} alt="Avengers"/>
      <div className="app__banner-text">
          Нові рецепти щотижня!<br/>
          Залишайтесь з нами
      </div>
      <img className="app__banner-img" src={plate} alt="Avengers logo"/>
    </div>
  )
}

export default AppBanner;
