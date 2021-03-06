import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import fetch from 'isomorphic-fetch';
import dpay from 'dpayjs';
import { notification, Modal } from 'antd';
import { browserHistory } from 'react-router';
import CreateAppForm from '../Form/CreateApp';
import SignForm from '../Form/Sign';
import config from '../../../config.json';
import { getAccountCreationFee } from '../../utils/auth';
import { getErrorMessage } from '../../../helpers/operation';
import Loading from '../../widgets/Loading';
import { sleep } from '../../../helpers/utils';

class CreateApp extends React.Component {
  static propTypes = {
    auth: PropTypes.shape(),
  }

  state = {
    visible: false,
    isLoading: false,
    values: {},
    accountCreationFee: '',
  };

  componentWillMount = async () => {
    const accountCreationFee = await getAccountCreationFee();
    this.setState({ accountCreationFee });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  handleFormSubmit = (values) => {
    this.setState({ values });
    this.showModal();
  };

  handleSignFormSubmit = async (auth) => {
    const { intl } = this.props;
    this.hideModal();
    this.setState({ isLoading: true });
    const clientId = this.state.values.username;
    const accountCreationFee = await getAccountCreationFee();

    /** Generate account authorities */
    const publicKeys = config.offline_generated_public_keys;
    const owner = { weight_threshold: 1, account_auths: [['dpayid', 1]], key_auths: [[publicKeys.owner, 1]] };
    const active = { weight_threshold: 1, account_auths: [['dpayid', 1]], key_auths: [[publicKeys.active, 1]] };
    const posting = { weight_threshold: 1, account_auths: [['dpayid', 1]], key_auths: [[publicKeys.posting, 1]] };

    const operations = [[
      'account_create', {
        fee: accountCreationFee,
        creator: auth.username,
        new_account_name: clientId,
        owner,
        active,
        posting,
        memo_key: publicKeys.memo,
        json_metadata: JSON.stringify({ owner: this.props.auth.user.name }),
      },
    ]];

    /** Create proxy account */
    dpay.broadcast.send(
      { operations, extensions: [] },
      { active: auth.wif },
      async (err) => {
        if (!err) {
          /** Wait 5 seconds to insure the newly created account is indexed on the node */
          await sleep(5000);

          /** Send request to server for create app */
          fetch(`/api/apps/@${clientId}`, {
            headers: new Headers({
              Authorization: this.props.auth.token,
            }),
            method: 'POST',
          })
            .then(res => res.json())
            .then((data) => {
              if (!data.error) {
                /** Redirect to edit app */
                browserHistory.push(`/apps/@${clientId}/edit`);
                notification.success({
                  message: intl.formatMessage({ id: 'success' }),
                  description: intl.formatMessage({ id: 'success_proxy_account' }, { clientId }),
                });
              } else {
                this.setState({ isLoading: false });
                notification.error({
                  message: intl.formatMessage({ id: 'error' }),
                  description: data.error || intl.formatMessage({ id: 'general_error' }),
                });
              }
            });
        } else {
          this.setState({ isLoading: false });
          notification.error({
            message: intl.formatMessage({ id: 'error' }),
            description: getErrorMessage(err) || intl.formatMessage({ id: 'general_error' }),
          });
        }
      });
  };

  render() {
    return (
      <div className="container py-5">
        <h1><FormattedMessage id="create_app" /></h1>
        <div className="block py-4">
          {this.state.isLoading || !this.state.accountCreationFee
            ? <center><Loading /></center>
            : <div>
              <p>
                <FormattedMessage id="create_app_fee" values={{ fee: <b>{this.state.accountCreationFee}</b> }} />
              </p>
              <p>
                <FormattedMessage id="create_app_keys_1" /> <b><FormattedMessage id="create_app_keys_2" /></b>
              </p>
              <CreateAppForm onSubmit={this.handleFormSubmit} />
            </div>
          }
        </div>
        <Modal
          visible={this.state.visible}
          onCancel={this.hideModal}
          footer={false}
          className="Sign__authorize"
        >
          <SignForm
            roles={['active']}
            onSubmit={this.handleSignFormSubmit}
          />
        </Modal>
      </div>
    );
  }
}

export default injectIntl(CreateApp);
