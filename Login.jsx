import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { loginFailed, loginStart, loginSuccess } from '../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../components/Spinner';
import Base_URL from '../utils';
import { useState } from 'react';
import '../css/login.css';

import { toast } from 'react-toastify';

function Login() {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const notify = () =>
    toast.success('Logged In Successfully!', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const notifyError = () =>
    toast.error('Invalid Credentials !', {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    setLoading(true);
    try {
      const request = await axios.post(`${Base_URL}/api/auth/login`, {
        Username,
        Password,
      });
      dispatch(loginSuccess(request.data.user));

      localStorage.setItem('token', request.data.token);
      localStorage.setItem('username', request.data.user.Username);
      localStorage.setItem('full_name', request.data.user.Name);
      localStorage.setItem('_id', request.data.user._id);
      notify();
      navigate('/home');
    } catch (error) {
      dispatch(loginFailed());
      notifyError();
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <div>
        <h4 className='ms-4' id='login-text'>
          Log In
        </h4>
        <form className='mt-2 px-4' onSubmit={handleLogin}>
          <input
            type='text'
            className='form-control mt-3'
            placeholder='Username'
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <input
            type='password'
            className='form-control mt-3'
            id='exampleInputPassword1'
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button type='submit' className='mt-3 px-3 btn btn-warning'>
            Login
          </button>

          {loading && <LoadingSpinner />}
        </form>
        <p className='mt-4 ms-4 '>
          <span className='text-muted'>Don't have an account?</span>
          <Link to='/signup' className='text-danger text-decoration-none'>
            Register Here
          </Link>
        </p>
      </div>
    </>
  );
}

export default Login;
