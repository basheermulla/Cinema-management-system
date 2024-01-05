// third-party
import { combineReducers } from 'redux'

// project imports
import counterReducer from './slices/counterSlice'
import membersReducer from './slices/membersSlice'

const rootReducer = combineReducers({
    counter: counterReducer,
    members: membersReducer
})

export default rootReducer
