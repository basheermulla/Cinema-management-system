import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from '../store';
import axios from "axios";

const REACT_APP_MEMBERS_URL = "http://localhost:8082/members";

const initialState = {
    error: null,
    members: [],
}

const slice = createSlice({ 
    name: 'member',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        // GET MEMBERS
        getMembersSuccess: (state, action) => {
            state.members = action.payload;
        },
    }
});

export default slice.reducer

export function getMembers() {
    
    return async () => {
        try {
            const response = await axios.get(REACT_APP_MEMBERS_URL);
            dispatch(slice.actions.getMembersSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}