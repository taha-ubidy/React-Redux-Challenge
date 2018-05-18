import classNames from 'classnames';
import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import Notifications from '../core/components/notifications/Notifications';
import {routeActions} from 'react-router-redux';
import LoadingBar from '../core/components/LoadingBar';

import {FETCH_PRODUCTS, ADD_QUANTITY} from '../redux/products/actions';
import {
  HTTP_INIT,
  HTTP_LOADING,
  HTTP_LOADING_SUCCESSED,
  HTTP_LOADING_FAILED,
} from '../core/http';

@connect(state => {
  return {
    navigation: state.navigation.toJS(),
    products: state.products.get('products'),
  };
}, {FETCH_PRODUCTS, push: routeActions.push})
class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status_products: HTTP_INIT,
    };
  }
  componentDidMount(){
    const {FETCH_PRODUCTS, push} = this.props;
    const loadingSetter_status = (val) => () => {
      if(val > HTTP_LOADING) {
        push('/products')
      }
      this.setState({status_products: val});      
    };
    Promise.resolve(FETCH_PRODUCTS())
      .catch(loadingSetter_status(HTTP_LOADING_FAILED))
      .then(loadingSetter_status(HTTP_LOADING_SUCCESSED));
    loadingSetter_status(HTTP_LOADING)();
  }
  render() {
    const {status_products} = this.state;
    const {navigation} = this.props;

    // check is loading
    let loading_products = status_products <= HTTP_LOADING;
    let isLoading = loading_products;

    return (
      <div id="root">
        {isLoading && <LoadingBar />}
        <Notifications />
        {this.props.children}
      </div>
    );
  }
}
export default Root;
