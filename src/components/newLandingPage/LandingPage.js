// local
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

/**
 * REFACTORED LandingPage Component
 *
 * IMPROVEMENTS:
 * ✅ Removed isEnglish state management - i18n handles language automatically
 * ✅ Removed URL-based language detection (/login/fr)
 * ✅ Removed isEnglish prop from all child components
 * ✅ Cleaner component with single responsibility
 */
const LandingPage = () => {
  const handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Wrapper>
      <div id='navbar'>
        <NavBar handleClickScroll={handleClickScroll} />
      </div>
      <div id='login'>
        <Login handleClickScroll={handleClickScroll} />
      </div>
      <div id='#features'>
        <Features />
      </div>
      <div id='#about'>
        <About />
      </div>
      <div id='#tempora'>
        <Tempora />
      </div>
      <div id='#about-us'>
        <AboutUs />
      </div>
      <div id='#contact'>
        <ContactForm />
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
