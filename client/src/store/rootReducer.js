// third-party
import { combineReducers } from 'redux'

// project imports
import counterReducer from './slices/counterSlice'
import membersReducer from './slices/member'
import menuReducer from './slices/menu';
import movieReducer from './slices/movie';

const rootReducer = combineReducers({
    counter: counterReducer,
    members: membersReducer,
    menu: menuReducer,
    movies: movieReducer
});

export default rootReducer
