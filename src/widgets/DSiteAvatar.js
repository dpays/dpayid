import React, { PropTypes } from 'react';
import './DSiteAvatar.less';

const DSiteAvatar = ({
  username,
  size = '36',
  className = '',
}) =>
  <span
    style={{
      height: `${size}px`,
      width: `${size}px`,
    }}
  >
    <div
      className={`DSiteAvatar ${className}`}
      style={{
        height: `${size}px`,
        width: `${size}px`,
        backgroundImage: `url(https://dsiteimages.com/u/${username}/avatar)`,
      }}
    />
  </span>
;

DSiteAvatar.propTypes = {
  username: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};

export default DSiteAvatar;
