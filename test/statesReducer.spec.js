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

        it(`should not call internal state\`s reducer`, () => {
            const stateReducer = sinon.stub()
            const initialState = {
                '001': {
                    stateReducer
                }
            }

            expect(reducer(initialState, {}))
                .toEqual(initialState)

            expect(stateReducer.called).toBeFalsy()
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
    })
})