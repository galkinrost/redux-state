import * as actionTypes from '../src/actionTypes'
import expect from 'expect'
import statyReducer from '../src/statyReducer'

describe(`redux-state`, () => {
    describe(`statyReducer`, () => {
        it(`should rewrite property in the state`, () => {
            expect(statyReducer({})({
                foo: `bar`
            }, {
                type: actionTypes.UPDATE_STATY,
                payload: {
                    state: {
                        foo: `baz`
                    }
                }
            })).toEqual({
                foo: `baz`
            })
        })

        it(`should merge properties`, () => {
            expect(statyReducer({})({
                foo1: `bar`
            }, {
                type: actionTypes.UPDATE_STATY,
                payload: {
                    state: {
                        foo2: `baz`
                    }
                }
            })).toEqual({
                foo1: `bar`,
                foo2: `baz`
            })
        })
    })
})
