/*
v0.4 reducer test template
*/
import <%= reducerName %>, { initialState } from '../<%= reducerName %>';

const {
  <%= requestConstant %>,
  <%= successConstant %>,
  <%= failConstant %>,
  <%= cacheClearConstant %>,
} = require('<%= testPathToJS %>lib/constants').default;

describe('<%= reducerName %>', () => {
  it('should have empty initial state', () => {
    const state = <%= reducerName %>(undefined);
    expect(state).toEqual(initialState);
  });

  describe('<%= requestConstant %> action', () => {
    const action = {
      type: <%= requestConstant %>
    };

    const state = <%= reducerName %>(undefined, action);
    it('should set isLoading to true', () => {
      expect(state.isLoading).toBe(true);
    });
  });

  describe('<%= successConstant %> action', () => {
    const action = {
      type: <%= successConstant %>
    };

    const state = <%= reducerName %>(undefined, action);
    it('should set isLoading to false', () => {
      expect(state.isLoading).toBe(false);
    });
    it('should set hasLoaded to true', () => {
      expect(state.hasLoaded).toBe(true);
    });
    it('should set isFail to false', () => {
      expect(state.isFail).toBe(false);
    });
  });

  describe('<%= failConstant %> action', () => {
    const action = {
      type: <%= failConstant %>,
      payload: { error: 'some error text' }
    };

    const state = <%= reducerName %>(undefined, action);
    it('should set isLoading to false', () => {
      expect(state.isLoading).toBe(false);
    });
    it('should set isFail to true', () => {
      expect(state.isFail).toBe(true);
    });
    it('should set hasLoaded to false', () => {
      expect(state.hasLoaded).toBe(false);
    });
    it('should store action.payload in error property', () => {
      expect(state.error).toEqual(action.payload);
    });
  });

  describe('<%= cacheClearConstant %> action should reset data', () => {
    const action = {
      type: <%= cacheClearConstant %>,
    };

    const state = <%= reducerName %>(undefined, action);
    it('should set isLoading state to false', () => {
      expect(state).toEqual(initialState);
    });
  });
});
