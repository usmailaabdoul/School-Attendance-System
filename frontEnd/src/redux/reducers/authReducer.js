const INITIAL_STATE = {
    token: '',
    user: {}
};

const AuthReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export default AuthReducer;
