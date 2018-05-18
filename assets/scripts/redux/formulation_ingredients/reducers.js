import _ from 'lodash';
import {handleActions, handleAction} from 'redux-actions';
import {fromJS, List, Map, OrderedMap, Set} from 'immutable';
import {createAsyncHandlers} from '../actions';

const initialState = Map({
  formulation_ingredients: [],
});

const FETCH_FORMULATION_INGREDIENTS = createAsyncHandlers('FETCH_FORMULATION_INGREDIENTS', {
  success(state, action) {
    const {formulation_ingredients: {data}} = action.payload
    let formulation_ingredients = [];
    _.map(data, (formulation_ingredient)=>{
      if(formulation_ingredient.$original){
        formulation_ingredients.push(formulation_ingredient.$original)
      }
    })
    return state.set('formulation_ingredients', formulation_ingredients);
  },
});

export default handleActions(
  {
    ...FETCH_FORMULATION_INGREDIENTS,
  },
  initialState
);