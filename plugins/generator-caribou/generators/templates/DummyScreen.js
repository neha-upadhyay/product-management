/*
v0.5 screen template
*/
'use strict';
import React, { Component } from 'react';
import {
  InteractionManager,
  Text,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
<% if (action) { %>import * as <%= actionName %> from './<%= actionName %>';<% } %>
import {
  PlaceholderView,
  PageLayout,
  Footer,
} from 'styleGuideComponents';
import DFSStyleSheet from '<%= pathToJS %>lib/DFSStyleSheet';

const mapStateToProps = (state => ({
  <% if (api) { %>isLoading: state.<%= reducerStateTree %>.isLoading,
  hasLoaded: state.<%= reducerStateTree %>.hasLoaded,
  didInvalidate: state.<%= reducerStateTree %>.didInvalidate,
  lastUpdated: state.<%= reducerStateTree %>.lastUpdated,<% } %>
}));

const mapDispatchToProps = dispatch => ({
  <% if (action) { %><%= actionName %>: bindActionCreators(<%= actionName %>, dispatch),<% } %>
});

class <%= screenName %> extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if (!this.props.hasLoaded && !this.props.isLoading) {
        <% if (api) { %>this.props.<%= actionName %>.<%= apiActionCreatorFunctionName %>();<% } %>
      }
    });
  }

  render() {
    if (!this.props.hasLoaded) {
      return PlaceholderView;
    }
    return (
      <PageLayout>
        <Text>TODO implement me</Text>
        <Footer />
      </PageLayout>
    );
  }
}

const styles = DFSStyleSheet.create({
});

export default connect(mapStateToProps, mapDispatchToProps)(<%= screenName %>);
