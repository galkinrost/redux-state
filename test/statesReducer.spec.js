import * as actionTypes from '../src/actionTypes'

import expect from 'expect'
import reducer from '../src/statesReducer'
import sinon from 'sinon'

describe(`redux-state`, () => {
    describe(`statesReducer`, () => {
        it(`should create initial state`, () => {
            const stateId = `001`
            const stateOfState = {
                foo: `bar`
            }
            const stateReducer = sinon.stub().returns(stateOfState)

            expect(reducer({}, {
                type: actionTypes.INIT_STATE,
                payload: {
                    stateId,
                    stateReducer
                }
            })).toEqual({
                [stateId]: {
                    state: stateOfState,
                    stateId,
                    stateReducer
                }
            })

            expect(stateReducer.calledOnce).toBeTruthy()
        })

        it(`should remove state`, () => {
            const stateId = `001`

            expect(reducer({
                [stateId]: {}
            }, {
                type: actionTypes.REMOVE_STATE,
                payload: {
                    stateId
                }
            })).toEqual({})
        })
        
        it(`should call internal state\`s reducer`, () => {
            const stateId = `001`
            const action = {
                type: `action`,
                payload: `payload`,
                stateId
            }
            const stateOfState = {
                foo: `bar`
            }
            const updatedStateOfState = {
                bar: `foo`
            }
            const stateReducer = sinon.stub()
                .returns(updatedStateOfState)
            const initialState = {
                [stateId]: {
                    stateId,
                    stateReducer,
                    state: stateOfState
                }
            }

            expect(reducer(initialState, action))
                .toEqual({
                    [stateId]: {
                        stateId,
                        stateReducer,
                        state: updatedStateOfState
                    }
                })

            expect(stateReducer.withArgs(stateOfState, action).calledOnce).toBeTruthy()
        })

        it(`should call internal state\`s reducer if stateId is not undefined`, () => {
            const stateId = 0
            const action = {
                type: `action`,
                payload: `payload`,
                stateId
            }
            const stateOfState = {
                foo: `bar`
            }
            const updatedStateOfState = {
                bar: `foo`
            }
            const stateReducer = sinon.stub()
                .returns(updatedStateOfState)
            const initialState = {
                [stateId]: {
                    stateId,
                    stateReducer,
                    state: stateOfState
                }
            }

            expect(reducer(initialState, action))
                .toEqual({
                    [stateId]: {
                        stateId,
                        stateReducer,
                        state: updatedStateOfState
                    }
                })

            expect(stateReducer.withArgs(stateOfState, action).calledOnce).toBeTruthy()
        })

        it(`should pass global actions into local reducers`, () => {
            const action = {
                type: `action`,
                payload: `payload`
            }
            const stateOfState = {
                foo: `bar`
            }
            const updatedStateOfState = {
                bar: `foo`
            }
            const stateReducer = sinon.stub()
                .returns(updatedStateOfState)
            const initialState = {
                0: {
                    stateReducer,
                    state: stateOfState
                },
                1: {
                    stateReducer,
                    state: stateOfState
                }
            }

            expect(reducer(initialState, action))
                .toEqual({
                    0: {
                        stateReducer,
                        state: updatedStateOfState
                    },
                    1: {
                        stateReducer,
                        state: updatedStateOfState
                    }
                })

            expect(stateReducer.withArgs(stateOfState, action).calledTwice).toBeTruthy()
        })
    })
})