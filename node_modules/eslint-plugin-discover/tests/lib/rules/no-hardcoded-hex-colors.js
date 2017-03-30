/**
 * @fileoverview Tests for no-hardcoded-hex-colors rule.
 * @author Steven Goff
 */

'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-hardcoded-hex-colors');
var RuleTester = require('eslint/lib/testers/rule-tester');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-hardcoded-hex-colors', rule, {
  valid: [
    'foo.bar()',
    'hi.ho()',
    'color="#FF"',
    'color="#FFFF"',
    'color="#FFFFF"',
    'color="#FFFFFFF"',
    'color="&#174;"',
  ],
  invalid: [
    {
      code: 'color="#FFF"',
      errors: [{}]
    },
    {
      code: 'color="#FFFFFF"',
      errors: [{}]
    },
  ]
});
