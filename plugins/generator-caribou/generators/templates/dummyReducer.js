/*
v0.2 reducer template
*/
import { requestHelper, successHelper, failHelper } from '<%= pathToJS %>lib/utils/reducer';
const {
  <%= requestConstant %>,
  <%= successConstant %>,
  <%= failConstant %>,

  <%= ancestorUppercase %>_CLEAR_CACHE,
  // #===== yeoman import hook =====#
  // The above line is required for our yeoman generator and should not be changed!
} = require('<%= pathToJS %>lib/constants').default;

export const initialState = {
};

export default function <%= reducerName %>(state = initialState, action = {}) {
  switch (action.type) {
<% if (api) { %>
    case <%= requestConstant %>:
      return requestHelper(state);
    case <%= successConstant %>:
      return successHelper(state, action.payload);
    case <%= failConstant %>:
      return failHelper(state, action.payload);
<% } %>
    case <%= ancestorUppercase %>_CLEAR_CACHE:
      return initialState;
// #===== yeoman conditional hook =====#
// The above line is required for our yeoman generator and should not be changed!
    default:
      return state;
  }
}
