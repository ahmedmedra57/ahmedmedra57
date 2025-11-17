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
import Tempora from './Tempora';
import ContactForm from './ContactForm';
import LPFooter from './LPFooter';

const HomePage = () => {
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
      <NavBar isEnglish={isEnglish} handleClickScroll={handleClickScroll} />
      <Login isEnglish={isEnglish} handleClickScroll={handleClickScroll} />
      <div id='#features'>
        <Features isEnglish={isEnglish} />
      </div>
      <div id='#about'>
        <About isEnglish={isEnglish} />
      </div>
      <div id='#tempora'>
        <Tempora isEnglish={isEnglish} />
      </div>
      <div id='#contact'>
        <ContactForm isEnglish={isEnglish} />
      </div>
      <LPFooter />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;

  display: flex;
  flex-direction: column;
`;

export default HomePage;
