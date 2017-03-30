/*
v0.5 action test template
*/
import { <%= apiActionCreatorFunctionName %> } from '../<%= actionName %>';
const {
  <%= requestConstant %>,
  <%= successConstant %>,
  <%= failConstant %>,
} = require('<%= testPathToJS %>lib/constants').default;

describe('<%= actionName %>', () => {
  describe('<%= apiActionCreatorFunctionName %>', () => {
    let action;

    beforeEach(() => {
      action = <%= apiActionCreatorFunctionName %>();
    });

    it('should have appropriately constructed network promise', () => {
      expect(typeof (action.networkPromise)).toBe('function');
      expect(action.networkPromise()).toBeTruthy();
    });

    it('should have 3 action types defined', () => {
      expect(action.types.length).toBe(3);
    });

    it('should be using the proper request constant', () => {
      expect(action.types[0]).toBe(<%= requestConstant %>);
    });

    it('should be using the proper success constant', () => {
      expect(action.types[1]).toBe(<%= successConstant %>);
    });

    it('should be using the proper fail constant', () => {
      expect(action.types[2]).toBe(<%= failConstant %>);
    });
  });
});
