import React from 'react';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../actions';
import ErrorCustom from '../error-custom';
import './regestration-page.scss';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Имя пользователя не менее 2 символов')
    .max(40, 'Имя пользователя не более 40 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(8, 'Пароль не менее 8 символов')
    .max(40, 'Пароль не более 40 символов')
    .required('Обязательное поле'),
  email: Yup.string()
    .email('Введите корректный email адресс')
    .required('Обязательное поле'),
});

const Successful = ({ isSuccessful }) => {
  return isSuccessful ? <div className="successes-message">Регестрация прошла успешно</div> : null;
};

const mapStateToProps = ({ user }) => {
  const props = {
    isSuccessful: user.isSuccessful,
    error: user.error,
  };

  return props;
};

const actionCreators = {
  registration: actions.registration,
};

class RegestrationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleRegestrationSbm = ({ username, password, email }, resetForm) => {
    const { registration } = this.props;
    const data = JSON.stringify({
      user: {
        username,
        email,
        password,
      },
    });
    registration(data, resetForm);
  };

  render() {
    const { isSuccessful, error } = this.props;
    const formik = (
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(isSuccessful);
          this.handleRegestrationSbm(values, resetForm);
        }}
      >
        <Form className="form">
          <Field
            name="username"
            type="text"
            className="form__input"
            placeholder="Имя пользователя"
          />
          <ErrorMessage name="username" component={ErrorCustom} />
          {error ? <div className="error-message">{error.username}</div> : null}
          <Field name="email" type="email" className="form__input" placeholder="Email" />
          <ErrorMessage name="email" component={ErrorCustom} />
          {error ? <div className="error-message">{error.email}</div> : null}
          <Field name="password" type="password" className="form__input" placeholder="Пароль" />
          <ErrorMessage name="password" component={ErrorCustom} />
          {error ? <div className="error-message">{error.password}</div> : null}
          <Successful isSuccessful={isSuccessful} />
          <button type="submit" className="my-btn">
            Зарегестрироваться
          </button>
          <Link to="/login" className="my-btn__standart">
            Уже зарегестрированы?
          </Link>
        </Form>
      </Formik>
    );

    return (
      <div className="container-wrapp">
        <div className="user-auth-block">
          <h2 className="heading">Регестрация</h2>
          <p className="page-description">
            Введите имя пользователя, email адресс и пароль для регестрации в личном кабинете
          </p>
          {formik}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(RegestrationPage);

Successful.defaultProps = {
  isSuccessful: null,
};

Successful.propTypes = {
  isSuccessful: PropTypes.bool,
};

RegestrationPage.defaultProps = {
  registration: null,
  isSuccessful: null,
  error: null,
};

RegestrationPage.propTypes = {
  registration: PropTypes.func,
  isSuccessful: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string])),
};
