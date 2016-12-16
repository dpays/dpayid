import * as appTypes from '../actions';

const initialState = {
  isFetching: false,
  isLoaded: false,
  errorMessage: '',
  sidebarIsVisible: true,
  locale: 'en',
  isPostModalOpen: false,
  lastPostId: null,
};

// TODO(p0o): some actionsTypes in this reducer are not defined anywhere, need to figure it out later

export default (state = initialState, action) => {
  switch (action.type) {
    case appTypes.FEED_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false
      });
    case appTypes.FEED_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: true
      });
    case appTypes.FEED_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: true
      });
    case appTypes.CONTENT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false
      });
    case appTypes.CONTENT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: true
      });
    case appTypes.ACCOUNT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false
      });
    case appTypes.ACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: true
      });
    case appTypes.CONFIG_SUCCESS:
      return Object.assign({}, state, {
        config: action.config
      });

    case appTypes.SHOW_SIDEBAR:
      return Object.assign({}, state, {
        sidebarIsVisible: true
      });

    case appTypes.HIDE_SIDEBAR:
      return {
        ...state,
        sidebarIsVisible: false,
      };

    case appTypes.SET_LOCALE:
      return {
        ...state,
        locale: action.payload.locale,
      };
    case appTypes.OPEN_POST_MODAL:
      return {
        ...state,
        isPostModalOpen: true,
        lastPostId: action.payload,
      };
    case appTypes.CLOSE_POST_MODAL:
      return {
        ...state,
        isPostModalOpen: false,
        lastPostId: null,
      };
    default:
      return state;
  }
};
