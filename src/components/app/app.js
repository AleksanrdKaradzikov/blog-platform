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

const mapStateToProps = ({ user, articlesUiState }) => {
  return {
    pageSize: articlesUiState.pageSize,
    currentPage: articlesUiState.currentPage,
    token: user.userData.token,
    isAuthorized: user.isAuthorized,
  };
};

const actionCreators = {
  handleGetAllArticles: actions.handleGetAllArticles,
  login: actions.login,
};

class App extends React.Component {
  componentDidMount() {
    this.checkLogin();
  }

  checkLogin = async () => {
    const { pageSize, currentPage, token, handleGetAllArticles, login } = this.props;
    const checkStorage = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;
    if (checkStorage) {
      const userData = {
        user: {
          ...checkStorage,
        },
      };
      await login(userData);
    }
    handleGetAllArticles(pageSize, currentPage, token);
  };

  render() {
    const { isAuthorized } = this.props;
    const render = () => (!isAuthorized ? <Redirect to="/login" /> : <HomePage />);
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
            <Redirect to="/" />
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
  token: '',
  handleGetAllArticles: () => {},
  isAuthorized: null,
  login: () => {},
};

App.propTypes = {
  isAuthorized: PropTypes.bool,
  pageSize: PropTypes.number,
  currentPage: PropTypes.number,
  token: PropTypes.string,
  handleGetAllArticles: PropTypes.func,
  login: PropTypes.func,
};
