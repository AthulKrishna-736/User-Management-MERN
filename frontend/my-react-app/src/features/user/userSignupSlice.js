import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username:'',
    email:'',
    phone:'',
    password:'',
    isSignedUp: false,
    errors:{
        usernameError: '',
        emailError: '',
        phoneError: '',
        passwordError: '',
        profileImageError: ''
    }
}

const signUpSlice = createSlice({
    name:'signup_user',
    initialState,
    reducers:{
        setSignupCredentails:(state,action)=>{
            const { username, email, phone, password } = action.payload
            state.username = username;
            state.email = email;
            state.phone = phone;
            state.password = password;
        },
        signUpRequest:(state)=>{
            state.errors.usernameError = '';
            state.errors.emailError = '';
            state.errors.phoneError = '';
            state.errors.passwordError = '';
            state.errors.profileImageError = '';            
        },
        signUpSuccess:(state)=>{
            state.isSignedUp = true;
        },
        signUpErrors:(state, action)=>{
            const { usernameError, emailError, phoneError, passwordError, profileImageError } = action.payload;
            state.errors.usernameError = usernameError || '';
            state.errors.emailError = emailError || '';
            state.errors.phoneError = phoneError || '';
            state.errors.passwordError = passwordError || '';
            state.errors.profileImageError = profileImageError || '';
        },
        clearErrors:(state)=>{
            state.errors.usernameError = '';
            state.errors.emailError = '';
            state.errors.phoneError = '';
            state.errors.passwordError = '';
            state.errors.profileImageError = '';
        }

    }
})

export const { setSignupCredentails, signUpRequest, signUpSuccess, signUpErrors, clearErrors } = signUpSlice.actions
export default signUpSlice.reducer;


