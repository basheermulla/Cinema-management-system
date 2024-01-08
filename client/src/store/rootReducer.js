// third-party
import { combineReducers } from 'redux'

// project imports
import counterReducer from './slices/counterSlice'
import membersReducer from './slices/membersSlice'
import menuReducer from './slices/menu';

const rootReducer = combineReducers({
    counter: counterReducer,
    members: membersReducer,
    menu: menuReducer
})

export default rootReducer
