import { UPDATE_STATY } from './actionTypes'

const statyReducerCreator = (initialState = {}) => (state = initialState, action = {}) => {
    if (action.type === UPDATE_STATY) {
        return Object.assign({}, state, action.payload.state)
    }

    return state
}

export default statyReducerCreator