import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import PostList from '../post-list';
import * as actions from '../../actions';
import './home-page.scss';

const mapStateToProps = ({ user }) => {
  const props = {
    isAuthorized: user.isAuthorized,
    username: user.userData.username,
  };

  return props;
};

const actionCreators = {
  exit: actions.exit,
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
    const topbar = this.renderTopBar();

    return (
      <div className="container-wrapp">
        {topbar}
        <PostList handlePostSelected={this.handlePostSelected} />
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(withRouter(HomePage));

HomePage.defaultProps = {
  history: {},
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
  username: PropTypes.string,
  isAuthorized: PropTypes.bool,
  exit: PropTypes.func,
};
