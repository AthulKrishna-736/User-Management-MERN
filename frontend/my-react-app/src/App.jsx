import './App.css'
import { Provider } from 'react-redux'
import store from './Store/store';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

//pages
import SignupPage from './pages/Signup/SignupPage';
import LoginPage from './pages/Login/LoginPage';
import Home from './pages/Home/Home';
import UserProtectedRoute from './features/ProtectUsers/ProtectedRoute'
import RedirectIfAuth from './features/ProtectUsers/redirectUser';
import EditProfile from './pages/Edit/Editprofile';
import AdminDashboard from './pages/adminDash/AdminDash';
import EditProfileUser from './pages/Edit/adminEdit';
import AdminProtectedRoute from './features/ProtectUsers/ProtectedAdmin';
import CreateUser from './pages/Edit/createUser';

function App(){

  return(
    <Provider store={store}>
      <Router>
        <Routes>

          <Route path='/' element={
            <RedirectIfAuth>
              <LoginPage />
            </RedirectIfAuth>
            }  />

          <Route path='/signup' element={
            <RedirectIfAuth>
              <SignupPage />
            </RedirectIfAuth>
          } />
          
          <Route path='/home' element={
            <UserProtectedRoute>
              <Home/>
            </UserProtectedRoute>
          } />

          <Route path='/edit-profile' element={
            <UserProtectedRoute>
              <EditProfile />
            </UserProtectedRoute> 
          } />

          <Route path='/edit-userprofile/:userId' element={
            <AdminProtectedRoute>
                 <EditProfileUser />
          </AdminProtectedRoute>
          } />

          <Route path='/create-user' element={
              <AdminProtectedRoute>
                <CreateUser />  
              </AdminProtectedRoute>
            }
          />

          <Route path="/admin-dashboard" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />

        </Routes>
      </Router>
    </Provider>
  )
}

export default App;
