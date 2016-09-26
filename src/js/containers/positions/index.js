import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  fetchPositions
} from '../../actions';
import PositionsGrid from '../../components/positions';

class Positions extends Component {

  componentWillMount() {
    this.props.fetchPositions();
  }

  render() {
    const {
      positions,
    } = this.props;

    return (
      <PositionsGrid
        positions={positions}
      />
    );
  }
}

Positions.propTypes = {
  positions: PropTypes.arrayOf(PropTypes.object),
};

function mapStateToProps(state) {
  const {
    positions,
  } = state;

  return {
    positions,
  };
}

export default connect(mapStateToProps, { fetchPositions })(Positions);
