import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {routeActions} from 'react-router-redux';

import { Button, Select, Input } from 'semantic-ui-react';

import {FETCH_PRODUCTS, REMOVE_QUANTITY, UPDATE_PROMO, CHECKOUT_PRODUCTS} from '../redux/products/actions';
import {
  HTTP_INIT,
  HTTP_LOADING,
  HTTP_LOADING_SUCCESSED,
  HTTP_LOADING_FAILED,
} from '../core/http';

const LuhnCheck = (function()
{
	var luhnArr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
	return function(str)
	{
		var counter = 0;
		var incNum;
		var odd = false;
		var temp = String(str).replace(/[^\d]/g, "");
		if ( temp.length == 0)
			return false;
		for (var i = temp.length-1; i >= 0; --i)
		{
			incNum = parseInt(temp.charAt(i), 10);
			counter += (odd = !odd)? incNum : luhnArr[incNum];
		}
		return (counter%10 == 0);
	}
})()

@connect(
  state => {
    return {
      products: state.products.get('products'),
      promo: state.products.get('promo'),
    };
  },
  {FETCH_PRODUCTS, UPDATE_PROMO, REMOVE_QUANTITY, CHECKOUT_PRODUCTS, push: routeActions.push}
)
export default class Checkout extends React.Component {
  constructor(props) {
    super(props);
    document.title = 'Basket / Checkout view';
    this.state = {
      status_post: HTTP_INIT,
      credit: '',
    };
  }

  onClickRemove = (product) => {
    this.props.REMOVE_QUANTITY(product)
  }

  onClickContinueShopping = () => {
    this.props.push('/products')
  }

  onClickApplyPromo = () => {
    const {UPDATE_PROMO} = this.props;
    const loadingSetter_status = (val) => () => {     
      this.setState({status_post: val});       
    };
    Promise.resolve(UPDATE_PROMO(this.refs.promo.inputRef.value))
      .catch(loadingSetter_status(HTTP_LOADING_FAILED))
      .then(loadingSetter_status(HTTP_LOADING_SUCCESSED));
    loadingSetter_status(HTTP_LOADING)();
  }

  onChangeCredit = (obj) => {
    this.setState({credit:  obj.target.value})
  }

  onSubmit = () => {
    if(!LuhnCheck(this.state.credit))
      return
    const {CHECKOUT_PRODUCTS, products, push} = this.props;
    let productsInBusket = []
    _.map(products, (product, index) => {
      if(product.quantity && product.quantity > 0){        
        productsInBusket.push(product)
      }
    })

    if(productsInBusket.length === 0)
      return
    
    let form = []
    _.map(productsInBusket, (product) => {
      form.push({
        sku: product.sku,
        quantity: product.quantity,
      })
    })

    const loadingSetter_status = (val) => () => {
      switch(val){
        case HTTP_LOADING_SUCCESSED:
          push('/success')
          break
        case HTTP_LOADING_FAILED:
          push('/failure')
          break
        default:
          this.setState({status_post: val});       
          break
      }
    };
    
    Promise.resolve(CHECKOUT_PRODUCTS({
      basket: form,
      cardNumber: this.state.credit,
    }))
      .catch(loadingSetter_status(HTTP_LOADING_FAILED))
      .then(loadingSetter_status(HTTP_LOADING_SUCCESSED));
    loadingSetter_status(HTTP_LOADING)();
  }

  render() {
    const {status_post, credit} = this.state;
    const {products, promo} = this.props;

    const promoCode = promo.amount ? 'X' + promo.amount : ''
    const isCreditError = !LuhnCheck(credit)

    let productsInBusket = []
    _.map(products, (product, index) => {
      if(product.quantity && product.quantity > 0)  
        productsInBusket.push(product)
    })
    
    const dropdownOptions = []
    for(let i = 1; i <= 10; i++){
      dropdownOptions.push({
        key: i,
        value: i,
        text: i
      })
    }

    let total = 0, subtotal=0, discount=0, baskettotal=0
    const contentList = _.map(productsInBusket, (product, index) => {      
      if(product.quantity){
        total += product.quantity;
        subtotal += product.quantity * product.price
      }
      return (
        <div key={index} className="product">
          <div className="productName">{product.name}</div>
          <div className="productQuantity">
            <Select options={dropdownOptions} value={product.quantity} readOnly/>
          </div>
          <div className="productPrice">{(product.price * product.quantity).toLocaleString(2)}</div>
          <Button 
            color="blue" 
            onClick={()=>this.onClickRemove(product)}
          >
            Remove
          </Button>
        </div>
      )
    })
    if(promo.amount)
      discount = total / 100 * promo.amount
    baskettotal = subtotal - discount

    return (
      <div className="checkout">
        <h1>Basket / Checkout view</h1>    
        <div className="content">
          <div className="quantity">
            <Button 
              color="purple" 
              onClick={()=>this.onClickContinueShopping()}
            >
              Continue Shopping
            </Button>
            <div>
              <Button
                color="purple"
              >
                Basket
              </Button>
              <span>{total}</span>
            </div>
          </div>
          <div className="list">
            {contentList}
          </div>
          <div className="promo">
            <span>Enter Promo Code</span>
            <Input ref='promo' placeholder={promoCode}/>
            <Button
              color="blue"
              onClick={()=>this.onClickApplyPromo()}
            >
              Apply
            </Button>
          </div>
          <div className="calcuation">
            <div className="subtotal">
              <span>SubTotal</span>
              <div>{subtotal.toLocaleString(2)}</div>
            </div>
            <div className="discount">
              <span>Promotional discount amount</span>
              <div>{discount.toLocaleString(2)}</div>
            </div>
            <div className="total">
              <span>Basket Total</span>
              <div>{baskettotal.toLocaleString(2)}</div>
            </div>
            <div className="credit">
              <span>Please enter your credit card number</span>
              <Input error={isCreditError} onChange={(obj)=>this.onChangeCredit(obj)}/>
            </div>
          </div>
          <div className="checkout">
            <Button
              color="blue"
              onClick={()=>this.onSubmit()}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
