import _ from 'lodash';
import {handleActions, handleAction} from 'redux-actions';
import {fromJS, List, Map, OrderedMap, Set} from 'immutable';
import {createAsyncHandlers} from '../actions';

const initialState = Map({
  ingredients: [],
});

const FETCH_INGREDIENTS = createAsyncHandlers('FETCH_INGREDIENTS', {
  success(state, action) {
    const {ingredients: {data}} = action.payload
    let ingredients = [];
    _.map(data, (ingredient)=>{
      if(ingredient.$original){
        ingredients.push(ingredient.$original)
      }
    })
    return state.set('ingredients', ingredients);
  },
});

export default handleActions(
  {
    ...FETCH_INGREDIENTS,
  },
  initialState
);