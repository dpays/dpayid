import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Badge } from 'antd';
import DSiteAvatar from '../../../widgets/DSiteAvatar';
import './TransferDelegate.less';

const SignPlaceholderDefault = ({
  query,
}) => {
  let amount;
  let symbol;
  if (query.amount) {
    [amount, symbol] = query.amount.split(' ');
  }
  return (
    <div className="Placeholder__operation-content">
      <div className="TransferInfo">
        <div className="TransferInfo__accounts">
          <div className="TransferInfo__account">
            <DSiteAvatar username={query.fromName} size="60" className="TransferInfo__avatar" />
            {query.fromReputation && <span className="TransferInfo__reputation"><Badge count={query.fromReputation} style={{ backgroundColor: '#1A5099' }} /></span>}
            <br />
            <span className="TransferInfo__username">
              {query.fromName || <FormattedMessage id="you" />}
            </span>
            <span className="TransferInfo__dots" />
          </div>
          <div className="TransferInfo__account">
            <span className="TransferInfo__dots" />
            <DSiteAvatar username={query.toName} size="60" className="TransferInfo__avatar" />
            {query.toReputation && <span className="TransferInfo__reputation"><Badge count={query.toReputation} style={{ backgroundColor: '#1A5099' }} /></span>}
            <br />
            <span className="TransferInfo__username">
              {query.toName}
            </span>
          </div>
        </div>
        {amount &&
        <strong>
          <FormattedNumber
            value={amount}
            currency="USD"
            minimumFractionDigits={3}
            maximumFractionDigits={3}
          /> {symbol}
        </strong>}
        {query.memo && <span className="Placeholder__memo">{query.memo}</span>}
      </div>
    </div>
  );
};

SignPlaceholderDefault.propTypes = {
  query: PropTypes.shape(),
};

export default SignPlaceholderDefault;
