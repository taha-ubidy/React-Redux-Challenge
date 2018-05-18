import _ from 'lodash';
import {handleActions, handleAction} from 'redux-actions';
import {fromJS, List, Map, OrderedMap, Set} from 'immutable';
import {createAsyncHandlers} from '../actions';

const initialState = Map({
  products: [],
  promo: {},
});

const MAX_QUANTITY = 10

const FETCH_PRODUCTS = createAsyncHandlers('FETCH_PRODUCTS', {
  success(state, action) {
    const {products} = action.payload;
    return state.set('products', products);
  },
});

const UPDATE_PROMO = createAsyncHandlers('UPDATE_PROMO', {
  success(state, action) {
    return state.set('promo', action.payload);
  }
})

const CHECKOUT_PRODUCTS = createAsyncHandlers('CHECKOUT_PRODUCTS', {
  success(state, action) {
    return state;
  },
});

const ADD_QUANTITY = handleAction('ADD_QUANTITY', (state, action) => {
  const products = state.get('products')
  let newProducts = []
  _.map(products, (product, index)=>{
    let newProduct = Object.assign({}, product)    
    if(product.sku === action.payload.sku){
      let quantity = action.payload.quantity || 0      
      newProduct.quantity = quantity >= MAX_QUANTITY ? quantity : (quantity + 1)
    }
    newProducts.push(newProduct)
  })
  return state.set('products', newProducts)
}, initialState)

const REMOVE_QUANTITY = handleAction('REMOVE_QUANTITY', (state, action) => {
  const products = state.get('products')
  let newProducts = []
  _.map(products, (product, index)=>{
    let newProduct = Object.assign({}, product)    
    if(product.sku === action.payload.sku){
      let quantity = action.payload.quantity || 0
      newProduct.quantity = quantity <= 0 ? 0 : (quantity - 1)
    }
    newProducts.push(newProduct)
  })
  return state.set('products', newProducts)
}, initialState)

export default handleActions(
  {
    ...FETCH_PRODUCTS,
    ...UPDATE_PROMO,
    ...CHECKOUT_PRODUCTS,
    ADD_QUANTITY,
    REMOVE_QUANTITY,    
  },
  initialState
);
