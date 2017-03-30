'use strict';

/*
Generates additional screen to existing feature to jump right in quicker.
TODO:
 - Update parent routes
 - Update existing reducer
 - Update existing api
 - Update existing actions
 - Update existing constants file
*/
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var common = require('../common');
// require("html-wiring").readFileAsString();

function toUnderscore(input) {
  // only process camel case to underscore if there are some lowercase characters
  if (input.match(/[a-z]/g)) {
    return input.replace(/(?:^|\.?)([A-Z])/g, function (x, y){
      return "_" + y.toLowerCase()
    }).replace(/^_/, "");
  }
  return input;
}

function getPath(inPath, suffix) {
    var pathArr = inPath.split('.');
    var parent = pathArr[pathArr.length - 1];
    var parentDir = pathArr.slice(0, pathArr.length - 1).join('/');
    return 'js/' + parentDir + '/' + parent + '/' + parent + suffix + '.js';
}

module.exports = yeoman.Base.extend({

  paths: function () {
    // Move template dir up a level
    common.setAlternativeTemplatePath.call(this);
  },

  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the peachy ' + chalk.red('caribou') + ' generator!'
    ));

    var prompts = [
      {
        type: 'list',
        name: 'ancestor',
        message: 'Please choose ancestor for this feature',
        default: 'bank',
        choices:[{
          name: 'core',
          value: 'core',
        },{
          name: 'card',
          value: 'card',
        },{
          name: 'bank',
          value: 'bank',
        }]
      },
      {
        type: 'confirm',
        name: 'isModal',
        message: 'Is this a modal screen?',
        default: false
      },
      {
        type: 'input',
        name: 'screenName',
        message: 'What is the screen name?',
        default: function(props) {
          return 'AccountNumber2' + (props.isModal ? 'Modal' : 'Screen');
        },
        validate: function(input, props) {
          if (input[0] === input[0].toLowerCase()) {
            return 'Screens must start with a capital letter';
          }
          if (!props.isModal && !input.endsWith('Screen')) {
            return 'All screens must end with the term Screen';
          }
          if (props.isModal && !input.endsWith('Modal')) {
            return 'All modal screens must end with the term Modal';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'path',
        message: 'What is the ancestry? i.e. card.account for the card home feature',
        default: 'bank.account.accountNumber',
        validate: function(input, props) {
          var root = input.split('.')[0]
          if (props.ancestor === root) {
            return true;
          }
          return 'Root entry [' + root + '] must equal ancestor choice [' + props.ancestor + ']';
        }
      },
      {
        type: 'confirm',
        name: 'api',
        message: 'Do you have an api call to add?',
        default: true
      },
      {
        type: 'input',
        name: 'apiUrl',
        message: 'What is the api endoint?',
        default: 'https://mapi.discoverbank.com/api/accounts/unmasked2/',
        validate: function(input, props) {
          if (!input) {
            return 'You must supply some value';
          }
          if (input.includes('mapi.discoverbank.com') && props.ancestor === 'card') {
            return 'You should not have card APIs making bank requests';
          }
          if (input.includes('mapi.discovercard.com') && props.ancestor === 'bank') {
            return 'You should not have bank APIs making card requests';
          }
          if (input.includes('http://')) {
            return 'You should not be making non-secure api calls, at least not from this generator';
          }
          return true;
        },
        when: function(props) {
          return props.api === true
        }
      },
      {
        type: 'confirm',
        name: 'isMockData',
        message: 'Would you like to provide mocked data for this api?',
        default: true,
        when: function(props) {
          return props.api === true
        }
      },
      {
        type: 'input',
        name: 'mockData',
        message: 'What is the mocked data?',
        default: '[{"id":"0","nickName":"DP CASHBACK CHECKING","accountNumber":{"full":"1234567890","formatted":"1234567890"},"routingNumber":"031100649"},{"id":"1","nickName":"DP PREMIUM SAVINGS","accountNumber":{"full":"9876543210","formatted":"9876543210"},"routingNumber":"031100649"}]',
        validate: function(input, props) {
          if (!input) {
            return 'You must supply some value';
          }
          return true;
        },
        when: function(props) {
          return props.isMockData === true
        }
      },
      {
        type: 'input',
        name: 'apiActionCreatorFunctionName',
        message: 'What is the name for the action creator function?',
        default: 'getUnmaskedAccounts2',
        validate: function(input) {
          if (!input) {
            return 'You must supply some value';
          }
          return true;
        },
        when: function(props) {
          return props.api === true
        }
      },
      {
        type: 'input',
        name: 'apiActionConstant',
        validate: function(input) {
          if (!input) {
            return 'You must supply some value';
          }
          return true;
        },
        default: function(props) {
          return toUnderscore(props.apiActionCreatorFunctionName).toUpperCase();
        },
        message: function(props) {
          return 'What is the constant used as the API action for REQUEST, SUCCESS, and FAIL? e.g. pick a name that will appear ' + props.ancestor.toUpperCase() + '_[here]_REQUEST:';
        },
        when: function(props) {
          return props.api === true
        }
      },
    ];

    return this.prompt(prompts).then(function (props) {

      var pathArr = props.path.split('.');
      var parent = pathArr[pathArr.length - 1];

      props['isCard'] = props.ancestor === 'card';
      props['isBank'] = props.ancestor === 'bank';
      props['isCore'] = props.ancestor === 'core';
      props.screenNameConstant = props.ancestor.toUpperCase() + '_' + toUnderscore(props.screenName).toUpperCase();

      var tempReducerName = props.screenName.charAt(0).toLowerCase() + props.screenName.slice(1);
      if (props.isModal) {
        props.stateNode = tempReducerName.substring(0, tempReducerName.indexOf('Modal'));
      } else {
        props.stateNode = tempReducerName.substring(0, tempReducerName.indexOf('Screen'));
      }
      console.log('parent: ' + parent);
      props.apiFileName = parent.charAt(0).toUpperCase() + parent.slice(1) + 'Api';
      console.log('apiFileName: ' + props.apiFileName);

      if (props.api === true) {
        var relativeUrlIfNecessary = props.apiUrl.replace('https://mapi.discoverbank.com/', '');
        relativeUrlIfNecessary = relativeUrlIfNecessary.replace('https://mapi.discovercard.com/', '');
        props['apiUrl'] = relativeUrlIfNecessary;
        props.requestConstant = props.ancestor.toUpperCase() + '_' + toUnderscore(props.apiActionConstant).toUpperCase() + '_REQUEST';
        props.successConstant = props.ancestor.toUpperCase() + '_' + toUnderscore(props.apiActionConstant).toUpperCase() + '_SUCCESS';
        props.failConstant = props.ancestor.toUpperCase() + '_' + toUnderscore(props.apiActionConstant).toUpperCase() + '_FAIL';
      }

      props.screen = true;
      this.props = props;
      // this.log(this.props);
    }.bind(this));
  },

  writing: function () {
    var dir = 'js/' + this.props.path.split('.').join('/') + '/';

    // var pathToJS = '../';
    var pathToJS = '';
    this.props.path.split('.').forEach(function(item) {
      pathToJS = pathToJS + '../';
    });
    var testPathToJS = '../' + pathToJS;
    // this.log(yosay('Path to js: ' + pathToJS));

    var screenPath = dir + this.props.screenName + '.js'

    this.fs.copyTpl(
      this.templatePath(this.props.isModal ? 'DummyModal.js' : 'DummyScreen.js'),
      // this.templatePath('DummyScreen.js'),
      this.destinationPath(screenPath),
      {
        screenName: this.props.screenName,
        pathToJS: pathToJS,
        action: null,
        api: this.props.api,
        actionName: null,
        reducerStateTree: null,
        apiActionCreatorFunctionName: null,
      }
    );

    // this.fs.copyTpl(
    //   this.templatePath('tests/DummyScreen-test.js'),
    //   this.destinationPath(screenTestPath),
    //   {
    //     screenName: this.props.screenName,
    //     testPathToJS: testPathToJS,
    //     reducerStateTree: reducerStateTree.split('.'),
    //     reducerStateTreeString: reducerStateTree,
    //     apiActionCreatorFunctionName: this.props.apiActionCreatorFunctionName,
    //     actionName: this.props.actionName,
    //   }
    // );
  },
  updateExistingApi: function() {
    common.updateExistingApi.call(this);
  },
  updateExistingAction: function() {
    common.updateExistingAction.call(this);
  },

  updateExistingReducer: function() {
    common.updateExistingReducer.call(this);
  },

  updateParentRoutes: function() {
    common.updateParentRoutes.call(this, 2);
  },

  updateConstants: function() {
    common.updateConstants.call(this);
  },

  updateMockData: function() {
    common.updateMockData.call(this);
  },

  goodbye: function () {
    common.goodbye.call(this);
  }
});
