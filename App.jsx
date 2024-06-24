import UsersProfile from './pages/UsersProfile.jsx'; // Import the UsersProfile component
import AuthLayout from './layout/AuthLayout.jsx'; // Import the AuthLayout component
import Homepage from './pages/Homepage.jsx'; // Import the Homepage component
import MyProfile from './pages/MyProfile.jsx'; // Import the MyProfile component
import './index.css'; // Import custom CSS file
import TweetPage from './pages/TweetPage.jsx'; // Import the TweetPage component
import { ToastContainer } from 'react-toastify'; // Import ToastContainer component from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import Login from './pages/Login.jsx'; // Import the Login component
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route components from react-router-dom
import Signup from './pages/Signup.jsx'; // Import the Signup component

function App() {
  return (
    <>
      <Routes>
          <Route element={<AuthLayout />}>
              <Route exact path='/' element={<Login />} />
              <Route exact path='/signup' element={<Signup />} />
          </Route>
          <Route exact path='/home' element={<Homepage />} />
          <Route exact path='/my-profile' element={<MyProfile />} />
          <Route exact path='/user-profile/:id' element={<UsersProfile />} />
          <Route exact path='/tweet/:id' element={<TweetPage />} />
      </Routes>
      <ToastContainer autoClose={600} />
    </>
  );
}

export default App; // Export the App component as the default export
