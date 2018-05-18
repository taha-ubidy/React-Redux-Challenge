import {createAsyncAction, createAction} from '../actions';
import {fetch} from '../../core/http';
import {ERROR} from '../notifications/actions';

const fetchIngredients = createAsyncAction('FETCH_INGREDIENTS', function() {
  return dispatch => {
    return fetch(`/api/ingredients`)
      .catch(err => {
        dispatch(ERROR(...err.errors));
        dispatch(this.failed(err));
        throw err;
      })
      .then(res => {
        const out = {ingredients: res};
        dispatch(this.success(out));
        return res;
      });
  };
});


export default {
  ...fetchIngredients,
};