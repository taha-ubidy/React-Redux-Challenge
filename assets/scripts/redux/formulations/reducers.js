import _ from 'lodash';
import {handleActions, handleAction} from 'redux-actions';
import {fromJS, List, Map, OrderedMap, Set} from 'immutable';
import {createAsyncHandlers} from '../actions';

const initialState = Map({
  formulations: [],
});

const FETCH_FORMULATIONS = createAsyncHandlers('FETCH_FORMULATIONS', {
  success(state, action) {
    const {formulations: {data}} = action.payload
    let formulations = [];
    _.map(data, (formulation)=>{
      if(formulation.$original){
        formulations.push(formulation.$original)
      }
    })
    return state.set('formulations', formulations);
  },
});

export default handleActions(
  {
    ...FETCH_FORMULATIONS,
  },
  initialState
);