import { INIT_STATE, REMOVE_STATE } from './actionTypes'

const stateCreator = (stateId, stateReducer) => ({
    stateId,
    state: stateReducer(),
    stateReducer
})
const initialState = {}

const statesReducer = (state = initialState, action) => {

    switch (action.type) {
        case INIT_STATE:
            {
                const {stateId, stateReducer} = action.payload

                // TODO check if stateId's already registered
                return {
                    ...state,
                    [stateId]: stateCreator(stateId, stateReducer)
                }
            }
        case REMOVE_STATE:
            {
                const {stateId} = action.payload
                const {[stateId]: stateToRemove, ...restStates} = state

                return restStates
            }
    }

    const stateId = action.meta && action.meta.stateId

    if (typeof stateId !== `undefined`) {
        const {[stateId]: stateToUpdate, ...restStates} = state
        const {state: stateOfStateToUpdate, ...restOfStateToUpdate} = stateToUpdate

        return {
            ...restStates,
            [stateId]: {
                ...restOfStateToUpdate,
                state: stateToUpdate.stateReducer(stateOfStateToUpdate, action)
            }
        }
    }

    return Object
        .keys(state)
        .reduce((updatedStates, _stateId) => {
            const {[_stateId]: stateToUpdate, ...restStates} = updatedStates
            const {state: stateOfStateToUpdate, ...restOfStateToUpdate} = stateToUpdate

            return {
                ...restStates,
                [_stateId]: {
                    ...restOfStateToUpdate,
                    state: stateToUpdate.stateReducer(stateOfStateToUpdate, action)
                }
            }
        }, state)
}

export default statesReducer