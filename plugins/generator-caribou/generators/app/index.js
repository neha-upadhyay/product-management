'use strict';

/*
Generates new features to jump right in quicker.
*/
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
// require("html-wiring").readFileAsString();
var common = require('../common');

function toUnderscore(input) {
  // only process camel case to underscore if there are some lowercase characters
  if (input.match(/[a-z]/g)) {
    return input.replace(/(?:^|\.?)([A-Z])/g, (x, y) => `_${y.toLowerCase()}`).replace(/^_/, '');
  }
  return input;
}

module.exports = yeoman.Base.extend({

  paths() {
    // Move template dir up a level
    common.setAlternativeTemplatePath.call(this);
  },

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      `Welcome to the peachy ${chalk.red('caribou')} generator!`
    ));

    var prompts = [
      {
        type: 'list',
        name: 'ancestor',
        message: 'Please choose ancestor for this feature',
        default: 'core',
        choices: [{
          name: 'core',
          value: 'core'
        }, {
          name: 'card',
          value: 'card'
        }, {
          name: 'bank',
          value: 'bank'
        }]
      },
      {
        type: 'input',
        name: 'featureName',
        message: 'What is the new feature name?',
        default: 'environmentSelect'
        // default: this.appname
      },
      {
        type: 'input',
        name: 'path',
        message: 'What is the ancestry? i.e. card.account for the card home feature',
        default: 'core.devTools',
        validate(input, props) {
          var root = input.split('.')[0];
          if (props.ancestor === root) {
            return true;
          }
          return `Root entry [${root}] must equal ancestor choice [${props.ancestor}]`;
        }
      },
      {
        type: 'confirm',
        name: 'screen',
        message: 'Would you like to generate a screen?',
        default: true
      },
      {
        type: 'confirm',
        name: 'reducer',
        message: 'Would you like to generate a reducer?',
        default: true
      },
      {
        type: 'confirm',
        name: 'action',
        message: 'Would you like to generate an action creator?',
        default: true
      },
      {
        type: 'confirm',
        name: 'api',
        message: 'Would you like to generate an api?',
        default: true
      },
      {
        type: 'input',
        name: 'apiUrl',
        message: 'What is the api endoint?',
        default: 'https://mapi.discoverbank.com/api/accounts/unmasked/',
        validate(input, props) {
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
        when(props) {
          return props.api === true;
        }
      },
      {
        type: 'confirm',
        name: 'isMockData',
        message: 'Would you like to provide mocked data for this api?',
        default: true,
        when(props) {
          return props.api === true;
        }
      },
      {
        type: 'input',
        name: 'mockData',
        message: 'What is the mocked data?',
        default: '[{"id":"0","nickName":"DP CASHBACK CHECKING","accountNumber":{"full":"1234567890","formatted":"1234567890"},"routingNumber":"031100649"},{"id":"1","nickName":"DP PREMIUM SAVINGS","accountNumber":{"full":"9876543210","formatted":"9876543210"},"routingNumber":"031100649"}]',
        validate(input, props) {
          if (!input) {
            return 'You must supply some value';
          }
          return true;
        },
        when(props) {
          return props.isMockData === true;
        }
      },
      {
        type: 'input',
        name: 'apiActionCreatorFunctionName',
        message: 'What is the name for the action creator function?',
        default: 'getUnmaskedAccounts',
        validate(input) {
          if (!input) {
            return 'You must supply some value';
          }
          return true;
        },
        when(props) {
          return props.api === true;
        }
      },
      {
        type: 'input',
        name: 'apiActionConstant',
        validate(input) {
          if (!input) {
            return 'You must supply some value';
          }
          return true;
        },
        default(props) {
          return toUnderscore(props.apiActionCreatorFunctionName).toUpperCase();
        },
        message(props) {
          return `What is the constant used as the API action for REQUEST, SUCCESS, and FAIL? e.g. pick a name that will appear ${props.ancestor.toUpperCase()}_[here]_REQUEST:`;
        },
        when(props) {
          return props.api === true;
        }
      }
    ];

    return this.prompt(prompts).then((props) => {
      // To access props later use this.props.someAnswer;
      var capitalizedFeature = props.featureName.charAt(0).toUpperCase() + props.featureName.slice(1);
      var camelCaseFeature = props.featureName.charAt(0).toLowerCase() + props.featureName.slice(1);

      if (props.api === true) {
        var relativeUrlIfNecessary = props.apiUrl.replace('https://mapi.discoverbank.com/', '');
        relativeUrlIfNecessary = relativeUrlIfNecessary.replace('https://mapi.discovercard.com/', '');
        props.apiUrl = relativeUrlIfNecessary;
        props.requestConstant = `${props.ancestor.toUpperCase()}_${toUnderscore(props.apiActionConstant).toUpperCase()}_REQUEST`;
        props.successConstant = `${props.ancestor.toUpperCase()}_${toUnderscore(props.apiActionConstant).toUpperCase()}_SUCCESS`;
        props.failConstant = `${props.ancestor.toUpperCase()}_${toUnderscore(props.apiActionConstant).toUpperCase()}_FAIL`;
      }

      if (props.screen === true) {
        props.screenNameConstant = `${props.ancestor.toUpperCase()}_${toUnderscore(camelCaseFeature).toUpperCase()}_SCREEN`;
      }
      props.capitalizedFeature = capitalizedFeature;
      props.camelCaseFeature = camelCaseFeature;
      props.screenName = `${capitalizedFeature}Screen`;
      props.actionName = `${camelCaseFeature}Actions`;
      props.apiName = `${capitalizedFeature}Api`;
      props.reducerName = `${camelCaseFeature}Reducer`;
      props.isCard = props.ancestor === 'card';
      props.isBank = props.ancestor === 'bank';
      props.isCore = props.ancestor === 'core';
      props.ancestorUppercase = props.ancestor.toUpperCase();
      this.props = props;
      // this.log(this.props);
    });
  },

  writing() {
    // this.log(this.props.path);
    if (this.props.path.split('.')[0] !== this.props.ancestor) {
      throw (`Ancestor ${this.props.ancestor} and path ${this.props.path.split('.')[0]} must be the same`);
    }

    var dir = `js/${this.props.path.split('.').join('/')}/${this.props.camelCaseFeature}/`;
    var testDir = `${dir}__tests__/`;

    var pathToJS = '../';
    this.props.path.split('.').forEach((item) => {
      pathToJS = `${pathToJS}../`;
    });
    var testPathToJS = `../${pathToJS}`;
    // this.log(yosay('Path to js: ' + pathToJS));

    var screenPath = `${dir + this.props.screenName}.js`;
    var actionPath = `${dir + this.props.actionName}.js`;
    var apiPath = `${dir + this.props.apiName}.js`;
    var reducerPath = `${dir + this.props.reducerName}.js`;

    var screenTestPath = `${testDir + this.props.screenName}-test.js`;
    var actionTestPath = `${testDir + this.props.actionName}-test.js`;
    var apiTestPath = `${testDir + this.props.apiName}-test.js`;
    var reducerTestPath = `${testDir + this.props.reducerName}-test.js`;

    var cacheClearConstant;
    if (this.props.isCard) {
      cacheClearConstant = 'CARD_CLEAR_CACHE';
    } else if (this.props.isBank) {
      cacheClearConstant = 'BANK_CLEAR_CACHE';
    } else if (this.props.isCore) {
      cacheClearConstant = 'CORE_CLEAR_CACHE';
    }

    var reducerStateTree = `${this.props.path}.${this.props.camelCaseFeature}`;

    if (this.props.screen) {
      this.fs.copyTpl(
        this.templatePath('DummyScreen.js'),
        this.destinationPath(screenPath),
        {
          screenName: this.props.screenName,
          actionName: this.props.actionName,
          action: this.props.action,
          api: this.props.api,
          pathToJS,
          reducerStateTree,
          apiActionCreatorFunctionName: this.props.apiActionCreatorFunctionName
        }
      );
      // Don't generate Screen-test until further notice as it doesn't really accomplish much
      /*
      this.fs.copyTpl(
        this.templatePath('tests/DummyScreen-test.js'),
        this.destinationPath(screenTestPath),
        {
          screenName: this.props.screenName,
          testPathToJS,
          reducerStateTree: reducerStateTree.split('.'),
          reducerStateTreeString: reducerStateTree,
          apiActionCreatorFunctionName: this.props.apiActionCreatorFunctionName,
          actionName: this.props.actionName
        }
      );
      */
    }

    if (this.props.action) {
      this.fs.copyTpl(
        this.templatePath('dummyActions.js'),
        this.destinationPath(actionPath),
        {
          apiName: this.props.apiName,
          api: this.props.api,
          ancestor: this.props.ancestor,
          apiActionConstant: this.props.apiActionConstant,
          requestConstant: this.props.requestConstant,
          successConstant: this.props.successConstant,
          failConstant: this.props.failConstant,
          apiActionCreatorFunctionName: this.props.apiActionCreatorFunctionName,
          pathToJS
        }
      );

      this.fs.copyTpl(
        this.templatePath('tests/dummyActions-test.js'),
        this.destinationPath(actionTestPath),
        {
          actionName: this.props.actionName,
          apiName: this.props.apiName,
          api: this.props.api,
          testPathToJS,
          requestConstant: this.props.requestConstant,
          successConstant: this.props.successConstant,
          failConstant: this.props.failConstant,
          apiActionCreatorFunctionName: this.props.apiActionCreatorFunctionName
        }
      );
    }

    if (this.props.api) {
      this.fs.copyTpl(
        this.templatePath('DummyApi.js'),
        this.destinationPath(apiPath),
        {
          apiName: this.props.apiName,
          apiType: this.props.isBank ? 'BankApi' : 'CardApi',
          apiActionCreatorFunctionName: this.props.apiActionCreatorFunctionName,
          apiUrl: this.props.apiUrl,
          pathToJS
        }
      );

      this.fs.copyTpl(
        this.templatePath('tests/DummyApi-test.js'),
        this.destinationPath(apiTestPath),
        {
          apiName: this.props.apiName,
          testPathToJS,
          apiUrl: this.props.apiUrl,
          apiActionCreatorFunctionName: this.props.apiActionCreatorFunctionName
        }
      );
    }

    if (this.props.reducer) {
      this.fs.copyTpl(
        this.templatePath('dummyReducer.js'),
        this.destinationPath(reducerPath),
        {
          reducerName: this.props.reducerName,
          api: this.props.api,
          requestConstant: this.props.requestConstant,
          successConstant: this.props.successConstant,
          failConstant: this.props.failConstant,
          ancestorUppercase: this.props.ancestorUppercase,
          pathToJS
        }
      );

      this.fs.copyTpl(
        this.templatePath('tests/dummyReducer-test.js'),
        this.destinationPath(reducerTestPath),
        {
          reducerName: this.props.reducerName,
          testPathToJS,
          requestConstant: this.props.requestConstant,
          successConstant: this.props.successConstant,
          ancestorUppercase: this.props.ancestorUppercase,
          failConstant: this.props.failConstant,
          cacheClearConstant
        }
      );
    }

    if (this.props.isMockData) {
      var mockPath = `js/mocks/data/${this.props.ancestor}${this.props.capitalizedFeature}.js`;
      this.fs.copyTpl(
        this.templatePath('mocks/dummyMock.js'),
        this.destinationPath(mockPath),
        {
          name: this.props.ancestor + this.props.capitalizedFeature,
          data: this.props.mockData
        }
      );
    }

    // apparently all of these class members are called after prompt
    // this.updateConstants();
    // this.updateParentRoutes();
    // this.updateParentReducer();
    // this.updateMockData();
  },

  updateParentRoutes() {
    common.updateParentRoutes.call(this, 1);
  },

  updateParentReducer() {
    common.updateParentReducer.call(this);
  },

  updateMockData() {
    common.updateMockData.call(this);
  },

  updateConstants() {
    common.updateConstants.call(this);
  },

  install() {
    common.goodbye.call(this);
  }
});
