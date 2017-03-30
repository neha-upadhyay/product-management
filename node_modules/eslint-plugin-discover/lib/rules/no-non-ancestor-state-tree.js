/**
 * @fileoverview Disallow state from non-ancestor
 * @author Steven Goff
 */
 'use strict';

// function wrapping state still works
 const re = /(\w+\()?((\w+)(\.\w+)*)(\))?/;

 function checkNormalFunction(context) {
   return function (node) {
    //  let sourceCode = context.getSourceCode();
    //  console.log(sourceCode.getText(node));
   };
 }
 function checkLastSegment(context) {
   return function (node) {
     // report problem for function if last code path segment is reachable
     if (node.params.length > 0 && 'name' in node.params[0] && node.params[0].name === 'state') {
       const sourceCode = context.getSourceCode();

       const originalSplitFileName = context.getFilename().split('\\');
       let splitFileName;

       // Remove directory path prior to and including 'js' along with actual filename
       // This is because we only care to compare branch with the root in card|core|bank and leading up to but not including filename
       // splitFileName.forEach(function(fileNode, index) {
       originalSplitFileName.some((fileNode, index) => {
         if (fileNode === 'js') {
           splitFileName = originalSplitFileName.slice(index + 1, -1);
           return true;
         }
       });

       if (!('properties' in node.body)) {
         return;
       }
       node.body.properties.forEach((obj) => {
         const valueSource = sourceCode.getText(obj.value);
         let match;
         if ((match = re.exec(valueSource)) !== null) {
           if (match.index === re.lastIndex) {
             re.lastIndex += 1;
           }
           // View your result using the m-variable.
           // eg m[0] etc.
         }
         const stateTree = match[2];

        //  console.log(obj);
         // split state tree and remove initial index as it only contains 'state'
         const splitStateTree = stateTree.split('.').slice(1);

         if (splitStateTree[0] !== 'core') {
           splitFileName.some((fileNode, index) => {
             if (fileNode !== splitStateTree[index]) {
              //  let message = originalSplitFileName.join('\\') + " references non-ancestor state tree " + splitStateTree.join('.') + " at " + splitStateTree[index] + " (expected " + fileNode + " or state to be from 'core')";
               const message = `No non-ancestor state tree references. Expected ${fileNode} but found ${splitStateTree[index]} in ${stateTree}`;
               context.report({
                 node: obj,
                 message,
               });
               return true;
             }
           });
         }
       });
     }
   };
 }

 module.exports = {
   meta: {
     docs: {
       description: 'disallow unnecessary semicolons',
       category: 'Possible Errors',
       recommended: true
     },
     schema: [] // no options
   },
   create(context) {
     return {
       ReturnStatement(node) {
       },
       'Function:exit': checkNormalFunction(context),
       'FunctionExpression:exit': checkNormalFunction(context),
       'ArrowFunctionExpression:exit': checkLastSegment(context),
       onCodePathStart(codePath, node) {
       },
       onCodePathEnd(codePath, node) {
       }
     };
   }
 };
