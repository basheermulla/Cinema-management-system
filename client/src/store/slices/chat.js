// third-party
import { createSlice } from '@reduxjs/toolkit';

// internal imports
import axios from 'axios';
import { dispatch } from '../index';

const USERS_URL = import.meta.env.VITE_APP_USERS_URL;
const MESSAGES_URL = import.meta.env.VITE_APP_MESSAGES_URL;

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    chats: [],
    user: {},
    usersMoreInfo: []
};

const slice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET USER CHATS
        getUserChatsSuccess(state, action) {
            state.chats = action.payload;
        },

        // GET USERS MORE INFO
        getUsersMoreInfoSuccess(state, action) {
            state.usersMoreInfo = action.payload;
        },

        // UPDATE READ CHATS BY USER (RECIPIENT)
        updateReadChatsbyUserSuccess(state, action) {
            state.chats = action.payload;
        },

        // UPDATE READ ONE CHATS BY USER (RECIPIENT)
        updateReadOneChatbyUserSuccess(state, action) {
            state.chats = action.payload;
        },

        // INSERT NEW CHAT MESSAGE TO USER CHATS ARRAY
        insertChatToUserChatsSuccess(state, action) {
            state.chats = [...state.chats, action.payload];
        }
    }
});

// Actions were generated for each use case in the app
export const { insertChatToUserChatsSuccess } = slice.actions

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

// ⬇️ Without loader
// todo -----> error boundary (Until now, the loader includes redux functions)

// Get all users with chats data by userLogin
export function getUsersWithChatsData(id) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            console.log('<=== Users getUsersWithChatsData ===> ', id);
            const response = await axios.get(`${USERS_URL}/chats/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
            dispatch(slice.actions.getUsersMoreInfoSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
};

//==============================================================================================
//              Triggered by "all users" in accordance to the "usecases"                       =
// Use cases - Get the user’s chat that has been displayed on the Chat Main Page               =
//     1) When navigating to a Chat Main Page for the first time                               =
//     2) When the displayed user is changed, by alterUserDisplay (useCallback)                =
//==============================================================================================
export function getUserChats(userLoginId, userId) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            console.log('<=== Messages getUserChats ===> ', userLoginId, userId);
            if (userLoginId && userId) {
                //=====================================================================================================================
                // Get all chats between two users [userLoginId, userId] and set the chats array in the  ===>  cinema server/messages =
                //=====================================================================================================================
                const response = await axios.get(`${MESSAGES_URL}/${userLoginId}/${userId}`, { headers: { "Authorization": `Bearer ${token}` } });
                const data = response.data;

                //======================================================================================================
                // Dispatch all chats between two users [userLoginId, userId] to the   ===>     chat slice reducer     =
                //======================================================================================================
                dispatch(slice.actions.getUserChatsSuccess(data));

                //=====================================================================================================================
                // If (The conversation between these two users [userLoginId, userId]) =====> has at least one message (document),    = 
                // && If (There is at least one message that the boolean value of isReadByRecipient) =====> is false                  =
                // then update all boolean values of isReadByRecipient to true                                                        =
                //=====================================================================================================================
                const findOneUnreadMessage = data.find((chat) => !chat.isReadByRecipient)
                if (data.length > 0 && findOneUnreadMessage) {

                    //================================================================================================
                    // update boolean values of isReadByRecipient               ===>     cinema server/messages      =
                    // Only on the chats (messages) that qualify in these two conditions:                            =
                    // 1) chat.sender === userId.                                                                    =
                    // 2) chat.recipient === userLoginId.                                                            =
                    //================================================================================================
                    const response = await axios.put(`${MESSAGES_URL}/${userLoginId}/${userId}`, null, { headers: { "Authorization": `Bearer ${token}` } });

                    //=========================================================================================
                    // update boolean values of isReadByRecipient                ===>    chat slice reducer   =
                    // Only on the chats (messages) that qualify in these two conditions:                     =
                    // 1) chat.sender === userId.                                                             =
                    // 2) chat.recipient === userLoginId.                                                     =
                    //=========================================================================================
                    const set_read_chats = data.map((chat) => {
                        return (!chat.isReadByRecipient && chat.recipient === userLoginId) ? { ...chat, isReadByRecipient: true } : chat
                    });
                    dispatch(slice.actions.updateReadChatsbyUserSuccess(set_read_chats));
                }
            }
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

//==================================================================================================================================
//                                             Triggered by "recipient user"                                                       =
// Update message: that the recipient user "read" the certain message   ===>   the insert chat (message) to the chat slice reducer =
//==================================================================================================================================
export function setReadChatByRecipient(obj_updateIsReadMessage, incomingMessageId) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            console.log('<=== Messages setReadChatByRecipient ===> ', obj_updateIsReadMessage, incomingMessageId);

            //================================================================================================
            // Update boolean value of isReadByRecipient               ===>       mongo DB / messages        =
            //================================================================================================
            const userLoginId = obj_updateIsReadMessage.recipient;
            const userId = obj_updateIsReadMessage.sender;
            const response = await axios.put(`${MESSAGES_URL}/${userLoginId}/${userId}`, null, { headers: { "Authorization": `Bearer ${token}` } });

            //=========================================================================================
            //  Insert to the (use the message's socket as the id)    ===>    chat slice reducer      =
            //=========================================================================================
            const update_read_one_chat = { _id: incomingMessageId, ...obj_updateIsReadMessage }
            dispatch(slice.actions.insertChatToUserChatsSuccess(update_read_one_chat));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

//==================================================================================================================
//                                       Triggered by "sender user"                                                =
// Insert chat (message) into the data base by the sender (when the message is sent) and the chat slice reducer    =
//==================================================================================================================
export function insertChat(newMessage) {
    return async () => {
        try {
            let token = window.localStorage.getItem('accessToken');
            console.log('<=== Messages insertChat ===> ', newMessage);

            //====================================================================================================================
            //      insert to the                       ===>                          mongo DB /messages                         =
            //====================================================================================================================
            const response = await axios.post(`${MESSAGES_URL}`, newMessage, { headers: { "Authorization": `Bearer ${token}` } });

            //=========================================================================================
            // Get message _id from the data base  ===> then insert to the ===>   chat slice reducer  =
            //=========================================================================================
            const obj = { _id: response.data._id, ...newMessage }
            dispatch(slice.actions.insertChatToUserChatsSuccess(obj));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}