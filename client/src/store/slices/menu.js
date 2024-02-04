import { createSlice } from '@reduxjs/toolkit';

// project imports
import { dispatch } from '../index';
import axios from 'axios';

// initial state
const initialState = {
    selectedItem: ['control-panel'],
    selectedID: null,
    drawerOpen: false,
    error: null,
    menu: {},
    chatOpen: false
};

const menu = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        activeItem(state, action) {
            state.selectedItem = action.payload;
        },

        activeID(state, action) {
            state.selectedID = action.payload;
        },

        openDrawer(state, action) {
            state.drawerOpen = action.payload;
        },

        // has error
        hasError(state, action) {
            state.error = action.payload;
        },

        // get dashboard menu
        getMenuSuccess(state, action) {
            state.menu = action.payload;
        },

        openChat(state, action) {
            state.chatOpen = action.payload;
        },
    }
});

export default menu.reducer;

export const { activeItem, openDrawer, activeID, openChat } = menu.actions;