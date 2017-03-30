/*
v0.4 action template
*/
'use strict';

<% if (api) { %>
const {
  <%= requestConstant %>,
  <%= successConstant %>,
  <%= failConstant %>,

  // #===== yeoman import hook =====#
  // The above line is required for our yeoman generator and should not be changed!
} = require('<%= pathToJS %>lib/constants').default;

import <%= apiName %> from './<%= apiName %>';
export function <%= apiActionCreatorFunctionName %>() {
  return {
    types: [<%= requestConstant %>, <%= successConstant %>, <%= failConstant %>],
    networkPromise: apiConfig => new <%= apiName %>(apiConfig).<%= apiActionCreatorFunctionName %>()
  };
}
<% } %>
// #===== yeoman actionCreator hook =====#
// The above line is required for our yeoman generator and should not be changed!
