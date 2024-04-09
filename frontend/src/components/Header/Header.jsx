import React from 'react';

import "./Header.css";
import Navbar from '../Navbar/Navbar';
import SearchForm from '../Search/SearchForm';

const Header = () => {
  return (
    <div className='holder'>
        <header className='header'>
            <Navbar />
            <div className='header-content flex flex-c text-center text-white'>
                <h2 className='header-title text-capitalize' style={{margin:"5px 0",padding:"5px 0"}}>find your book of choice.</h2><br />
                <p className='header-text fs-18 fw-3' style={{margin:"10px 0",padding:"5px 0"}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam beatae sapiente quibusdam consequatur perspiciatis facere laboriosam non nesciunt at id repudiandae, modi iste? Eligendi, rerum!</p>
                <SearchForm />
            </div>
        </header>
    </div>
  )
}

export default Header