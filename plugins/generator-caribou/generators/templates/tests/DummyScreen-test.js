/*
v0.5 screen test template
As of this generated template version 0.1 all properties passed to the screen can be tested.
There is not yet a proven way to unit test anything in the react native lifecycle such as the render method.
*/
import React from 'react';
import <%= screenName %> from '../<%= screenName %>';
import { shallow } from 'enzyme';

const mockedStore = {
  getState: () => (
    {
      <% if (reducerStateTree.length >= 0  && reducerStateTree[1]) { %><%= reducerStateTree[0] %>: {<% } %>
        <% if (reducerStateTree.length >= 1 && reducerStateTree[1]) { %><%= reducerStateTree[1] %>: {<% } %>
          <% if (reducerStateTree.length >= 2 && reducerStateTree[2]) { %><%= reducerStateTree[2] %>: {<% } %>
            <% if (reducerStateTree.length >= 3 && reducerStateTree[3]) { %><%= reducerStateTree[3] %>: {<% } %>
            <% if (reducerStateTree.length >= 3 && reducerStateTree[3]) { %>}<% } %>
          <% if (reducerStateTree.length >= 2 && reducerStateTree[2]) { %>}<% } %>
        <% if (reducerStateTree.length >= 1 && reducerStateTree[1]) { %>}<% } %>
      <% if (reducerStateTree.length >= 0 && reducerStateTree[0]) { %>}<% } %>
    }
  ),
  dispatch: () => {},
  subscribe: () => {},
};

const defaultProps = {
};

describe('<%= screenName %>', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = shallow(<<%= screenName %> {...defaultProps} store={mockedStore} />);
  });

  describe('props', () => {
    it('should have hasLoaded prop value', () => {
      expect(wrapper.props().hasLoaded).toBe(mockedStore.getState().<%= reducerStateTreeString %>.hasLoaded);
    });

    it('should map reducer state to isLoading property', () => {
      expect(wrapper.props().hasOwnProperty('isLoading')).toBe(true);
    });

    it('should map reducer state to hasLoaded property', () => {
      expect(wrapper.props().hasOwnProperty('hasLoaded')).toBe(true);
    });

    it('should map reducer state to didInvalidate property', () => {
      expect(wrapper.props().hasOwnProperty('didInvalidate')).toBe(true);
    });

    it('should map reducer state to lastUpdated property', () => {
      expect(wrapper.props().hasOwnProperty('lastUpdated')).toBe(true);
    });
  });

  describe('actions', () => {
    it('should have be wired up to actions', () => {
      expect(wrapper.props().hasOwnProperty('<%= actionName %>')).toBe(true);
    });
  });
});
