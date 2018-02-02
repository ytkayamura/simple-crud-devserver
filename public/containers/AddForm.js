import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  changeName, changeAge, initializeForm,
  requestData, receiveDataSuccess, receiveDataFailed,
} from '../actions';

const AddForm = ({ name, age, dispatch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(requestData());
    axios.post('/api/characters', {
      name,
      age,
    })
    .then((response) => {
      dispatch(initializeForm())
      const characterArray = response.data
      dispatch(receiveDataSuccess(characterArray))
    })
    .catch((err) => {
      console.error(new Error(err))
      dispatch(receiveDataFailed())
    })
  }

  return (
    <div>
      <form onSubmit={e => handleSubmit(e)}>
        <div>
          名前:
          <input value={name} onChange={e => dispatch(changeName(e.target.value))} />
        </div>
        <div>
          年齢:
          <input value={age} onChange={e => dispatch(changeAge(e.target.value))} />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  )
}
export default connect(
  state => ({
    name: state.name,
    age: state.age,
  }),
)(AddForm);

