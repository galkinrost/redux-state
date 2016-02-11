import React, {Component, PropTypes} from 'react';
import hoist from 'hoist-non-react-statics';
import invariant from 'invariant';

import * as actions from './actions';
import nextStateId from './nextStateId';

const defaultMapStateToProps = ()=>({});
const defaultMapDispatchToProps = (stateDispatch)=>({stateDispatch});
const defaultMergeProps = (stateProps, dispatchProps, parentProps) => ({
    ...parentProps,
    ...stateProps,
    ...dispatchProps
});

const createStateDispatch = (store, stateId) => {
    const stateDispatch = (action) => {
        if (typeof action === 'function') {
            const {_states} = store.getState();
            const {stateId} = this.state;
            const {state} = _states[stateId];
            return action(stateDispatch, state, store);
        }

        store.dispatch({
            ...action,
            stateId
        });
    };

    return stateDispatch;
};

const connectState = (mapStateToProps = defaultMapStateToProps, mapsDispatchToProps = defaultMapDispatchToProps, mergeProps = defaultMergeProps, stateReducer)=> {
    return WrappedComponent=> {
        class ReduxState extends Component {
            componentWillMount() {
                if (stateReducer) {
                    const {store} = this.context;
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
                const {_states} = store.getState();

                invariant(_states, 'Should add statesReducer into the store');

                const {stateId} = this.state;

                const {state} = _states[stateId];

                if (!state) {
                    return null;
                }

                const stateDispatch = createStateDispatch(store, stateId);
                const stateProps = mapStateToProps(state, this.props, store.getState());
                const dispatchProps = mapsDispatchToProps(stateDispatch, this.props, store.dispatch);
                const mergedProps = mergeProps(stateProps, dispatchProps, this.props);

                return (
                    <WrappedComponent {...mergedProps}/>
                );
            }
        }

        ReduxState.contextTypes = {
            store: PropTypes.object.isRequired,
            stateId: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ])
        };
        return hoist(ReduxState, WrappedComponent);
    }
};

export default connectState;