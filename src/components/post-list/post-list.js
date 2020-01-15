import React from 'react';
import formatDistance from 'date-fns/formatDistance';
import Pagination from 'react-js-pagination';
import { ru } from 'date-fns/locale';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import * as actions from '../../actions';
import Spinner from '../spinner';
import './post-list.scss';

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

const mapStateToProps = ({ user, articles, articlesUiState }) => {
  return {
    articles,
    token: user.userData.token,
    pageSize: articlesUiState.pageSize,
    currentPage: articlesUiState.currentPage,
    totalPostCount: articlesUiState.totalPostCount,
  };
};

const actionCreators = {
  handleLike: actions.handleLike,
  pageChange: actions.pageChange,
  handleGetAllArticles: actions.handleGetAllArticles,
};

class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleFavoriteArticle = (event, slug) => {
    const { token, handleLike } = this.props;

    if (!token) {
      // eslint-disable-next-line no-alert
      alert('Не авторизованные пользователи не могут ставить лайки, пожалуйста авторизируйтесь');
      return;
    }

    const { target } = event;
    const toggle = target.classList.contains('my-btn__heart--active');

    handleLike(slug, token, toggle);
  };

  handlePageChange = pageNumber => {
    const { pageSize, pageChange, handleGetAllArticles, token } = this.props;
    pageChange({ pageNumber });
    handleGetAllArticles(pageSize, pageNumber, token);
  };

  render() {
    const { articles, handlePostSelected, totalPostCount, pageSize, currentPage } = this.props;

    if (articles.allSlugs.length === 0) {
      return (
        <div className="posts-block">
          <div className="row text-center">
            <div className="col">
              <Spinner />
            </div>
          </div>
        </div>
      );
    }

    const data = Object.values(articles.bySlug).map(
      ({ title, slug, author, description, createdAt, tagList, favoritesCount, favorited }) => {
        const { username, image } = author;
        return (
          <div key={slug} className="col-md-4 col-lg-4 col-sm-6 col-xs-12 mb-4">
            <div className="card h-100 shadow p-3 mb-5 bg-white rounded">
              <img src={image} className="card-img-top" alt="Карточка" />
              <h6 className="card-header">Создана: {getDate(createdAt)} назад</h6>
              <div className="card-body">
                <h5 className="card-title font-weight-bold">{title}</h5>
                <p className="card-text">{description}</p>
                <p className="card-text">
                  <span className="font-weight-normal">Автор: </span>
                  {username}
                </p>
                <p className="card-text">{renderTagList(tagList)}</p>
                <div className="card-footer card-footer-flex">
                  <div className="favorites-block">
                    <button
                      type="button"
                      className={`btn-sm my-btn__heart ${favorited ? 'my-btn__heart--active' : ''}`}
                      onClick={event => this.handleFavoriteArticle(event, slug)}
                    >
                      /
                    </button>
                    <span className="favorites-block__count">{favoritesCount}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-success  btn-sm"
                    onClick={() => handlePostSelected(slug)}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
    );

    const pagination = (
      <div className="row justify-content-lg-center">
        <div className="col-lg-8 text-center">
          <div className="pagination-box border-top pt-3">
            <Pagination
              pageRangeDisplayed={5}
              activePage={currentPage}
              itemsCountPerPage={pageSize}
              totalItemsCount={totalPostCount}
              onChange={this.handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </div>
      </div>
    );

    return (
      <div className="posts-block">
        <div className="row row-cols-1 row-cols-md-3 mb-5">{data}</div>
        {pagination}
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(PostList);

PostList.defaultProps = {
  token: null,
  handleLike: () => {},
  pageSize: 10,
  pageChange: () => {},
  handleGetAllArticles: () => {},
  currentPage: 1,
  articles: {},
  handlePostSelected: () => {},
  totalPostCount: 1,
};

PostList.propTypes = {
  token: PropTypes.string,
  handleLike: PropTypes.func,
  pageSize: PropTypes.number,
  pageChange: PropTypes.func,
  handleGetAllArticles: PropTypes.func,
  currentPage: PropTypes.number,
  articles: PropTypes.PropTypes.exact({
    bySlug: PropTypes.object,
    allSlugs: PropTypes.array,
  }),
  handlePostSelected: PropTypes.func,
  totalPostCount: PropTypes.number,
};
