import React from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import ErrorCustom from '../error-custom';
import NotAuthorized from '../not-authorized';
import * as actions from '../../actions';
import './editing-page.scss';

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
  return {
    token: user.userData.token,
    username: user.userData.username,
    isAuthorized: user.isAuthorized,
    isEditSuccessful: articlesUiState.isEditSuccessful,
  };
};

const actionCreators = {
  handleArticleEdit: actions.handleArticleEdit,
};

class EditingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleEditArticle = (data, resetForm) => {
    const { postId, token, handleArticleEdit } = this.props;
    const newData = {
      article: {
        ...data,
      },
    };
    handleArticleEdit(JSON.stringify(newData), token, resetForm, postId);
  };

  render() {
    const { postId } = this.props;
    if (!postId) {
      return (
        <div className="container-wrapp">
          <div className="user-auth-block">Вы не выбрали какую с статью редактировать</div>
        </div>
      );
    }

    const { username, isAuthorized, isEditSuccessful } = this.props;
    const successfulMessage =
      isEditSuccessful === true ? (
        <div className="successful-message">Cтатья успешно отредактирована</div>
      ) : null;
    const faildeMessage =
      isEditSuccessful === false ? (
        <div className="failed-message">
          Вы не являетесь владельцом данной статьи, статья не может быть отредактирована
        </div>
      ) : null;
    const formik = (
      <Formik
        initialValues={{ title: '', description: '', body: '', tagList: [] }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(false);
          this.handleEditArticle(values, resetForm);
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
                    <React.Fragment key={`id_${tag}`}>
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
            Редактировать статью
          </button>
        </Form>
      </Formik>
    );

    const renderPage = isAuthorized ? (
      <>
        <h2 className="heading">
          <span className="heading__greeting">Приветствуем {username}</span>
          Редактирование статьи
        </h2>
        <p className="page-description">
          Чтобы редактировать статью заполните поле заголовка, короткого описания, содержимого и
          тегов.
        </p>
        {formik}
      </>
    ) : (
      <NotAuthorized type="edit" />
    );

    return (
      <div className="container-wrapp">
        <div className="user-auth-block">{renderPage}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(EditingPage);

EditingPage.defaultProps = {
  postId: null,
  token: null,
  handleArticleEdit: null,
  username: null,
  isAuthorized: null,
  isEditSuccessful: null,
};

EditingPage.propTypes = {
  postId: PropTypes.string,
  token: PropTypes.string,
  handleArticleEdit: PropTypes.func,
  username: PropTypes.string,
  isAuthorized: PropTypes.bool,
  isEditSuccessful: PropTypes.bool,
};
