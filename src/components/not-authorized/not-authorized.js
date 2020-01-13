import React from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import './not-authorized.scss';

const NotAuthorized = ({ type }) => {
  return (
    <div className="authentication">
      <h2 className="heading-authentication">Вы не авторизованны</h2>
      <p className="page-text">
        {type === 'create'
          ? ' Авторизируйтесь чтобы создать новую статью'
          : ' Авторизируйтесь чтобы редактировать статью'}
      </p>
      <Link to="/login" className="my-btn__standart">
        Авторизоваться
      </Link>
      <p className="page-text">Или зарегестируйтесь если у вас еще нет учетной записи</p>
      <Link to="/signup" className="my-btn__standart">
        Зарегестрироваться
      </Link>
    </div>
  );
};

export default NotAuthorized;

NotAuthorized.defaultProps = {
  type: 'create',
};

NotAuthorized.propTypes = {
  type: PropTypes.string,
};
