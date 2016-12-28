import { UPDATE_STATY } from './actionTypes'
import connectState from './connectState'
import statyReducerCreator from './statyReducer'

const mapStateToProps = (state) => ({
    state
})

const mapDispatchToProps = (dispatch) => ({
    setState: state => dispatch({
        type: UPDATE_STATY,
        payload: {
            state
        }
    })
})

const staty = initialState => WrappedComponent => connectState(mapStateToProps, mapDispatchToProps, undefined, statyReducerCreator(initialState))(WrappedComponent)

export default staty