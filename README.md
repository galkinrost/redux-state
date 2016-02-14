# Redux State

React-Redux style implementation of storage a local state for reusable components

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
import reducer from './reducer';

const mapStateToProps = (localState, props, state) => ({
    ...
});
const mapDispatchToProps = (localDispatch, props, dispatch) => ({
    ...
});
const mergeProps = (stateProps, dispatchProps, props) => ({
    ...
});

const Component = (props)=>(
...
);

export default connectState(mapStateToProps, mapDispatchToProps, mergeProps, reducer)(Component);

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

