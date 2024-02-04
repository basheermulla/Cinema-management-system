// third-party
import { combineReducers } from 'redux'

// project imports
import counterReducer from './slices/counterSlice'
import membersReducer from './slices/member'
import menuReducer from './slices/menu';
import movieReducer from './slices/movie';
import userReducer from './slices/user';
import chatReducer from './slices/chat';

const rootReducer = combineReducers({
    menu: menuReducer,
    counter: counterReducer,
    members: membersReducer,
    movies: movieReducer,
    users: userReducer,
    chat: chatReducer,
});

export default rootReducer
