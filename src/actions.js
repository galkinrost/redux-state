import {INIT_STATE, REMOVE_STATE} from './actionTypes'

export const initState = (stateId, stateReducer) => ({
    type: INIT_STATE,
    payload: {
        stateId,
        stateReducer
    }
})

export const removeState = (stateId) => ({
    type: REMOVE_STATE,
    payload: {
        stateId
    }
})