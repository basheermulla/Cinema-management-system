// third-party
import { combineReducers } from 'redux'

// project imports
import counterReducer from './slices/counterSlice'
import membersReducer from './slices/membersSlice'
import menuReducer from './slices/menu';
import movieReducer from './slices/movie';

const rootReducer = combineReducers({
    counter: counterReducer,
    members: membersReducer,
    menu: menuReducer,
    movies: movieReducer
});

export default rootReducer
