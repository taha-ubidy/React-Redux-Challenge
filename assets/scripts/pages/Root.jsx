import classNames from 'classnames';
import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import Notifications from '../core/components/notifications/Notifications';
import {routeActions} from 'react-router-redux';
import LoadingBar from '../core/components/LoadingBar';

import {FETCH_INGREDIENTS} from '../redux/ingredients/actions';
import {FETCH_FORMULATIONS} from '../redux/formulations/actions';
import {FETCH_FORMULATION_INGREDIENTS} from '../redux/formulation_ingredients/actions';
import {
  HTTP_INIT,
  HTTP_LOADING,
  HTTP_LOADING_SUCCESSED,
  HTTP_LOADING_FAILED,
} from '../core/http';

@connect(state => {
  return {
    navigation: state.navigation.toJS(),
    ingredients: state.ingredients.get('ingredients'),
    formulations: state.formulations.get('formulations'),
    formulation_ingredients: state.formulation_ingredients.get('formulation_ingredients'),
  };
}, {FETCH_INGREDIENTS, FETCH_FORMULATIONS, FETCH_FORMULATION_INGREDIENTS, push: routeActions.push})
class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status_ingredients: HTTP_INIT,
      status_formulations: HTTP_INIT,
      status_formulation_ingredients: HTTP_INIT,
    };
  }
  componentDidMount(){
    const {FETCH_INGREDIENTS, FETCH_FORMULATIONS, FETCH_FORMULATION_INGREDIENTS, push} = this.props;
    let {status_ingredients, status_formulations, status_formulation_ingredients} = this.state;
    const loadingSetter_status = (id, val) => () => {
      switch(id){
        case 1:
          this.setState({status_ingredients: val});
          status_ingredients = val; 
          break
        case 2:
          this.setState({status_formulations: val});
          status_formulations = val;
          break
        case 3:
          this.setState({status_formulation_ingredients: val});
          status_formulation_ingredients = val;
          break
        default:
          break
      }
      const isLoading = status_ingredients <= HTTP_LOADING || status_formulations <= HTTP_LOADING || status_formulation_ingredients <= HTTP_LOADING;
      if(!isLoading){
        push('/products')
      }
    };
    Promise.resolve(FETCH_INGREDIENTS())
      .catch(loadingSetter_status(1, HTTP_LOADING_FAILED))
      .then(loadingSetter_status(1, HTTP_LOADING_SUCCESSED));
    loadingSetter_status(1, HTTP_LOADING)();
    Promise.resolve(FETCH_FORMULATIONS())
      .catch(loadingSetter_status(2, HTTP_LOADING_FAILED))
      .then(loadingSetter_status(2, HTTP_LOADING_SUCCESSED));
    loadingSetter_status(2, HTTP_LOADING)();
    Promise.resolve(FETCH_FORMULATION_INGREDIENTS())
      .catch(loadingSetter_status(3, HTTP_LOADING_FAILED))
      .then(loadingSetter_status(3, HTTP_LOADING_SUCCESSED));
    loadingSetter_status(3, HTTP_LOADING)();
  }
  render() {
    const {status_ingredients, status_formulations, status_formulation_ingredients} = this.state;
    const {navigation, ingredients, formulations, formulation_ingredients} = this.props;

    // check is loading
    let isLoading = status_ingredients <= HTTP_LOADING || status_formulations <= HTTP_LOADING || status_formulation_ingredients <= HTTP_LOADING;
    console.log(ingredients, formulations, formulation_ingredients)

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
