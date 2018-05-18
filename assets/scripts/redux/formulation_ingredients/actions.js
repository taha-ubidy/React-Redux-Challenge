import {createAsyncAction, createAction} from '../actions';
import {fetch} from '../../core/http';
import {ERROR} from '../notifications/actions';

const fetchFormulationIngredients = createAsyncAction('FETCH_FORMULATION_INGREDIENTS', function() {
  return dispatch => {
    return fetch(`/api/formulation_ingredients`)
      .catch(err => {
        dispatch(ERROR(...err.errors));
        dispatch(this.failed(err));
        throw err;
      })
      .then(res => {
        const out = {formulation_ingredients: res};
        dispatch(this.success(out));
        return res;
      });
  };
});


export default {
  ...fetchFormulationIngredients,
};