import React, {Component, PropTypes} from 'react';
import hoist from 'hoist-non-react-statics';
import invariant from 'invariant';

import * as actions from './actions';

const connectState = (mapStateToProps, mapsDispatchToProps, mergeProps, stateReducer)=> {
    return WrappedComponent=> {
        class ReduxState extends Component {
            componentWillMount() {
                if (stateReducer) {
                    const {store} = this.context;
                    const {stateId} = this.props;
                    this.setState({stateId});

                    store.dispatch(actions.initState(stateId, stateReducer));
                } else {
                    const {stateId} = this.context;

                    // TODO set default reducer if no stateId in a context
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

            return() {
                const {store} = this.context;
                const {_states} = store.getState();
                const {stateId} = this.state;
                const {state} = _states[stateId];
                const _dispatch = (action) => {
                    if (typeof action === 'function') {
                        const {_states} = store.getState();
                        const {stateId} = this.state;
                        const {state} = _states[stateId];
                        return action(_dispatch, state, store);
                    }

                    store.dispatch({
                        ...action,
                        stateId
                    });
                };

                const stateProps = mapStateToProps(state, this.props, store.getState());
                const dispatchProps = mapsDispatchToProps(store.dispatch, this.props, store.dispatch);
                const mergedProps = mergeProps(stateProps, dispatchProps, this.props);

                return (
                    <WrappedComponent {...mergedProps}/>
                );
            }
        }

        ReduxState.ContextTypes = {
            store: PropTypes.object,
            stateId: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ])
        };
        return hoist(ReduxState, WrappedComponent);
    }
};