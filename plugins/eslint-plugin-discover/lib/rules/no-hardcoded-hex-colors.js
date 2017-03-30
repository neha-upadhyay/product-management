/**
 * @fileoverview Disallow hardcoded colors
 * @author Steven Goff
 */
 'use strict';

 const hasHex = input => /[^&]#[0-9A-F]{6}[^0-9A-F]/i.test(input);
 const hasHex3 = input => /[^&]#[0-9A-F]{3}[^0-9A-F]/i.test(input);
 const hasRGB = input => /rgb\(/i.test(input);
 const hasRGBA = input => /rgba\(/i.test(input);

 function checkHexColor(context, node, value) {
   if (hasHex(value) || hasHex3(value)) {
     context.report({
       node,
       message: 'No using hardcoded hex outside of theme.js.',
     });
   } else if (hasRGB(value) || hasRGBA(value)) {
     context.report({
       node,
       message: 'No using hardcoded rgb outside of theme.js.',
     });
   }
 }

 module.exports = {
   meta: {
     docs: {
       description: 'disallow hardcoded colors',
       category: 'Possible Errors',
       recommended: true
     },
     schema: [] // no options
   },
   create(context) {
     return {
       Literal: (node) => {
         checkHexColor(context, node, node.raw);
       },
       ReturnStatement(node) {
       },
       onCodePathStart(codePath, node) {
       },
       onCodePathEnd(codePath, node) {
       }
     };
   }
 };
