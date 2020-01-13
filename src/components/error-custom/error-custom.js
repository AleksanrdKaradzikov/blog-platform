import React from 'react';
import { PropTypes } from 'prop-types';
import './error-custom.scss';

const ErrorCustom = ({ children }) => {
  return <div className="error-message">{children}</div>;
};

export default ErrorCustom;

ErrorCustom.defaultProps = {
  children: null,
};

ErrorCustom.propTypes = {
  children: PropTypes.string,
};
