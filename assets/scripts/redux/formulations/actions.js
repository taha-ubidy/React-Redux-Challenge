import {createAsyncAction, createAction} from '../actions';
import {fetch} from '../../core/http';
import {ERROR} from '../notifications/actions';

const fetchFormulations = createAsyncAction('FETCH_FORMULATIONS', function() {
  return dispatch => {
    return fetch(`/api/formulations`)
      .catch(err => {
        dispatch(ERROR(...err.errors));
        dispatch(this.failed(err));
        throw err;
      })
      .then(res => {
        const out = {formulations: res};
        dispatch(this.success(out));
        return res;
      });
  };
});


export default {
  ...fetchFormulations,
};