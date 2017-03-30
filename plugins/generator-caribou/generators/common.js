var chalk = require('chalk');
var yosay = require('yosay');

function getPath(inPath, suffix) {
  var pathArr = inPath.split('.');
  var parent = pathArr[pathArr.length - 1];
  var parentDir = pathArr.slice(0, pathArr.length - 1).join('/');
  return `js/${parentDir}/${parent}/${parent}${suffix}.js`;
}

function setAlternativeTemplatePath() {
  var root = this.sourceRoot();
  var rootArray;
  if (root.indexOf('/') === -1) {
    // windows
    rootArray = root.split('\\');
  } else {
    rootArray = root.split('/');
  }
  var templateDir = `${rootArray.slice(0, rootArray.length - 2).join('/')}/templates`;
  this.sourceRoot(templateDir);
}

function updateExistingApi() {
  if (!this.props.api) {
    return;
  }
  var path = getPath(this.props.path, 'Api');
  var file = this.readFileAsString(path);

  var hook = '// #===== yeoman hook =====#';
  var insert = `${this.props.apiActionCreatorFunctionName}() {\n\t\treturn this.fetch({\n\t\t\turl: '${this.props.apiUrl}',\n\t\t});\n\t}`;

  if (file.indexOf(this.props.apiActionCreatorFunctionName) === -1) {
    file = file.replace(hook, `${insert}\n\t${hook}`);
    this.write(path, file);
  }
}

function updateExistingAction() {
  if (!this.props.api) {
    return;
  }
  var path = getPath(this.props.path, 'Actions');
  var file = this.readFileAsString(path);

  var importHook = '// #===== yeoman import hook =====#';
  var insertA = `${this.props.requestConstant},`;
  var insertB = `${this.props.successConstant},`;
  var insertC = `${this.props.failConstant},`;
  if (file.indexOf(insertA) === -1) {
    file = file.replace(importHook, `${insertA}\n\t${importHook}`);
  }
  if (file.indexOf(insertB) === -1) {
    file = file.replace(importHook, `${insertB}\n\t${importHook}`);
  }
  if (file.indexOf(insertC) === -1) {
    file = file.replace(importHook, `${insertC}\n\t${importHook}`);
  }

  if (file.indexOf(this.props.apiActionCreatorFunctionName) === -1) {
    var actionHook = '// #===== yeoman actionCreator hook =====#';
    var insert = `export function ${this.props.apiActionCreatorFunctionName}() {\n\treturn dispatch => {\n\t\tdispatch({\n\t\t\t`;
    insert = `${insert}types: [${this.props.requestConstant}, ${this.props.successConstant}, ${this.props.failConstant}],\n\t\t\t`;
    insert = `${insert}networkPromise: (apiConfig) => new ${this.props.apiFileName}(apiConfig).${this.props.apiActionCreatorFunctionName}()\n\t\t});\n\t};\n}`;
    file = file.replace(actionHook, `${insert}\n${actionHook}`);
  }

  this.write(path, file);
}

function updateExistingReducer() {
  if (!this.props.api) {
    return;
  }

  var path = getPath(this.props.path, 'Reducer');
  var file = this.readFileAsString(path);
  var importHook = '// #===== yeoman import hook =====#';
  var insertA = `${this.props.requestConstant},`;
  var insertB = `${this.props.successConstant},`;
  var insertC = `${this.props.failConstant},`;
  if (file.indexOf(insertA) === -1) {
    file = file.replace(importHook, `${insertA}\n\t${importHook}`);
  }
  if (file.indexOf(insertB) === -1) {
    file = file.replace(importHook, `${insertB}\n\t${importHook}`);
  }
  if (file.indexOf(insertC) === -1) {
    file = file.replace(importHook, `${insertC}\n\t${importHook}`);
  }

  var conditionalHook = '// #===== yeoman conditional hook =====#';

  var conditionalA = `\t\tcase ${this.props.requestConstant}:\n\t\t\treturn requestHelper(state, '${this.props.stateNode}');`;
  var conditionalB = `\t\tcase ${this.props.successConstant}:\n\t\t\treturn successHelper(state, action.payload, '${this.props.stateNode}');`;
  var conditionalC = `\t\tcase ${this.props.failConstant}:\n\t\t\treturn failHelper(state, action.payload, '${this.props.stateNode}');`;

  var conditionalAValid = file.indexOf(`case ${this.props.requestConstant}`) === -1;
  var conditionalBValid = file.indexOf(`case ${this.props.successConstant}`) === -1;
  var conditionalCValid = file.indexOf(`case ${this.props.failConstant}`) === -1;

  if (conditionalAValid) {
    file = file.replace(conditionalHook, `${conditionalA}\n${conditionalHook}`);
  }
  if (conditionalBValid) {
    file = file.replace(conditionalHook, `${conditionalB}\n${conditionalHook}`);
  }
  if (conditionalCValid) {
    file = file.replace(conditionalHook, `${conditionalC}\n${conditionalHook}`);
  }

  this.write(path, file);
}

function updateConstants() {
  var hook = '// #===== yeoman hook =====#';
  var pathMap = {
    card: {
      route: 'js/lib/constants/cardScreenConstants.js',
      action: 'js/lib/constants/cardActionConstants.js'
    },
    bank: {
      route: 'js/lib/constants/bankScreenConstants.js',
      action: 'js/lib/constants/bankActionConstants.js'
    },
    core: {
      route: 'js/lib/constants/coreScreenConstants.js',
      action: 'js/lib/constants/coreActionConstants.js'
    }
  };

    // Update constnats
  if (this.props.api) {
    var path = pathMap[this.props.ancestor].action;
    var file = this.readFileAsString(path);
      // var insert = this.props.requestConstant + ": null,\n\t" + this.props.successConstant + ": null,\n\t" + this.props.failConstant + ": null,\n";
    var insertA = `${this.props.requestConstant}: null,`;
    var insertB = `${this.props.successConstant}: null,`;
    var insertC = `${this.props.failConstant}: null,`;
    if (file.indexOf(insertA) === -1) {
      file = file.replace(hook, `${insertA}\n\t${hook}`);
    }
    if (file.indexOf(insertB) === -1) {
      file = file.replace(hook, `${insertB}\n\t${hook}`);
    }
    if (file.indexOf(insertC) === -1) {
      file = file.replace(hook, `${insertC}\n\t${hook}`);
    }
    this.write(path, file);
  }

  if (this.props.screen) {
    var path = pathMap[this.props.ancestor].route;
    var file = this.readFileAsString(path);
    var insert = `${this.props.screenNameConstant}: null,`;
    if (file.indexOf(insert) === -1) {
      file = file.replace(hook, `${insert}\n\t${hook}`);
    }
    this.write(path, file);
  }
}

function updateParentRoutes(depth) {
  var pathArr = this.props.path.split('.');
  var parent = pathArr[pathArr.length - depth];
  var parentDir = pathArr.slice(0, pathArr.length - depth).join('/');
  var path = `js/${parentDir}/${parent}/${parent}Routes.js`;

  var importHook = '// #===== yeoman import hook =====#';
  var routeHook = '// #===== yeoman route hook =====#';

  var insertImport;
  if (this.props.featureName) {
    insertImport = `import ${this.props.screenName} from './${this.props.featureName}/${this.props.screenName}';`;
  } else {
    insertImport = `import ${this.props.screenName} from './${pathArr[pathArr.length - 1]}/${this.props.screenName}';`;
  }

  var insertRoute = '';
  if (this.props.isModal) {
    insertRoute = `export const ${this.props.screenNameConstant} = {\n\tscreen: ${this.props.screenName},\n\n\tisModal: true,\n};`;
  } else {
    insertRoute = `export const ${this.props.screenNameConstant} = {\n\tscreen: ${this.props.screenName},\n};`;
  }

  var file = this.readFileAsString(path);
  if (file.indexOf(insertImport) === -1) {
    file = file.replace(importHook, `${insertImport}\n${importHook}`);
  }
  if (file.indexOf(this.props.screenNameConstant) === -1) {
    file = file.replace(routeHook, `${insertRoute}\n${routeHook}`);
  }
  this.write(path, file);
}

function updateMockData() {
  if (!this.props.api) {
    return;
  }
  // TODO fully wire up mocked data
  var path = 'js/mocks/profiles/happyPath.js';
  var hook = '// #===== yeoman hook =====#';
  var file = this.readFileAsString(path);
  var constant = this.props.requestConstant;

  var insert = `${constant}: null,`;
  if (file.indexOf(constant) === -1) {
    this.write(path, file.replace(hook, `${insert}\n${hook}`));
  }
}
function goodbye() {
  this.log(yosay(`Remember, Only ${chalk.red('you')} can prevent coding fires...`));
}

function updateParentReducer() {
  if (!this.props.reducer) {
    return;
  }
  var pathArr = this.props.path.split('.');
  var parent = pathArr[pathArr.length - 1];
  var parentDir = pathArr.slice(0, pathArr.length - 1).join('/');
  var path = `js/${parentDir}/${parent}/${parent}Reducers.js`;

  var importHook = '// #===== yeoman import hook =====#';
  var reducerHook = '// #===== yeoman reducer hook =====#';

  var insertImport = `import ${this.props.reducerName} from './${this.props.featureName}/${this.props.reducerName}';`;
  var insertReducer = `\t${this.props.featureName}: ${this.props.reducerName},`;

  var file = this.readFileAsString(path);
  if (file.indexOf(insertImport) === -1) {
    file = file.replace(importHook, `${insertImport}\n${importHook}`);
  }
  if (file.indexOf(insertReducer) === -1) {
    file = file.replace(reducerHook, `${insertReducer}\n\t${reducerHook}`);
  }
  this.write(path, file);
}

function updateMockData() {
  if (!this.props.api) {
    return;
  }

  var path = 'js/mocks/profiles/happyPath.js';
  var hook = '// #===== yeoman hook =====#';
  var file = this.readFileAsString(path);
  var constant = this.props.requestConstant;

  if (!this.props.isMockData) {
      // update happy path with placeholder for mock data
    var insert = `${constant}: null,`;
    if (file.indexOf(constant) === -1) {
      this.write(path, file.replace(hook, `${insert}\n${hook}`));
    }
  } else {
      // fully wire up mock data
    var value = this.props.ancestor + this.props.capitalizedFeature;

    var importHook = '// #===== yeoman import hook =====#';
    var insertImport = `import { ${value} } from '../data/${value}';`;

    var insert = `${constant}: ${value},`;
    if (file.indexOf(value) === -1) {
      file = file.replace(importHook, `${insertImport}\n${importHook}`);
    }
    if (file.indexOf(constant) === -1) {
      file = file.replace(hook, `\t${insert}\n${hook}`);
    }
    this.write(path, file);
  }
}

module.exports = {
  updateExistingApi,
  updateExistingAction,
  updateExistingReducer,
  updateConstants,
  updateParentRoutes,
  updateMockData,
  goodbye,
  setAlternativeTemplatePath,
  updateParentReducer,
  updateMockData
};
