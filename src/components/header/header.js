import React from 'react';
import './header.scss';
import { NavLink, Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="row">
        <div className="col-sm-2 col-lg-2 col-md-2">
          <div className="header__brif">
            <Link to="/" className="header__brif-link">
              neat blog
            </Link>
          </div>
        </div>
        <div className="col-sm-6 col-lg-6 col-md-6">
          <ul className="header__nav-list">
            <li className="header__nav-list-item">
              <NavLink to="/add" className="header__link" activeClassName="header__link--active">
                Создать статью
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="col-sm-4 col-lg-4 col-md-4">
          <ul className="header__nav-list">
            <li className="header__nav-list-item">
              <NavLink to="/signup" className="header__link" activeClassName="header__link--active">
                Регестрация
              </NavLink>
            </li>
            <li className="header__nav-list-item">
              <NavLink to="/login" className="header__link" activeClassName="header__link--active">
                Авторизация
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
