// local
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// library dependencies
import styled from 'styled-components';
// components
import NavBar from './NavBar';
import Login from './Login';
import Features from './Features';
import About from './About';

import ContactForm from './ContactForm';
import LPFooter from './LPFooter';
import AboutUs from './AboutUs';
import Tempora from './tempora/Tempora';

const LandingPage = () => {
  const URL = useLocation();

  const [isEnglish, setIsEnglish] = useState(true);

  useEffect(() => {
    if (URL.pathname === '/' || URL.pathname === '/login') {
      setIsEnglish(true);
    } else if (URL.pathname === '/login/fr') {
      setIsEnglish(false);
    }
  }, [URL.pathname]);

  const handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Wrapper>
      <div id='navbar'>
        <NavBar isEnglish={isEnglish} handleClickScroll={handleClickScroll} />
      </div>
      <div id='login'>
        <Login isEnglish={isEnglish} handleClickScroll={handleClickScroll} />
      </div>
      <div id='#features'>
        <Features isEnglish={isEnglish} />
      </div>
      <div id='#about'>
        <About isEnglish={isEnglish} />
      </div>
      <div id='#tempora'>
        <Tempora isEnglish={isEnglish} />
      </div>
      <div id='#about-us'>
        <AboutUs isEnglish={isEnglish} />
      </div>
      <div id='#contact'>
        <ContactForm isEnglish={isEnglish} />
      </div>
      <div id='#footer'>
        <LPFooter />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
`;

export default LandingPage;
