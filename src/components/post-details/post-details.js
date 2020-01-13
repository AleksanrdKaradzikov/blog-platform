import React from 'react';
import formatDistance from 'date-fns/formatDistance';
import { connect } from 'react-redux';
import { ru } from 'date-fns/locale';
import { Link, withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import * as actions from '../../actions';
import Spinner from '../spinner';
import operetion from './operation.png';
import './post-details.scss';

const getDate = createdDate => {
  const res = formatDistance(new Date(createdDate), new Date(), {
    locale: ru,
    includeSeconds: true,
  });

  return res;
};

const renderTagList = tagList => {
  return tagList.map(tag => {
    return (
      <span key={tag} className="tag">
        #{tag}
      </span>
    );
  });
};

const mapStateToProps = ({ user, articles }) => {
  return {
    token: user.userData.token,
    articles: articles.bySlug,
    username: user.userData.username,
  };
};

const actionCreators = {
  handleLike: actions.handleLike,
};

class PostDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      article: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.updatePost();
  }

  componentDidUpdate(prevProps) {
    const { postId, articles } = this.props;
    if (prevProps.postId !== postId || prevProps.articles !== articles) {
      this.updatePost();
    }
  }

  handleFavoriteArticle = async (event, slug) => {
    const { token, handleLike } = this.props;

    if (!token) {
      // eslint-disable-next-line no-alert
      alert('Не авторизованные пользователи не могут ставить лайки, пожалуйста авторизируйтесь');
      return;
    }

    const { target } = event;
    const toggle = target.classList.contains('my-btn__heart--active');

    await handleLike(slug, token, toggle);
  };

  handleSettingCLick = (event, id) => {
    event.preventDefault();
    const { history } = this.props;
    history.push(`${id}/edit`);
  };

  updatePost() {
    const { postId } = this.props;
    if (!postId) {
      return;
    }

    const { articles } = this.props;
    const article = articles[`${postId}`];

    this.setState({
      article,
      loading: false,
    });
  }

  render() {
    const { article, loading } = this.state;

    if (loading) {
      return (
        <div className="container-wrapp">
          <div className="posts-block">
            <div className="row text-center">
              <div className="col">
                <Spinner />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!article) {
      return (
        <div className="container-wrapp">
          <div className="posts-block">
            <div className="row text-center">
              <div className="col">Выберите какую статью отобразить</div>
            </div>
          </div>
        </div>
      );
    }

    const { title, slug, author, body, createdAt, tagList, favoritesCount, favorited } = article;
    const { username, token } = this.props;

    const setting =
      token && username === author.username ? (
        <a
          className="favorites-block__setting-link btn-sm"
          href="/"
          title="Редактировать данную статью"
          onClick={event => this.handleSettingCLick(event, slug)}
        >
          <img className="favorites-block__setting-image" src={operetion} alt="Настройки" />
        </a>
      ) : null;

    const likeClass = `btn-sm my-btn__heart ${favorited ? 'my-btn__heart--active' : ''}`;

    return (
      <div className="container-wrapp">
        <div className="posts-block">
          <div className="row justify-content-lg-center">
            <div className="col-lg-8 col-md-auto">
              <div className="card border-secondary shadow-lg rounded">
                <img src={author.image} className="card-img-top" alt="Post" />
                <h6 className="card-header">Создана: {getDate(createdAt)} назад</h6>
                <div className="card-body">
                  <h5 className="card-title text-center font-weight-bold">{title}</h5>
                  <p className="card-text text-center">{body}</p>
                  <p className="card-text">
                    <span className="font-weight-normal">Автор: </span>
                    {author.username}
                  </p>
                  <p className="card-text">{renderTagList(tagList)}</p>
                  <div className="card-footer card-footer-flex">
                    <div className="favorites-block">
                      <button
                        type="button"
                        className={likeClass}
                        onClick={event => this.handleFavoriteArticle(event, slug)}
                      >
                        /
                      </button>
                      <span className="favorites-block__count">{favoritesCount}</span>
                      {setting}
                    </div>
                    <Link to="/">
                      <button
                        type="button"
                        className="my-btn btn btn-outline-success btn-sm text-center"
                      >
                        Все статьи
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withRouter(PostDetails));

PostDetails.defaultProps = {
  history: {},
  postId: '',
  articles: {},
  token: null,
  handleLike: () => {},
  username: null,
};

PostDetails.propTypes = {
  history: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  postId: PropTypes.string,
  articles: PropTypes.objectOf(PropTypes.object),
  token: PropTypes.string,
  handleLike: PropTypes.func,
  username: PropTypes.string,
};
