import React from 'react';
import './app.scss';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import Header from '../header';
import AddArticlePage from '../add-article-page';
import RegestrationPage from '../regestration-page';
import AuthorizationPae from '../authorization-page';
import HomePage from '../home-page';
import PostDetails from '../post-details';
import EditingPage from '../editing-page';
import * as actions from '../../actions';

const mapStateToProps = ({ user, articles, articlesUiState }) => {
  return {
    articles,
    pageSize: articlesUiState.pageSize,
    currentPage: articlesUiState.currentPage,
    username: user.userData.username,
    isAuthorized: user.isAuthorized,
  };
};

const actionCreators = {
  handleGetAllArticles: actions.handleGetAllArticles,
};

class App extends React.Component {
  componentDidMount() {
    const { pageSize, currentPage, username, handleGetAllArticles } = this.props;
    handleGetAllArticles(pageSize, currentPage, username);
  }

  render() {
    const { articles, isAuthorized } = this.props;
    const render = () =>
      !isAuthorized ? <Redirect to="/login" /> : <HomePage articles={articles} />;
    return (
      <div className="container">
        <Router>
          <Header />
          <Switch>
            <Route exact path="/">
              {render()}
            </Route>
            <Route path="/signup">
              <RegestrationPage />
            </Route>
            <Route path="/login">
              <AuthorizationPae />
            </Route>
            <Route path="/add">
              <AddArticlePage />
            </Route>
            <Route
              path="/articles/:slug"
              exact
              render={({ match }) => {
                const { slug } = match.params;
                return <PostDetails postId={slug} />;
              }}
            />
            <Route
              path="/articles/:slug/edit"
              exact
              render={({ match }) => {
                const { slug } = match.params;
                return <EditingPage postId={slug} />;
              }}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(App);

App.defaultProps = {
  pageSize: 10,
  currentPage: 1,
  username: '',
  articles: {},
  handleGetAllArticles: () => {},
  isAuthorized: null,
};

App.propTypes = {
  isAuthorized: PropTypes.bool,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  username: PropTypes.string,
  articles: PropTypes.PropTypes.exact({
    bySlug: PropTypes.object,
    allSlugs: PropTypes.array,
  }),
  handleGetAllArticles: PropTypes.func,
};
