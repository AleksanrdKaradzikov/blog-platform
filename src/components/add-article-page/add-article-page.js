import React from 'react';
import './add-article-page.scss';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import ErrorCustom from '../error-custom';
import NotAuthorized from '../not-authorized';
import * as actions from '../../actions';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Название не меньше 3 символов')
    .max(50, 'Название не более 50 символов')
    .required('Обязательное поле'),
  description: Yup.string()
    .min(10, 'Краткое описание не меньше 10 символов')
    .max(150, 'Краткое описание не более 150 символов')
    .required('Обязательное поле'),
  body: Yup.string()
    .min(10, 'Содержимое статьи не меньше 10 символов')
    .required('Обязательное поле'),
  tagList: Yup.array().of(Yup.string().min(3, 'Не менее 3 символов')),
});

const mapStateToProps = ({ user, articlesUiState }) => {
  const props = {
    token: user.userData.token,
    username: user.userData.username,
    isAuthorized: user.isAuthorized,
    isSuccessful: articlesUiState.isSuccessful,
  };

  return props;
};

const actionCreators = {
  addArticle: actions.handleArticleAdd,
};

class AddArticlePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleAddArticle(data, resetForm) {
    const { addArticle, token } = this.props;
    const newData = {
      article: {
        ...data,
      },
    };

    addArticle(newData, token, resetForm).then(postId => {
      const { history } = this.props;
      history.push(`/articles/${postId}/`);
    });
  }

  render() {
    const { username, isAuthorized, isSuccessful } = this.props;
    const successfulMessage =
      isSuccessful === true ? (
        <div className="successful-message">Cтатья создана успешно</div>
      ) : null;
    const faildeMessage =
      isSuccessful === false ? (
        <div className="failed-message">Что-то пошло не так, статья не создана</div>
      ) : null;
    const formik = (
      <Formik
        initialValues={{ title: '', description: '', body: '', tagList: [] }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(false);
          this.handleAddArticle(values, resetForm);
        }}
      >
        <Form className="form form__add-article">
          <Field name="title" type="text" className="form__input" placeholder="Заголовок статьи" />
          <ErrorMessage name="title" component={ErrorCustom} />
          <Field
            name="description"
            type="text"
            className="form__input"
            placeholder="Короткое описание статьи"
          />
          <ErrorMessage name="description" component={ErrorCustom} />
          <Field
            name="body"
            type="text"
            as="textarea"
            className="form__textarea"
            placeholder="Содержимое статьи"
          />
          <ErrorMessage name="body" component={ErrorCustom} />
          <FieldArray name="tagList">
            {({ push, form: { values } }) => {
              const renderTagList = tagList => {
                return tagList.map((tag, index) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <React.Fragment key={`id_${index}`}>
                      <Field
                        className="form__input"
                        name={`tagList.${index}`}
                        placeholder="Введите тэг"
                      />
                      <ErrorMessage name={`tagList.${index}`} component={ErrorCustom} />
                    </React.Fragment>
                  );
                });
              };

              const render = values.tagList.length > 0 ? renderTagList(values.tagList) : null;

              return (
                <>
                  {render}
                  <button onClick={() => push('')} type="button" className="my-btn__add-tag">
                    Добавить тэг
                  </button>
                </>
              );
            }}
          </FieldArray>
          {successfulMessage}
          {faildeMessage}
          <button type="submit" className="my-btn my-btn-add">
            Создать статью
          </button>
        </Form>
      </Formik>
    );

    const renderPage = isAuthorized ? (
      <>
        <h2 className="heading">
          <span className="heading__greeting">Приветствуем {username}</span>
          Создание новой статьи
        </h2>
        <p className="page-description">
          Чтобы создать новую статью заполните поле заголовка, короткого описания, содержимого и
          тегов.
        </p>
        {formik}
      </>
    ) : (
      <NotAuthorized type="create" />
    );
    return (
      <div className="container-wrapp">
        <div className="user-auth-block">{renderPage}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withRouter(AddArticlePage));

AddArticlePage.defaultProps = {
  username: '',
  addArticle: () => {},
  token: '',
  isAuthorized: null,
  isSuccessful: null,
  history: {},
};

AddArticlePage.propTypes = {
  username: PropTypes.string,
  addArticle: PropTypes.func,
  token: PropTypes.string,
  isAuthorized: PropTypes.bool,
  isSuccessful: PropTypes.bool,
  history: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
};
