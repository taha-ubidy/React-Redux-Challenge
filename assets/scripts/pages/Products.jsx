import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {routeActions} from 'react-router-redux';

import {Button, Form, Message, Input} from 'semantic-ui-react';

import {ADD_QUANTITY} from '../redux/products/actions';

@connect(
  state => {
    return {
      ingredients: state.ingredients.get('ingredients'),
      formulations: state.formulations.get('formulations'),
      formulation_ingredients: state.formulation_ingredients.get('formulation_ingredients'),
    };
  },
  {push: routeActions.push}
)
export default class Products extends React.Component {
  constructor(props) {
    super(props);
    document.title = 'Products';    
  }

  onClickAdd = (product) => {
    this.props.ADD_QUANTITY(product)
  }

  onClickProceed = () => {
    this.props.push('/checkout')
  }

  render() {
    const {products} = this.props;
    
    let total = 0
    const contentList = _.map(products, (product, index) => {      
      if(product.quantity)
        total += product.quantity;
      return (
        <div key={index} className="product">
          <div className="productName">{product.name}</div>
          <div className="productPrice">{product.price}</div>
          <Button color="blue" onClick={()=>this.onClickAdd(product)}>Add to basket</Button>
        </div>
      )
    })

    return (
      <div className="products">
        <h1>Product List View</h1>
        <div className="content">
          <div className="quantity">
            <Button
              color="purple"
              onClick={()=>this.onClickProceed()}
            >
              Basket
            </Button>
            <span>{total}</span>
          </div>
          <div className="list">
            {contentList}
          </div>
          <div className="checkout">
            <Button
              color="purple"
              onClick={()=>this.onClickProceed()}
            >
              Proceed to checkout
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
