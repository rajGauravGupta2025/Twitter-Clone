import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { navLinks } from '../constants/index.js';
import { useSelector } from 'react-redux';

const OffCanvas = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  const { pathname } = useLocation();

  const [PictureToShow, setPictureToShow] = useState(null);
  const getProfilePicture = async () => {
    if (
      currentUser.Profile_Picture &&
      !currentUser.Profile_Picture.includes(
        'https://1fid.com/wp-content/uploads/2022/06/no-profile-picture-4-1024x1024.jpg'
      )
    ) {
      const picture = `https://res.cloudinary.com/dbjfwfix8/image/upload/v1696357712/${currentUser.Profile_Picture}.jpg`;
      setPictureToShow(picture);
    }
  };

  useEffect(() => {
    getProfilePicture();
  }, [currentUser.Profile_Picture]);

  return (
    <>
      <Button variant='light' onClick={toggleShow} className='me-2 d-block d-md-none'>
        <i className='fa-solid fa-bars'></i>
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        className='w-50'
        scroll='true'
        backdropClassName='true'
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i
              className='fa-brands fa-twitter fa-md mx-4'
              style={{ color: 'rgb(22, 161, 225)' }}
            ></i>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <aside className='d-flex flex-column h-100 justify-content-between'>
            <ul>
              {navLinks.map((link) => {
                const isActive = pathname === link.route ? true : false;
                return (
                  <li
                    key={link.name}
                    className={`btn btn-primary home-button my-1 ${
                      isActive && 'activeLink'
                    }`}
                  >
                    <NavLink to={link.route} className='text-decoration-none'>
                      {link.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            <div className='mb-4'>
              <NavLink to='/my-profile' className='text-decoration-none '>
                {!PictureToShow ? (
                  <img
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR82DN9JU-hbIhhkPR-AX8KiYzA4fBMVwjLAG82fz7GLg&s'
                    alt='profile-pic'
                    className=' side-bar-profile-icon ms-2 ms-md-5 img-fluid d-inline-block mb-4'
                  />
                ) : (
                  <img
                    src={PictureToShow}
                    alt='profile-pic'
                    className=' side-bar-profile-icon ms-4 img-fluid d-inline-block mb-2'
                  />
                )}
                <ul
                  style={{ listStyleType: 'none' }}
                  className='text-black d-inline-block me-md-3'
                >
                  <li>
                    <h6>{currentUser.Name}</h6>
                  </li>
                  <li>
                    <p>
                      @ <span>{currentUser.Username}</span>
                    </p>
                  </li>
                </ul>
              </NavLink>
            </div>
          </aside>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default OffCanvas;
