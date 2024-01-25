// third-party
import { combineReducers } from 'redux'

// project imports
import counterReducer from './slices/counterSlice'
import membersReducer from './slices/member'
import menuReducer from './slices/menu';
import movieReducer from './slices/movie';
import userReducer from './slices/user';

const rootReducer = combineReducers({
    counter: counterReducer,
    members: membersReducer,
    menu: menuReducer,
    movies: movieReducer,
    users: userReducer
});

export default rootReducer
