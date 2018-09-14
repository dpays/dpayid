import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import dpay from 'dpayjs';
import auth from './reducers/auth';
import appLocale from './reducers/appLocale';

const reducers = combineReducers({
  auth,
  appLocale,
});

if (process.env.DPAYD_URL) {
  dpay.api.setOptions({ url: process.env.DPAYD_URL });
}

const store = createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk),
);

export default store;
