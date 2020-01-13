import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import PostList from '../post-list';
import * as actions from '../../actions';
import './home-page.scss';

const mapStateToProps = ({ user, articlesUiState }) => {
  const props = {
    isAuthorized: user.isAuthorized,
    username: user.userData.username,
    token: user.userData.token,
    totalPostCount: articlesUiState.totalPostCount,
    pageSize: articlesUiState.pageSize,
    currentPage: articlesUiState.currentPage,
  };

  return props;
};

const actionCreators = {
  exit: actions.exit,
  handleLike: actions.handleLike,
  pageChange: actions.pageChange,
  handleGetAllArticles: actions.handleGetAllArticles,
};

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handlePostSelected = postId => {
    const { history } = this.props;
    history.push(`/articles/${postId}/`);
  };

  renderTopBar() {
    const { username, isAuthorized } = this.props;

    if (isAuthorized) {
      const { exit } = this.props;
      return (
        <div className="row align-items-center justify-content-between">
          <div className="col">
            <h2 className="heading__greeting">Приветствуем {username}</h2>
          </div>
          <div className="col">
            <button type="button" className="my-btn" onClick={exit}>
              Выйти из личного кабинета
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="row align-items-center justify-content-between">
        <div className="col">
          <h2 className="heading__greeting">Вы не авторизованы</h2>
        </div>
        <div className="col">
          <Link to="/login">
            <button type="button" className="my-btn  text-center">
              Войти в личный кабинет
            </button>
          </Link>
        </div>
      </div>
    );
  }

  render() {
    const {
      articles,
      token,
      handleLike,
      totalPostCount,
      pageSize,
      currentPage,
      pageChange,
      handleGetAllArticles,
      username,
    } = this.props;
    const topbar = this.renderTopBar();

    return (
      <div className="container-wrapp">
        {topbar}
        <PostList
          handlePostSelected={this.handlePostSelected}
          articles={articles}
          token={token}
          handleLike={handleLike}
          totalPostCount={totalPostCount}
          pageSize={pageSize}
          currentPage={currentPage}
          pageChange={pageChange}
          handleGetAllArticles={handleGetAllArticles}
          username={username}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withRouter(HomePage));

HomePage.defaultProps = {
  history: {},
  articles: {},
  token: null,
  handleLike: () => {},
  totalPostCount: 1,
  pageSize: 10,
  currentPage: 1,
  pageChange: () => {},
  handleGetAllArticles: () => {},
  username: null,
  isAuthorized: null,
  exit: () => {},
};

HomePage.propTypes = {
  history: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.func,
    PropTypes.object,
  ]),
  articles: PropTypes.PropTypes.exact({
    bySlug: PropTypes.object,
    allSlugs: PropTypes.array,
  }),
  token: PropTypes.string,
  handleLike: PropTypes.func,
  totalPostCount: PropTypes.number,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  pageChange: PropTypes.func,
  handleGetAllArticles: PropTypes.func,
  username: PropTypes.string,
  isAuthorized: PropTypes.bool,
  exit: PropTypes.func,
};
