import { configureStore } from '@reduxjs/toolkit';
import userLoginReducer from '../features/user/userLoginSlice';
import userSignupReducer from '../features/user/userSignupSlice';

export const store = configureStore({
    reducer:{
        login_user: userLoginReducer,
        signup_user: userSignupReducer,
    },
})

export default store;