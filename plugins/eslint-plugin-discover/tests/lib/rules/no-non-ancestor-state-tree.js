/**
 * @fileoverview Tests for no-non-ancestor-state-tree rule.
 * @author Steven Goff
 */

'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-non-ancestor-state-tree');
var RuleTester = require('eslint/lib/testers/rule-tester');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-non-ancestor-state-tree', rule, {
  valid: [
    'foo.bar()'
  ],
  invalid: [
    {
      code: 'with(foo) { bar() }',
      errors: [{ message: "Unexpected use of 'with' statement.", type: 'WithStatement' }]
    }
  ]
});
