import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email:'',
    password:'',
    isAuthenticated: false,
    emailError: '',
    passError:'',
};

const loginSlice = createSlice({
    name:'login_user',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { email, password } = action.payload;
            state.email = email;
            state.password = password;
        },
        loginRequest: (state) => {
            state.emailError = ''; 
            state.passError = ''; 
        },
        loginSuccess: (state) => {
            state.isAuthenticated = true;
        },
        loginErrors: (state, action) => {
            const { emailError, passError } = action.payload;
            state.emailError = emailError || '';
            state.passError = passError || ''; 
        },
        logout: (state) => {
            state.email = '';
            state.password = '';
            state.isAuthenticated = false;
            state.emailError = ''; 
            state.passError = ''; 
        },
        clearloginErrors:(state)=>{
            state.emailError = '';
            state.passError = '';
        }
    }
});


export const { setCredentials, loginRequest, loginSuccess, loginErrors, logout, clearloginErrors } = loginSlice.actions;
export default loginSlice.reducer;

