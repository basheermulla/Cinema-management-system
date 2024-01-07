import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from '..';
import axios from "axios";

const MEMBERS_URL = import.meta.env.VITE_APP_MEMBERS_URL;

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
            state.error = null;
        },
    }
});

export default slice.reducer

export function getMembers() {

    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            const response = await axios.get(MEMBERS_URL, { headers: { "Authorization": `Bearer ${token}` } });
            dispatch(slice.actions.getMembersSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}