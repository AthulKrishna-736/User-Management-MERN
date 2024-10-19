import React, { useEffect } from "react";
import './LoginPage.css'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import BASE_URL from "../../store/config";

//components
import InputBox from "../../component/inputBox/InputBox";
import Button from "../../component/button/Button";
import { setCredentials, loginRequest, loginSuccess, loginErrors, clearloginErrors } from "../../features/user/userLoginSlice";
import { clearErrors } from "../../features/user/userSignupSlice";


function LoginPage(){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(clearErrors())
    })

    const { email, password, emailError, passError, isAuthenticated } = useSelector((state)=> state.login_user)


    const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/
    const passPattern = /^[a-zA-Z0-9_]{6,18}$/

    const handleEmail = (event)=>{
        dispatch(setCredentials({email: event.target.value, password}))
    }

    const handlePass = (event)=>{
        dispatch(setCredentials({email, password: event.target.value}))
    }

    const handleLogin = async () => {

        dispatch(loginRequest());
        let emailError = '';
        let passError = '';
    
        const isValidEmail = emailPattern.test(email);
        const isValidPass = passPattern.test(password);
    
        if (!email) {
            emailError = 'Email is required.';
        } else if (!isValidEmail) {
            emailError = 'Invalid email format';
        }

        if (!password) {
            passError = 'Password is required.';
        } else if (!isValidPass) {
            passError = 'Password must be 6-18 characters long and include at least one letter and one number';
        }

        if (emailError || passError) {
            dispatch(loginErrors({ emailError, passError }));
            return;
        }


       try {
            const response = await axios.post(`${BASE_URL}/api/users/login`,{ email, password })
            console.log(response.data)
            console.log('successfull login:', response.data.user)

            //getting token sent from backend
            const token = response.data.token;
            const userIsAdmin = response.data.isAdmin;
            const adminName = response.data.adminName;
            const adminProfilePic = response.data.adminProfilePic;
            console.log('check admin : ',userIsAdmin);
            console.log('adminname : ',adminName);
            console.log('admin-profile : ',adminProfilePic);
            localStorage.setItem('token', token);
            localStorage.setItem('adminName',adminName);
            localStorage.setItem('adminProfile',adminProfilePic)

            dispatch(loginSuccess())

            if (userIsAdmin) {
                navigate('/admin-dashboard'); // Adjust this path to your admin dashboard route
            } else {
                navigate('/home'); // Regular user home page
            }

        } catch (error) {
            console.log(error.message)
            const errorEmail = error.response?.data?.email_message 
            const errorPass = error.response?.data?.pass_message 
            dispatch(loginErrors({emailError:errorEmail ? errorEmail : '' , passError: errorPass ? errorPass : ''}))
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <h1>Login</h1>
                <InputBox
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={handleEmail}
                />
                {emailError && <p className="error-message">{emailError}</p>}

                <InputBox
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={handlePass}
                />
                {passError && <p className="error-message">{passError}</p>}

                <Button label='Login' onClickFn={handleLogin} />

                <p className="account-message">
                    Don't have an account? <span className="signup-link" onClick={()=> navigate('/signup')}>Please sign up</span>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;