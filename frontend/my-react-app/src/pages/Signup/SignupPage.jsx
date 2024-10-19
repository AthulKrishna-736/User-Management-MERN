import React, { useEffect, useState } from "react";
import './SignupPage.css'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { setSignupCredentails, signUpRequest, signUpSuccess, signUpErrors } from "../../features/user/userSignupSlice";
import BASE_URL from '../../store/config'
import { clearloginErrors } from "../../features/user/userLoginSlice";

//components
import InputBox from "../../component/inputBox/InputBox";
import Button from "../../component/button/Button";

function SignupPage(){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(clearloginErrors())
    })

    const [profileImage, setProfileImage] = useState(null);

    const { username, email, phone, password, errors, isSignedUp} = useSelector((state)=> state.signup_user);

    //regex for validating user
    const usernamePattern = /^[a-zA-Z0-9_]{4,30}$/
    const emailPattern = /^[a-zA-Z0-9_]+@[a-zA-Z]+\.[a-zA-Z]+$/
    const passPattern = /^[a-zA-Z0-9_]{6,18}$/
    const phonePattern = /^[0-9]{10}$/

    //handlers for the input changes for every field and updating it to the redux store
    const handleUsername = (event)=>{
        dispatch(setSignupCredentails({
            username:event.target.value,
            email,
            phone,
            password,
        }))
    }

    const handleEmail = (event)=>{
        dispatch(setSignupCredentails({
            username,
            email:event.target.value,
            phone,
            password,
        }))
    }
    
    const handlePhone = (event)=>{
        dispatch(setSignupCredentails({
            username,
            email,
            phone:event.target.value,
            password,
        }))
    }

    const handlePass = (event)=>{
        dispatch(setSignupCredentails({
            username,
            email,
            phone,
            password: event.target.value,
        }))
    }

    const handleProfileImage = (event)=>{
        const file = event.target.files[0];
        setProfileImage(file)
        dispatch(setSignupCredentails({username, email, phone, password}))
    }

    //signup logic including the validation and error handling
    const handleSignUp = async ()=>{
        dispatch(signUpRequest());

        let usernameError = '';
        let emailError = '';
        let phoneError = '';
        let passwordError = '';
        let profileImageError = '';

        //checking the input fields 
        const isValidUserName = usernamePattern.test(username)
        const isValidEmail = emailPattern.test(email)
        const isValidPass = passPattern.test(password)
        const isValidPhone = phonePattern.test(phone)

        //error handling for every input field 
        if (!username) {
            usernameError = 'Username is required';
        } else if (!isValidUserName) {
            usernameError = 'Username must be between 4-30 characters ';
        }

        if (!email) {
            emailError = 'Email is required';
        } else if (!isValidEmail) {
            emailError = 'Invalid email format';
        }
    
        if (!phone) {
            phoneError = 'Phone is required';
        } else if (!isValidPhone) {
            phoneError = 'Phone must be 10 digits';
        }
    
        if (!password) {
            passwordError = 'Password is required';
        } else if (!isValidPass) {
            passwordError = 'Password must be between 6 and 18 characters with alphanumeric and underscore';
        }        
    
        if (!profileImage) {
            profileImageError = 'Image field must not be empty';
        }

        if(usernameError || emailError || phoneError || passwordError || profileImageError){
            dispatch(signUpErrors({
                usernameError,
                emailError,
                phoneError,
                passwordError,
                profileImageError
            }))
            return;
        }

        try {

            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('phone', phone)
            formData.append('password', password)
            formData.append('profileImage', profileImage)

            console.log('data is sending to backend...')
            const response = await axios.post(`${BASE_URL}/api/users/signup`, formData);

            console.log('successfully signed the user')

            dispatch(signUpSuccess())

            dispatch(setSignupCredentails({ username: '', email: '', phone: '', password: ''}));
            setProfileImage(null);

            if(isSignedUp === true){
                navigate('/')
            }

        } catch (error) {
            console.log(error.message)
            dispatch(signUpErrors({
                emailError:error.response.data.message
            }))
        }
    }

    useEffect(() => {
        if (isSignedUp) {
            navigate('/');
        }
    }, [isSignedUp, navigate]);    

    return(
        <div className="signup-page">
            <div className="signup-box">
                <h1>Sign Up</h1>

                <InputBox 
                type='text'
                placeholder='Enter username'
                value={username}
                onChange={handleUsername}
                />
                {errors.usernameError && <p className="error-message">{errors.usernameError}</p>}

                <InputBox 
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={handleEmail}
                />
                {errors.emailError && <p className="error-message">{errors.emailError}</p>}

                <InputBox 
                type='text'
                placeholder='Enter phone'
                value={phone}
                onChange={handlePhone}
                />
                {errors.phoneError && <p className="error-message">{errors.phoneError}</p>}

                <InputBox
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={handlePass}
                />
                {errors.passwordError && <p className="error-message">{errors.passwordError}</p>}

                <InputBox 
                type='file'
                accept='image/*'
                onChange={handleProfileImage}
                />
                {errors.profileImageError && <p className="error-message">{errors.profileImageError}</p>}


                <Button label='Sign Up' onClickFn={handleSignUp} />

                <p className="account-message">
                  Already have an account? <span className="login-link" onClick={()=> navigate('/') }>Login here</span>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;
