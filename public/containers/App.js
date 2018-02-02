import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import AddForm from './AddForm'
import CharacterList from './CharacterList'
import { receiveDataSuccess, receiveDataFailed } from '../actions'

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    axios.get('/api/characters')
    .then(response => {
      const _characterArray = response.data
      dispatch(receiveDataSuccess(_characterArray))
    })
    .catch(err => {
      console.error(new Error(err))
      dispatch(receiveDataFailed())
    })
  }
  render() {
    return (
      <div>
        <AddForm />
        <CharacterList />
      </div>
    );
  }
}
export default connect()(App);
