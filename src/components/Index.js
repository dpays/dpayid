import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Form, Input, Button, Popover, Icon } from 'antd';
import * as actions from '../actions/appLocale';
import locales from '../../helpers/locales.json';
import './Index.less';

const LanguageItem = ({ setLocale, locale }) => (
  <li>
    <button onClick={() => setLocale(locale)}>
      {locales[locale]}
    </button>
  </li>
);
LanguageItem.propTypes = {
  setLocale: PropTypes.func,
  locale: PropTypes.string,
};

@connect(
  state => ({
    locale: state.appLocale.locale,
  }),
  dispatch =>
    bindActionCreators(
      {
        setLocale: actions.setLocale,
      },
      dispatch,
    ),
)
class Index extends React.Component {
  static propTypes = {
    form: PropTypes.shape(),
    intl: intlShape.isRequired,
    setLocale: PropTypes.func,
    locale: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { form: { getFieldDecorator }, setLocale, locale, intl } = this.props;
    return (
      <div>
        <div id="header">
          <img src="/img/macbook.png" id="macbook-img" alt="macbook" />
          <div className="lp-container">
            <div id="menu">
              <div className="menu-item logo">
                <img src="/img/logo_white.png" width="30px" id="logo" />
              </div>
              <div className="menu-item">
                <Popover
                  placement="bottom"
                  content={
                    <ul className="lp-language-select">
                      <LanguageItem locale="en" setLocale={setLocale} />
                      <LanguageItem locale="fr" setLocale={setLocale} />
                      <LanguageItem locale="ru" setLocale={setLocale} />
                      <LanguageItem locale="ko" setLocale={setLocale} />
                      <LanguageItem locale="zh" setLocale={setLocale} />
                    </ul>
                  }
                  trigger="click"
                >
                  <Button>{locales[locale]}<Icon type="down" /></Button>
                </Popover>
              </div>
            </div>
            <div className="hero">
              <h1 className="title"><FormattedMessage id="lp_hero_title" /></h1>
              <p className="sub-title"><FormattedMessage id="lp_hero_description" /></p>
              <a href="https://go.dpayid.io/login" rel="noreferrer noopener" className="btn btn-info btn-circle btn-translate--hover">
                <FormattedMessage id="lp_beta_login_button" />
              </a>

            </div>
            <object data="img/hero.svg" type="image/svg+xml" id="header-bg" />
          </div>
        </div>

        <div className="lp-container how-it-works">
          <span className="small-title">
            <FormattedMessage id="lp_section_1_tag" />
          </span>
          <h3><FormattedMessage id="lp_section_1_title" /></h3>
        </div>

        <div className="dpay-features-container">
          <div className="lp-container dpay-features">
            <div className="dpay-feature">
              <object data="img/apps.svg" type="image/svg+xml" />
              <strong className="feature-title">
                <FormattedMessage id="lp_feature_1_title" />
              </strong>
              <p className="feature-desc">
                <FormattedMessage id="lp_feature_1_description" />
              </p>
            </div>
            <div className="dpay-feature">
              <object data="img/account.svg" type="image/svg+xml" />
              <strong className="feature-title">
                <FormattedMessage id="lp_feature_2_title" />
              </strong>
              <p className="feature-desc">
                <FormattedMessage id="lp_feature_2_description" />
              </p>
            </div>
            <div className="dpay-feature">
              <object data="img/wallet.svg" type="image/svg+xml" />
              <strong className="feature-title">
                <FormattedMessage id="lp_feature_3_title" />
              </strong>
              <p className="feature-desc">
                <FormattedMessage id="lp_feature_3_description" />
              </p>
            </div>
          </div>
        </div>

        <div className="safe-secure-container">
          <div className="lp-container safe-secure">
            <div>
              <object data="img/lock.svg" type="image/svg+xml" />
            </div>
            <div>
              <span className="small-title">
                <FormattedMessage id="lp_section_2_tag" />
              </span>
              <h3><FormattedMessage id="lp_section_2_title" /></h3>
              <p><FormattedMessage id="lp_section_2_description" /></p>
            </div>
          </div>
        </div>

        <div className="lp-container learn-more">
          <span className="small-title">
            <FormattedMessage id="lp_section_3_tag" />
          </span>
          <h3><FormattedMessage id="lp_section_3_title" /></h3>
        </div>

        <div className="lp-container project">
          <div className="project-item">
            <object data="img/opensource.svg" type="image/svg+xml" />
            <div>
              <h4 className="project-title"><FormattedMessage id="lp_opensource_title" /></h4>
              <p><FormattedMessage id="lp_opensource_description" /></p>
              <a href="https://github.com/dpays/dpayid" target="_blank" rel="noreferrer noopener" className="btn btn-success btn-circle btn-translate--hover">
                <FormattedMessage id="lp_opensource_button" />
              </a>
            </div>
          </div>
          <div className="project-item">
            <object data="img/code.svg" type="image/svg+xml" />
            <div>
              <h4 className="project-title"><FormattedMessage id="lp_developers_title" /></h4>
              <p><FormattedMessage id="lp_developers_description" /></p>
              <Link to="/dashboard" className="btn btn-success btn-circle btn-translate--hover">
                <FormattedMessage id="lp_developers_button" />
              </Link>
            </div>
          </div>
        </div>

        <div className="get-started-container">
          <div className="lp-container get-started">
            <div>
              <h2><FormattedMessage id="lp_subscribe_title" /></h2>
              <p><FormattedMessage id="lp_subscribe_description" /></p>
            </div>
            <div>
              <a href="http://go.dpayid.io/login" rel="noopener noreferrer" target="_blank" className="btn btn-info btn-circle btn-translate--hover">
                <FormattedMessage id="lp_subscribe_button" />
              </a>
            </div>
          </div>
        </div>

        <div className="lp-container footer-menu">
          <ul>
            <li><FormattedMessage id="lp_footer" /></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Form.create()(
  injectIntl(Index)
);
