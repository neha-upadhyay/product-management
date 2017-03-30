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

module.exports = yeoman.Base.extend({

  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the peachy ' + chalk.red('caribou') + ' generator!'
    ));

    var prompts = [
      {
        type: 'list',
        name: 'ancestor',
        message: 'Please enter the path to ancestor for this feature',
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
        type: 'input',
        name: 'screenName',
        message: 'What is the screen name?',
        default: 'AtmLocatorScreen',
        validate: function(input) {
          if (input[0] === input[0].toLowerCase()) {
            return 'Screens must start with a capital letter';
          }
          if (!input.endsWith('Screen')) {
            return 'All screens must end with the term Screen';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'path',
        message: 'What is the ancestry? i.e. card.account for the card home feature',
        default: 'bank.atm.atmLocator',
        validate: function(input, props) {
          var root = input.split('.')[0]
          if (props.ancestor === root) {
            return true;
          }
          return 'Root entry [' + root + '] must equal ancestor choice [' + props.ancestor + ']';
        }
      },
      {
        type: 'input',
        name: 'apiUrl',
        message: 'What is the api endoint?',
        default: 'https://maps.google.com/maps/api/geocode/json?address=Mundelein,%20IL&ka=&sensor=false&client=gme-discoverfinancial&signature=LHb0SFRaWaZ29Z108s8iXiiOzfs=',
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
        }
      },
      {
        type: 'input',
        name: 'apiActionCreatorFunctionName',
        message: 'What is the name for the action creator function?',
        default: 'getAutocompleteLocations',
        validate: function(input) {
          if (!input) {
            return 'You must supply some value';
          }
          return true;
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
      props.stateNode = tempReducerName.substring(0, tempReducerName.indexOf('Screen'));
      console.log('parent: ' + parent);
      props.apiFileName = parent.charAt(0).toUpperCase() + parent.slice(1) + 'Api';
      console.log('apiFileName: ' + props.apiFileName);

      var relativeUrlIfNecessary = props.apiUrl.replace('https://mapi.discoverbank.com/', '');
      relativeUrlIfNecessary = relativeUrlIfNecessary.replace('https://mapi.discovercard.com/', '');
      props['apiUrl'] = relativeUrlIfNecessary;
      props.requestConstant = props.ancestor.toUpperCase() + '_' + toUnderscore(props.apiActionConstant).toUpperCase() + '_REQUEST';
      props.successConstant = props.ancestor.toUpperCase() + '_' + toUnderscore(props.apiActionConstant).toUpperCase() + '_SUCCESS';
      props.failConstant = props.ancestor.toUpperCase() + '_' + toUnderscore(props.apiActionConstant).toUpperCase() + '_FAIL';

      // Because it's api
      props.api = true;
      props.screene = false;

      this.props = props;
      // this.log(this.props);
    }.bind(this));
  },

  writing: function () {
    var dir = 'js/' + this.props.path.split('.').join('/') + '/';

    var pathToJS = '../';
    this.props.path.split('.').forEach(function(item) {
      pathToJS = pathToJS + '../';
    });
    var testPathToJS = '../' + pathToJS;
    // this.log(yosay('Path to js: ' + pathToJS));

    var screenPath = dir + this.props.screenName + '.js'


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

  updateConstants: function() {
    common.updateConstants.call(this);
  },

  updateMockData: function() {
    // //TODO fully wire up mocked data
    // var path = "js/mocks/profiles/happyPath.js";
    // var hook = '// #===== yeoman hook =====#';
    // var file = this.readFileAsString(path);
    // var constant = this.props.requestConstant;
    //
    // var insert = constant + ': null,';
    // if (file.indexOf(constant) === -1) {
    //   this.write(path, file.replace(hook, insert+"\n"+hook));
    // }
  },

  goodbye: function () {
    common.goodbye.call(this);
  }
});
