// third-party
import { combineReducers } from 'redux'

// project imports
import snackbarReducer from "./slices/snackbar";
import membersReducer from './slices/member'
import menuReducer from './slices/menu';
import movieReducer from './slices/movie';
import userReducer from './slices/user';
import chatReducer from './slices/chat';

const rootReducer = combineReducers({
    snackbar: snackbarReducer,
    menu: menuReducer,
    members: membersReducer,
    movies: movieReducer,
    users: userReducer,
    chat: chatReducer,
});

export default rootReducer
