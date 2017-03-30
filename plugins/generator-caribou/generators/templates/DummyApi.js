/*
v0.1 api template
*/
'use strict';

import <%= apiType %> from '<%= pathToJS %>lib/network/<%= apiType %>';

export default class <%= apiName %> extends <%= apiType %> {
  <%= apiActionCreatorFunctionName %>() {
    return this.fetch({
      url: '<%= apiUrl %>',
    });
  }

  // #===== yeoman hook =====#
  // The above line is required for our yeoman generator and should not be changed!
}
