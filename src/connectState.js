import React, {Component, PropTypes} from 'react';
import hoist from 'hoist-non-react-statics';
import invariant from 'invariant';

import {storePropType, stateIdPropType} from './propTypes';
import * as actions from './actions';
import nextStateId from './nextStateId';

const defaultMapStateToProps = ()=>({});
const defaultMapDispatchToProps = (stateDispatch)=>({stateDispatch});
const defaultMergeProps = (stateProps, dispatchProps, parentProps) => ({
    ...parentProps,
    ...stateProps,
    ...dispatchProps
});

const getStateOfStates = store => store.getState().states;
const checkStateConnected = store=> invariant(getStateOfStates(store), 'Should add statesReducer into the store');

const createStateDispatch = (store, stateId) => {
    const stateDispatch = (action) => {
        const states = getStateOfStates(store);
        invariant(states[stateId], 'Somebody trying get state when component`s already unmount');

        if (typeof action === 'function') {
            const getState = () => {
                const {[stateId]: {state}} = states;
                return state;
            };
            return action(stateDispatch, getState, store);
        }

        store.dispatch({
            ...action,
            stateId
        });
    };

    return stateDispatch;
};

const connectState = (mapStateOfStateToProps = defaultMapStateToProps, mapStateDispatchToProps = defaultMapDispatchToProps, mergeProps = defaultMergeProps, stateReducer)=> {

    const mapStateToProps = (store, stateId, props)=> {
        const {[stateId]: {state: stateOfState}} = getStateOfStates(store);

        return mapStateOfStateToProps(stateOfState, props, store.getState());
    };
    const mapDispatchToProps = (store, stateId, props)=> {
        const stateDispatch = createStateDispatch(store, stateId);
        return mapStateDispatchToProps(stateDispatch, props, store.dispatch);
    };

    return WrappedComponent=> {
        class ReduxState extends Component {

            getChildContext() {
                return {
                    stateId: this.state.stateId
                };
            }

            componentWillMount() {
                const {store} = this.context;
                checkStateConnected(store);

                if (stateReducer) {
                    const {stateId = nextStateId()} = this.props;
                    this.setState({stateId});

                    store.dispatch(actions.initState(stateId, stateReducer));
                } else {
                    const {stateId} = this.context;

                    invariant(stateId, 'Should declare component with reducer');

                    this.setState({stateId});
                }
            }

            componentWillUnmount() {
                if (stateReducer) {
                    const {stateId} = this.state;
                    const {store} = this.context;

                    setTimeout(()=>store.dispatch(actions.removeState(stateId)), 0);
                }
            }

            render() {
                const {store} = this.context;
                const {stateId} = this.state;

                const stateProps = mapStateToProps(store, stateId, this.props);
                const dispatchProps = mapDispatchToProps(store, stateId, this.props);
                const mergedProps = mergeProps(stateProps, dispatchProps, this.props);

                return (
                    <WrappedComponent {...mergedProps}/>
                );
            }
        }

        ReduxState.childContextTypes = {
            stateId: stateIdPropType
        };

        ReduxState.contextTypes = {
            store: storePropType,
            stateId: stateIdPropType
        };
        return hoist(ReduxState, WrappedComponent);
    }
};

export default connectState;