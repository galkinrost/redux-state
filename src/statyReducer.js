import {UPDATE_STATY} from './actionTypes'

const statyReducer = (state = {}, action = {}) => {
    if (action.type === UPDATE_STATY) {
        return Object.assign({}, state, action.payload.state)
    }

    return state
}

export default statyReducer