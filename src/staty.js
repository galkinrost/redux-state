import {UPDATE_STATY} from './actionTypes'
import connectState from './connectState'
import statyReducer from './statyReducer'

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

const staty = WrappedComponent => connectState(mapStateToProps, mapDispatchToProps, undefined, statyReducer)(WrappedComponent)

export default staty