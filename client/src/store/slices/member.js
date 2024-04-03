import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from '../index';
import axios from "axios";

const MEMBERS_URL = import.meta.env.VITE_APP_MEMBERS_URL;
const SUBSCRIPTIONS_URL = import.meta.env.VITE_APP_SUBSCRIPTIONS_URL;

const initialState = {
    error: null,
    members: [],
    subscriptions: []
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
        // GET SUBSCRIPTIONS
        getMembersSubscriptionsSuccess: (state, action) => {
            state.subscriptions = action.payload;
            state.error = null;
        },
    }
});

export default slice.reducer

// ⬇️ this is the loader and error boundary (Until now, the loader includes redux functions)
export async function loader() {
    try {
        let token = window.localStorage.getItem('accessToken');
        const { data } = await axios.get(`${MEMBERS_URL}/subscriptionsUnwind`, { headers: { "Authorization": `Bearer ${token}` } });
        dispatch(slice.actions.getMembersSubscriptionsSuccess(data.members));
        return data;
    } catch (error) {
        dispatch(slice.actions.hasError(error));
        return error;
    }
}

export async function memberLoader({ params }) {
    try {
        let token = window.localStorage.getItem('accessToken');
        const id = params.id;
        const response = await axios.get(`${MEMBERS_URL}/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
        return response.data;
    } catch (error) {
        dispatch(slice.actions.hasError(error));
        return error;
    }
}

export function createSubscription(method, memberId, subscription) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            // console.log('Here we create subscription = ', memberId);
            // console.log('Here we create subscription = ', subscription);
            if (method === 'post') {
                const response = await axios.post(`${SUBSCRIPTIONS_URL}`, { memberId: memberId, ...subscription }, { headers: { "Authorization": `Bearer ${token}` } });
            } else {
                const response = await axios.put(`${SUBSCRIPTIONS_URL}/${memberId}`, subscription, { headers: { "Authorization": `Bearer ${token}` } });
            }

        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function updateSubscription(memberId, subscription) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            // console.log('Here we update subscription = ', memberId);
            // console.log('Here we update subscription = ', subscription);
            const response = await axios.put(`${SUBSCRIPTIONS_URL}/${memberId}`, subscription, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function deleteSubscription(memberId, subscriptionId, action) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            const obj_delete = { subscriptionId, action }
            // console.log('Pay attention - You may delete the movie`s subscription = ', memberId);
            // console.log(obj_delete);
            if (action === 'deleteOneMovie') {
                //  Remove only this [subscriptionId] desired member's subscription from the subscriptionMovies array in the member's subscription document
                const response = await axios.put(`${SUBSCRIPTIONS_URL}/${memberId}`, obj_delete, { headers: { "Authorization": `Bearer ${token}` } });
            } else {
                // Delete the member's entire subscription document - this case can be when the member has only one future subscription and wants to cancel it
                // console.log('Pay attention - You may delete the member`s entire subscription document = ', subscriptionId);
                const response = await axios.delete(`${SUBSCRIPTIONS_URL}/${memberId}`, { headers: { "Authorization": `Bearer ${token}` } });
            }
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function createMember(member) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            // console.log('Here we create member = ', member);
            const response = await axios.post(`${MEMBERS_URL}`, member, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function updateMember(id, member) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            // console.log('Here we update member = ', id, ' |----------| ', member);
            const response = await axios.put(`${MEMBERS_URL}/${id}`, member, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function deleteMember(id) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            // console.log('Pay attention - You may delete the member = ', id);
            const response = await axios.delete(`${MEMBERS_URL}/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getMembers() {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            // console.log('aggregate');
            const response = await axios.get(MEMBERS_URL, { headers: { "Authorization": `Bearer ${token}` } });
            dispatch(slice.actions.getMembersSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}