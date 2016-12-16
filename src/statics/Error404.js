import React from 'react';
import { Link } from 'react-router';

import Icon from '../widgets/Icon';

const Error404 = () => {
  return (
    <div className="main-panel">
      <div className="container">
        <div className="ptl text-xs-center">
          <Icon name="info" xl />
          <h1>Page Not Found</h1>
          <h2>Oops! Looks like you followed a bad link.</h2>
          <p>If you think this is a problem with Busy,
            please <a href="https://busy.org" target="_blank">tell us</a>.<br />
            Here's a link to the <Link to="/">home page</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default Error404;
