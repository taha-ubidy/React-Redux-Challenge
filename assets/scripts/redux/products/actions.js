import {createAsyncAction, createAction} from '../actions';
import {fetch} from '../../core/http';
import {ERROR} from '../notifications/actions';

const fetchProducts = createAsyncAction('FETCH_PRODUCTS', function() {
  return dispatch => {
    return fetch(`/products`)
      .catch(err => {
        dispatch(ERROR(...err.errors));
        dispatch(this.failed(err));
        throw err;
      })
      .then(res => {
        const out = {products: res};
        dispatch(this.success(out));
        return res;
      });
  };
});

const ADD_QUANTITY = createAction('ADD_QUANTITY')
const REMOVE_QUANTITY = createAction('REMOVE_QUANTITY')

const submitPromo = createAsyncAction('UPDATE_PROMO', function(promo) {
  return dispatch => {
    return fetch(
      `/promocode`,
      {
        method: 'POST',
        body: JSON.stringify({
          'promoCode': promo
        }),
      }
    )
      .catch(err => {
        dispatch(ERROR(...err.errors));
        dispatch(this.failed(err));
        throw err;
      })
      .then(res => {
        dispatch(this.success(res));
        return res;
      });
  };
})

const submitCheckout = createAsyncAction('CHECKOUT_PRODUCTS', function(data) {
  return dispatch => {
    return fetch(
      `/checkout`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
      .catch(err => {
        dispatch(ERROR(...err.errors));
        dispatch(this.failed(err));
        throw err;
      })
      .then(res => {
        dispatch(this.success(res));
        return res;
      });
  };
});

export default {
  ...fetchProducts,
  ...submitPromo,
  ...submitCheckout,
  ADD_QUANTITY,
  REMOVE_QUANTITY,
};
