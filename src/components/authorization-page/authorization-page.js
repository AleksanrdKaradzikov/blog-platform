import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { Link, Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorCustom from '../error-custom';
import * as actions from '../../actions';
import './authorization-page.scss';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Не менее 8 символов')
    .max(40, 'Не более 40 символов')
    .required('Обязательное поле'),
  email: Yup.string()
    .email('Введите корректный email адресс')
    .required('Обязательное поле'),
});

const mapStateToProps = ({ user }) => {
  const props = {
    isAuthorized: user.isAuthorized,
    error: user.error,
  };

  return props;
};

const actionCreators = {
  login: actions.login,
};

const MyError = ({ error }) => {
  if (!error) {
    return null;
  }

  return <ErrorCustom>Неправильный email или пароль</ErrorCustom>;
};

class AuthorizationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleLoginSbm = ({ password, email }, resetForm) => {
    const { login } = this.props;
    const data = JSON.stringify({
      user: {
        email,
        password,
      },
    });
    login(data, resetForm);
  };

  render() {
    const { isAuthorized, error } = this.props;
    const formik = (
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(false);
          this.handleLoginSbm(values, resetForm);
        }}
      >
        <Form className="form">
          <Field name="email" type="email" placeholder="Email" className="form__input" />
          <ErrorMessage name="email" component={ErrorCustom} />
          <Field name="password" type="password" placeholder="Пароль" className="form__input" />
          <ErrorMessage name="password" component={ErrorCustom} />
          <MyError error={error} />
          <button className="my-btn" type="submit">
            Войти в личный кабинет
          </button>
          <Link to="/signup" className="my-btn__standart">
            Зарегестрироваться
          </Link>
        </Form>
      </Formik>
    );

    const render = () => (isAuthorized ? <Redirect to="/" /> : null);

    return (
      <>
        <Route exact path="/login" render={render} />
        <div className="container-wrapp">
          <div className="user-auth-block">
            <h2 className="heading">Авторизоваться</h2>
            <p className="page-description">
              Чтобы войти на сайт используйте ваш email и пароль, которые были указаны при
              регистрации на сайт
            </p>
            {formik}
          </div>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(AuthorizationPage);

MyError.defaultProps = {
  error: null,
};

MyError.propTypes = {
  error: PropTypes.bool,
};

AuthorizationPage.defaultProps = {
  isAuthorized: null,
  login: () => {},
  error: null,
};

AuthorizationPage.propTypes = {
  isAuthorized: PropTypes.bool,
  login: PropTypes.func,
  error: PropTypes.bool,
};
