// third-party
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// internal imports
import rootReducer from './rootReducer';

const persistConfig = {
    key: 'my-db', 
    storage,
    keyPrefix: 'cinema-'
    /*//-----------------------------------------------------------------------
    -   Other state reconcilers include hardSet,                              -
    -   which completely overrides the initial state with the incoming state, -
    -   and autoMergeLevel2, which merges two levels deep                     -
    *///-----------------------------------------------------------------------
    // stateReconciler: autoMergeLevel2  
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: true })
})

const persister = persistStore(store)

const { dispatch } = store;

const useDispatch = () => useAppDispatch();
const useSelector = useAppSelector;

export { store, persister, dispatch, useSelector, useDispatch };
