import { Outlet, useLocation } from 'react-router-dom'; // Importing necessary components from react-router-dom
import '../css/login.css'; // Importing CSS file for styling

// Defining AuthLayout functional component
const AuthLayout = () => {
  const { pathname } = useLocation(); // Getting the current location pathname using useLocation hook from react-router-dom

  return (
    // Main section with flexbox layout
    <section className='d-flex justify-content-center align-items-center vh-100'>
      {/* Card container */}
      <div className='card mx-auto mt-2' style={{ width: '75vw' }}>
        <div className='card-body'>
          {/* Row with two columns */}
          <div className='row' style={{ height: '100%' }}>
            {/* Left column for branding */}
            <div
              className='col-12 col-md-5 d-flex flex-column justify-content-center align-items-center'
              id='left-box-login'
            >
              {/* Title based on current pathname */}
              <h4>{pathname === '/' ? 'Welcome to Twitter' : 'Join Us on Twitter'}</h4>
              {/* Twitter logo */}
              <div className='mt-2 me-4'>
                <i className='fa-brands fa-twitter fs-1'></i>
              </div>
              {/* Messages icon */}
              <i className='fa-solid fa-messages' />
            </div>

            {/* Right column for content */}
            <div className='col-12 col-md-7'>
              {/* Placeholder for child components */}
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout; // Exporting AuthLayout component
