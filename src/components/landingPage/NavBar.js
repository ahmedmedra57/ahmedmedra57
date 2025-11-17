import styled, { css } from 'styled-components';

import { devices, breakpoints } from './landing-page-breakpoints/breakpoints';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import {
  alignItemsFlexStart,
  flexBoxCenter,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
} from '../styles/commonStyles';

const NavBar = ({ isEnglish, handleClickScroll }) => {
  const isXl = useMediaQuery({ query: '(min-width:975px)' });
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const [dropdown, setDropdown] = useState(false);

  const handleDropdown = () => {
    setDropdown((prevState) => !prevState);
  };

  return (
    <Wrapper dropdown={dropdown}>
      <Flex>
        {isEnglish ? (
          <>
            {/* English */}
            <A href='/login'>
              <Logo src='./images/logo.webp' alt='umbrella os' />
            </A>
            {dropdown && !isXl && (
              <LinksWrapper>
                <Li onClick={() => handleClickScroll('#features')}>
                  <A href='#features'>Features</A>
                </Li>

                <Li onClick={() => handleClickScroll('#about')}>
                  <A href='#about'>About</A>
                </Li>

                <Li onClick={() => handleClickScroll('#tempora')}>
                  <A href='#tempora'>Tempora</A>
                </Li>

                <Li onClick={() => handleClickScroll('#contact')}>
                  <A href='#contact'>Contact</A>
                </Li>

                <Li>
                  <A href='/login/fr'>French</A>
                </Li>
              </LinksWrapper>
            )}

            {isXl ? (
              <LinksWrapper>
                {/* english */}
                <Li onClick={() => handleClickScroll('#features')}>
                  <A href='#features'>Features</A>
                </Li>

                <Li onClick={() => handleClickScroll('#about')}>
                  <A href='#about'>About</A>
                </Li>

                <Li onClick={() => handleClickScroll('#tempora')}>
                  <A href='#tempora'>Tempora</A>
                </Li>

                <Li onClick={() => handleClickScroll('#contact')}>
                  <A href='#contact'>Contact</A>
                </Li>

                <Li>
                  <A href='/login/fr'>French</A>
                </Li>
              </LinksWrapper>
            ) : (
              <>
                <Button onClick={handleDropdown} dropdown={dropdown}>
                  <ButtonDecor>
                    <MiddleLine isMobile={isMobile}></MiddleLine>
                  </ButtonDecor>
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            {/* French */}
            <A href='/login/fr'>
              <Logo src='/images/logo.webp' alt='umbrella os' />
            </A>
            {dropdown && !isXl && (
              <LinksWrapper>
                <Li onClick={() => handleClickScroll('#features')}>
                  <A href='#caractéristiques'>Caractéristiques</A>
                </Li>

                <Li onClick={() => handleClickScroll('#about')}>
                  <A href='#apropos'>À propos</A>
                </Li>

                <Li onClick={() => handleClickScroll('#tempora')}>
                  <A href='#tempora'>Tempora</A>
                </Li>

                <Li onClick={() => handleClickScroll('#contact')}>
                  <A href='#contact'>Contact</A>
                </Li>

                <Li>
                  <A href='/login'>Anglais</A>
                </Li>
              </LinksWrapper>
            )}
            {isXl ? (
              <LinksWrapper>
                <Li onClick={() => handleClickScroll('#features')}>
                  <A href='#caractéristiques'>Caractéristiques</A>
                </Li>

                <Li onClick={() => handleClickScroll('#about')}>
                  <A href='#apropos'>À propos</A>
                </Li>

                <Li onClick={() => handleClickScroll('#tempora')}>
                  <A href='#tempora'>Tempora</A>
                </Li>

                <Li onClick={() => handleClickScroll('#contact')}>
                  <A href='#contact'>Contact</A>
                </Li>

                <Li>
                  <A href='/login'>Anglais</A>
                </Li>
              </LinksWrapper>
            ) : (
              <>
                <Button onClick={handleDropdown} dropdown={dropdown}>
                  <ButtonDecor>
                    <MiddleLine isMobile={isMobile}></MiddleLine>
                  </ButtonDecor>
                </Button>
              </>
            )}
          </>
        )}
      </Flex>
    </Wrapper>
  );
};

export default NavBar;

const Wrapper = styled.nav`
  width: 100vw;
  height: 72px;
  position: fixed;

  background: #18253a;
  /* border: 2px solid #18253a; */

  z-index: 100;

  @media only screen and ${devices.xs} {
    ${({ dropdown }) =>
      dropdown
        ? css`
            height: 304px;
            padding-top: 20px;
            ${alignItemsFlexStart}
          `
        : css`
            padding-top: 0px;
            ${flexBoxCenter}
          `}
  }

  transition: 0.5s;

  @media only screen and ${devices.xl} {
    height: 72px;
    padding-top: 0px;
    ${flexBoxCenter}
  }
`;

const Flex = styled.div`
  width: 100%;
  ${justifyContentSpaceAround}

  @media (max-width: ${breakpoints.md}) {
    align-items: flex-start;
  }

  @media (max-width: ${breakpoints.sm}) {
    ${flexBoxCenter}
    flex-direction: column;
  }
`;

const Logo = styled.img`
  max-width: 273px;
  max-height: 22px;
  min-width: 46px;
  min-height: 4px;
`;

const LinksWrapper = styled.ul`
  @media (max-width: ${breakpoints.sm}) {
    height: 200px;
    position: absolute;
    top: 70px;
    left: 52px;
    ${alignItemsFlexStart}
    flex-direction: column;
    gap: 18px;
  }

  @media only screen and ${devices.sm} {
    height: 200px;
    position: absolute;
    top: 76px;
    left: 10px;
    ${alignItemsFlexStart}
    flex-direction: column;
    gap: 18px;
  }
  @media only screen and ${devices.xl} {
    position: relative;
    top: 12px;
    ${justifyContentSpaceEvenly};
    flex-direction: row;
  }
`;

const Li = styled.li`
  list-style-type: none;
`;

const A = styled.a`
  cursor: pointer;
  padding-right: 46px;
  font-size: 16.667px;

  font-family: 'Roboto';
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.55);
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out;

  text-decoration: none;

  position: relative;

  &:hover {
    color: #fff;
  }
`;

const Button = styled.button`
  cursor: pointer;
  width: 56px;
  height: 40px;
  padding: 4px 12px;
  /* font-size: 1.25rem; */
  line-height: 1;
  background-color: transparent;
  border: 1px solid white;
  border-radius: 4px;
  transition: box-shadow 0.15s ease-in-out;
  ${flexBoxCenter}

  ${({ dropdown }) =>
    dropdown &&
    css`
      box-shadow: #ffff 0px 0px 0px 2px, #ffff 0px 4px 6px -1px,
        rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
    `}
`;

const ButtonDecor = styled.div`
  width: 24px;
  height: 16px;

  border-top: 2px solid #ffff;
  border-bottom: 2px solid #ffff;

  ${flexBoxCenter}
`;

const MiddleLine = styled.hr`
  width: 22px;
  height: 3px;
  margin-bottom: 2px;
  background-color: #ffff;

  ${({ isMobile }) =>
    isMobile &&
    css`
      height: 2px;
      margin-bottom: 1px;
    `}
`;
