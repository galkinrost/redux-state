# Redux State

`connect()` style implementation of storage a local state for reusable components

## Installation

```bash
npm install --save redux-state
```

## Implementation

```javascript
import {createStore, combineReducers} from 'redux';
import {reducer as statesReducer} from 'redux-state';
const reducers = {
  // ... your other reducers here ...
  states: statesReducer
}
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```

## Usage

```javascript
// Component
import React from 'react';
import {connectState} from 'redux-state';
import {bindActionCreators} from 'redux';
import localReducer from './reducer';
import * as actions from './actions';

const mapStateToProps = (localState, props, state) => ({
    ...
});
const mapDispatchToProps = (localDispatch, props, dispatch) => ({
    localAction: bindActionCreators(action.localAction, localDispatch),
    globalAction: bindActionCreators(action.globalAction, dispatch)
    ...
});
const mergeProps = (stateProps, dispatchProps, props) => ({
    ...
});

const Component = (props)=>(
...
);

export default connectState(mapStateToProps, mapDispatchToProps, mergeProps, localReducer)(Component);

// reducer

const initialState = {};

const localReducer = (state = initialState, action) => {
    switch(action.type) {
        ...
    }

    return state;
};

export default localReducer;
```

## Async actions

Like with redux-thunk

```javascript
const localAction = () => (localDispatch, getLocalState, store) =>{
    ...
}
```

## Action scopes

```javascript
// Action dispatched with redux dispatch function
dispatch({
    type: 'ACTION_TYPE',
    payload: {
        ...
    }
}); // => { type: 'ACTION_TYPE', payload: {...} }

// Action dispatched with state dispatch function
localDispatch({
    type: 'LOCAL_ACTION_TYPE',
    payload: { 
        ...
    }
}); // => { type: 'LOCAL_ACTION_TYPE', payload: {...}, stateId: ... }
```

## Local reducer

```javascript
// redux reducer
const reducer = (state, action) => {
    // receives both global and local actions
    ...
};

// local reducer
const localReducer = (localState, localAction) => {
    // receives only local actions for concrete instance of component
    ...
};
```

## Connecting children to the parent state

```javascript
// Root
...
const Root = () =>(
    <div>
        <ChildContainer/>
    </div>
);

export default connectState(mapStateToProps, mapDispatchToProps, mergeProps, localReducer)(Root);

// Child
...
const Child = () =>(
    ...
);
export default connectState(mapStateToProps, mapDispatchToProps, mergeProps)(Child);
```