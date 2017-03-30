
/*
v0.3 modal template
*/
'use strict';
import React, {Component} from 'react';
import {
  View,
  InteractionManager,
  Text,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// <% if (action) { %>import * as <%= actionName %> from './<%= actionName %>';<% } %>
import {
  Modal,
} from 'styleGuideComponents';
import DFSStyleSheet from '<%= pathToJS %>lib/DFSStyleSheet';

const mapStateToProps = ((state) => {
  return {
    // isLoading: state.<%= reducerStateTree %>.isLoading,
    // hasLoaded: state.<%= reducerStateTree %>.hasLoaded,
    // didInvalidate: state.<%= reducerStateTree %>.didInvalidate,
    // lastUpdated: state.<%= reducerStateTree %>.lastUpdated,
  };
});

const mapDispatchToProps = (dispatch) => {
  return {
    // <% if (action) { %><%= actionName %>: bindActionCreators({ ...<%= actionName %>}, dispatch),<% } %>
  };
};

class <%= screenName %> extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  _bodyComponent() {
    return (
      <View>
        <Text>TODO Body</Text>
      </View>
    );
  }

  render() {
    return <Modal
    title="TODO"
    body={this._bodyComponent()}
    closeText="Don't Enable"
    continueText="Enable"
    continuePress={() => {
    }}
    />;
  }
}

const styles = DFSStyleSheet.create({
});

export default connect(mapStateToProps, mapDispatchToProps)(<%= screenName %>);
