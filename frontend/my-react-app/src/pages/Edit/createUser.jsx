import React, { useState } from 'react';
import InputBox from '../../component/inputBox/InputBox';
import Button from '../../component/button/Button';
import { useNavigate } from 'react-router-dom';
import './CreateUser.css'; // Adjust CSS file as needed
import axios from 'axios';
import BASE_URL from '../../store/config';


function CreateUser() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleUsername = (e) => setUsername(e.target.value);
    const handleEmail = (e) => setEmail(e.target.value);
    const handlePhone = (e) => setPhone(e.target.value);
    const handlePass = (e) => setPassword(e.target.value);
    const handleProfileImage = (e) => setProfileImage(e.target.files[0]);

    const handleCreateUser = async() => {
        console.log('Creating user...');

        // Create FormData object to send data
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        if (profileImage) {
        formData.append('profileImage', profileImage);
       } 

       try {
        const token = localStorage.getItem('token')
        console.log('token check form',token)


        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Phone:', phone);
        console.log('Password:', password);
        console.log('Profile Image:', profileImage);
        console.log('formdata : ',formData)

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        

        const response = await axios.post(`${BASE_URL}/admin/users`, formData, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        
        console.log(response.data); 
        navigate('/admin-dashboard');
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            // Request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something else caused an error
            console.error('Error:', error.message);
        }
        }
       
    };

    return (
        <div className="create-user-page">
            <div className="create-user-box">
                <h1>Create User</h1>

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

                <Button label='Create User' onClickFn={handleCreateUser} />

                <p className="back-to-dashboard-message">
                  Go back to <span className="dashboard-link" onClick={() => navigate('/admin-dashboard')}>Dashboard</span>
                </p>
            </div>
        </div>
    );
}

export default CreateUser;
