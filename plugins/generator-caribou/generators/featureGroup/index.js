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
        message: 'Please choose ancestor for this feature grouping',
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
        name: 'path',
        message: 'What is full path of this feature group?',
        default: 'bank.transfer',
        validate: function(input, props) {
          if (!input) {
            return 'You must supply some value';
          }
          var root = input.split('.')[0]
          if (props.ancestor !== root) {
            return 'Root entry [' + root + '] must equal ancestor choice [' + props.ancestor + ']';
          }
          return true;
        }
      },
    ];

    return this.prompt(prompts).then(function (props) {

      var pathArr = props.path.split('.');
      var parent = pathArr[pathArr.length - 2];
      props.parent = parent;

      props['isCard'] = props.ancestor === 'card';
      props['isBank'] = props.ancestor === 'bank';
      props['isCore'] = props.ancestor === 'core';
      props.featureGrouping = pathArr[pathArr.length - 1];

      var dir = 'js/' + pathArr.join('/') + '/';
      var parentDir = 'js/' + pathArr.slice(0, pathArr.length - 1).join('/') + '/';
      props.reducerPath = dir + props.featureGrouping + 'Reducer.js';
      props.routePath = dir + props.featureGrouping + 'Routes.js';
      props.parentPath = parentDir;
      props.routeImportName = props.featureGrouping + 'Routes';
      props.reducerImportName = props.featureGrouping + 'Reducer';

      this.props = props;
      // this.log(this.props);
    }.bind(this));
  },

  writing: function () {

    this.fs.copy(
      this.templatePath('dummyRoutes.js'),
      this.destinationPath(this.props.routePath)
    );

    this.fs.copy(
      this.templatePath('dummyReducers.js'),
      this.destinationPath(this.props.reducerPath)
    );

    // console.log(this.props);

  },
  updateParentRoutes: function() {
    var path = this.props.parentPath + this.props.parent + 'Routes.js';
    var importHook = '// #===== yeoman import hook =====#';
    var routeHook = '// #===== yeoman route hook =====#';

    var insertImport = "import * as " + this.props.routeImportName + " from './" + this.props.featureGrouping + "/" + this.props.routeImportName + "';";
    var insertRoutes = "..." + this.props.routeImportName + ",";

    var file = this.readFileAsString(path);

    if (file.indexOf(insertImport) === -1) {
      file = file.replace(importHook, insertImport+'\n'+importHook);
    }

    if (file.indexOf(insertRoutes) === -1) {
      file = file.replace(routeHook, insertRoutes+'\n\t'+routeHook);
    }

    this.write(path, file);
  },
  updateParentReducers: function() {
    var path = this.props.parentPath + this.props.parent + 'Reducers.js';
    var importHook = '// #===== yeoman import hook =====#';
    var reducerHook = '// #===== yeoman reducer hook =====#';

    var insertImport = "import " + this.props.reducerImportName + " from './" + this.props.featureGrouping +"/" + this.props.reducerImportName + "';";
    var insertReducer = this.props.featureGrouping + ": " + this.props.reducerImportName + ",";

    var file = this.readFileAsString(path);

    if (file.indexOf(insertImport) === -1) {
      file = file.replace(importHook, insertImport+'\n'+importHook);
    }

    if (file.indexOf(insertReducer) === -1) {
      file = file.replace(reducerHook, insertReducer+'\n\t'+reducerHook);
    }

    this.write(path, file);
  },

  goodbye: function () {
    common.goodbye.call(this);
  }
});
