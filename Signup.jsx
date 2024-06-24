import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import '../css/login.css';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/Spinner';
import Base_URL from '../utils';
import { toast } from 'react-toastify';
import axios from 'axios';

function Signup() {
  const navigate = useNavigate();
  const [Username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [Name, setName] = useState('');

  const notifySuccess = (message) => {
    toast.success(message, {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: 'top-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Name) {
      notifyError('Please enter full name');
      return;
    }
    if (!Email) {
      notifyError('Please enter valid email');
      return;
    }
    if (!Username) {
      notifyError('Please provide username');
      return;
    }
    if (!Password) {
      notifyError('Please enter password');
      return;
    }
    if (!ConfirmPassword) {
      notifyError('Please enter password again to confirm');
      return;
    }
    if (Password !== ConfirmPassword) {
      notifyError('Password and Confirm Password do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${Base_URL}/api/auth/signup`, {
        Name,
        Username,
        Email,
        Password,
      });
      console.log(response.data);
      setLoading(false);
      notifySuccess('Signed Up Successfully!');
      navigate('/');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 409) {
        notifyError('Username or Email already exists');
      } else {
        notifyError('An error occurred, Please try again after some time.');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Signup</title>
      </Helmet>

      <div>
        <h4 className='mt-3 ms-4'>Register</h4>
        <form className='mt-2 px-4' onSubmit={handleSubmit}>
          <input
            type='text'
            className='form-control mt-3'
            placeholder='Full Name'
            value={Name}
            onChange={(e) => setName(e.target.value)}
            autoComplete='current-password'
          ></input>
          <input
            type='email'
            className='form-control mt-3'
            id='exampleFormControlInput1'
            placeholder='Email'
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
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
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <input
            type='password'
            className='form-control mt-3'
            id='exampleInputPassword2'
            placeholder='Confirm Password'
            value={ConfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>
          <button type='submit' className='mt-3 px-3 btn btn-dark'>
            Register
          </button>

          {loading && <LoadingSpinner />}
        </form>
        <p className='mt-4 ms-4 '>
          <span className='text-muted'>Already Registered?</span>{' '}
          <Link to='/' className='text-primary'>
            LogIn Here
          </Link>
        </p>
      </div>
    </>
  );
}

export default Signup;

