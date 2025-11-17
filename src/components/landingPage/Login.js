// react Hooks
import { memo, useEffect } from 'react';
import { useState } from 'react';
// libraries
import styled, { css } from 'styled-components';

// common styles

import { devices, breakpoints } from './landing-page-breakpoints/breakpoints';
import {
  flexBoxCenter,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
} from '../styles/commonStyles';
import LoginBox from './LoginBox';

const Login = ({ isEnglish, handleClickScroll }) => {
  const imagesArr = ['./images/header.jpg', './images/slider.jpg'];

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentImgIndex === imagesArr.length - 1) {
        setCurrentImgIndex(0);
      } else {
        setCurrentImgIndex(currentImgIndex + 1);
      }
    }, 8000);

    return () => clearInterval(intervalId); // Clear the interval when the component unmounts
  }, [currentImgIndex]);

  return (
    <Wrapper imagesArr={imagesArr} currentImgIndex={currentImgIndex}>
      {isEnglish ? (
        <ShadedBackground>
          <Grid>
            <div></div>
            <Flex>
              <FlexColumn id={'1'}>
                <Text>
                  UMBRELLA OS centralized monitoring & control rail operating
                  platform and power management system allows operational asset
                  accessibility in real-time to oversee, control and analyze all
                  vital temperature parameters of integrated track heating
                  systems, providing status and condition reporting further
                  benefiting safety and situational awareness relevant to the
                  safeguard of the rail network and commuters during the
                  harshest of winter conditions.
                  <br />
                  <br />
                  Advanced UMB-360 dashboard analytics, video Monitoring for
                  rapid validation of track conditions and operating practices,
                  generated alerts reporting site-specific asset performance
                  parameters andoperational safety failure modes greatly reduces
                  the crew teams and man-power needed to validate the working
                  order of switch locations and platforms during the harshest of
                  winter conditions.
                  <br />
                  <br />
                  The operational performance history and telemetry generated
                  from UOS is categorized, stored and accessible at any time and
                  available in a PDF printable format. This unprecedented
                  generated data can now be viewed, analyzed and derived from
                  considerable asset management awareness, identifying patterns
                  of consumptions trends leading to the elaboration of energy
                  preservation guidelines & protocols of efficient operation
                  practices.
                </Text>
                {/* <Li onClick={() => handleClickScroll('#about')}>
                  <A href='#about'>About</A>
                </Li> */}
                <LearnMore
                  href='#about'
                  onClick={() => handleClickScroll('#about')}
                >
                  learn more
                </LearnMore>
              </FlexColumn>
              <FlexColumn>
                {/* <LoginBox>
                  <Text>LOGIN</Text>
                </LoginBox> */}

                <LoginBox isEnglish={isEnglish} />
                <FlexRow>
                  <LearnMore
                    href='#tempora'
                    onClick={() => handleClickScroll('#tempora')}
                  >
                    learn more
                  </LearnMore>
                  <VerticalLine></VerticalLine>
                  <Sign src='/images/tempora-slogan-and-logo.webp' />
                </FlexRow>
              </FlexColumn>
            </Flex>
            <div></div>
          </Grid>
        </ShadedBackground>
      ) : (
        <ShadedBackground>
          <Grid>
            <div></div>
            <Flex>
              <FlexColumn id={'1'}>
                <Text>
                  La plateforme d'exploitation ferroviaire et le système de
                  gestion de l'énergie UMBRELLA OS permettent de surveiller et
                  de contrôler en temps réel les actifs opérationnels. Permet
                  l'accès aux actifs opérationnels en temps réel pour
                  superviser, contrôler et analyser tous les paramètres de
                  température vitaux des systèmes intégrés de chauffage des
                  voies, des systèmes intégrés de chauffage des voies en
                  fournissant des rapports d'état et de condition qui améliorent
                  la sécurité et la de la sécurité et de la connaissance de la
                  situation pour la sauvegarde du réseau ferroviaire et des
                  usagers dans les conditions hivernales les plus difficiles.
                  <br />
                  <br />
                  Son tableau de bord analytique avancé <span>UMB-360</span>, la
                  surveillance vidéo pour une validation rapide de l'état des
                  voies et des pratiques d'exploitation, les alertes générées
                  signalant les paramètres de performance des actifs spécifiques
                  au site et les modes de défaillance de la sécurité
                  opérationnelle réduisent considérablement les équipes et la
                  <span>main-d'œuvre</span> nécessaires pour valider l'état de
                  fonctionnement des emplacements d'aiguillage et des
                  plateformes dans les conditions hivernales les plus
                  difficiles.
                  <br />
                  <br />
                  L'historique des performances opérationnelles et la télémétrie
                  générée par l'UOS sont catégorisés, stockés et accessibles à
                  tout moment et disponibles dans un format PDF imprimable. Ces
                  données sans précédent peuvent maintenant être visualisées,
                  analysées et déduites d'une sensibilisation considérable à la
                  gestion des actifs, en identifiant des modèles de tendances de
                  consommation menant à l'élaboration de directives et de
                  protocoles de conservation de l'énergie pour des pratiques
                  d'exploitation efficaces.
                </Text>
                <LearnMore
                  href='#apropos'
                  onClick={() => handleClickScroll('#about')}
                >
                  APPRENDRE PLUS
                </LearnMore>
              </FlexColumn>
              <FlexColumn>
                {/* <LoginBox>
                  <Text>LOGIN</Text>
                </LoginBox> */}
                <LoginBox isEnglish={isEnglish} />
                <FlexRow>
                  <LearnMore
                    href='#tempora'
                    onClick={() => handleClickScroll('#tempora')}
                  >
                    APPRENDRE PLUS
                  </LearnMore>
                  <VerticalLine></VerticalLine>
                  <Sign src='/images/tempora-slogan-and-logo.webp' />
                </FlexRow>
              </FlexColumn>
            </Flex>
            <div></div>
          </Grid>
        </ShadedBackground>
      )}
    </Wrapper>
  );
};

export default memo(Login);

const Wrapper = styled.div`
  width: 100%;
  /* height: 750px; */
  height: auto;
  padding-top: 137px;
  padding-bottom: 57px;

  /* @media (max-width: ${breakpoints.xl}) {
    height: 1689px;
  } */

  transition: 1s;
  ${({ imagesArr, currentImgIndex }) =>
    css`
      background-image: url(${imagesArr[currentImgIndex]});
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
    `}
  ${flexBoxCenter}
`;

const ShadedBackground = styled.div`
  width: 100%;

  height: auto;
  background-color: rgba(0, 3, 8, 0.431);
  @media (max-width: ${breakpoints.xl}) {
    padding-top: 130px;
    padding-bottom: 57px;
  }
`;

const Flex = styled.div`
  max-width: 1320px;
  height: 100%;
  ${justifyContentSpaceAround}
  gap: 20px;

  @media (max-width: ${breakpoints.xl}) {
    ${justifyContentSpaceEvenly};
    flex-direction: column-reverse;
  }
`;

const Grid = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 12% 76% 12%;
  @media only screen and ${devices.md} {
    grid-column-gap: 10px;
  }
`;

const FlexColumn = styled.div`
  height: 80%;
  ${({ id }) =>
    id === '1'
      ? css`
          width: 60%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          /* align-content: flex-start; */
        `
      : css`
          width: 40%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        `}
`;

const Text = styled.p`
  height: fit-content;
  margin-top: 0;
  margin-bottom: 20px;

  line-height: 1;
  font-size: 18px;
  text-align: left;
  color: #ffff;
  font-family: 'Roboto', sans-serif;
  text-transform: capitalize;

  @media (max-width: ${breakpoints.mm}) {
    font-size: 14px;
  }
`;

const LearnMore = styled.a`
  width: 165px;
  height: 31px;
  font-size: 16.667px;
  font-weight: 500;
  text-decoration: none;
  text-transform: uppercase;
  font-family: 'Roboto', sans-serif;
  background-color: rgba(24, 37, 58, 0.478);
  border: 2px solid #82ffff;
  color: #82ffff;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border: 2px solid #ffff;
    color: #ffff;
  }
`;

// const LoginBox = styled.div`
//   cursor: pointer;
//   border: 1px solid rgb(0, 0, 0);
//   border-radius: 6px;
//   background: rgb(24, 37, 58);
//   background: linear-gradient(
//     90deg,
//     rgba(24, 37, 58, 0.8) 0%,
//     rgba(24, 37, 58, 0.7) 50%,
//     rgba(24, 37, 58, 0.6) 100%
//   );
//   box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.35),
//     inset 0 2px 0 0 rgba(255, 255, 255, 0.1);
//   background-blend-mode: overlay;
//   z-index: 10;
//   height: 495px;
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   flex-direction: column;
//   color: #ffff;
//   height: 90%;
//   max-width: 495px;
//   min-width: 350px;
// `;

const Sign = styled.img``;

const FlexRow = styled.div`
  width: 526px;
  margin-top: 26px;
  ${flexBoxCenter}

  gap: 6px;
`;

const VerticalLine = styled.div`
  border-left: 1px solid #ffff;
  height: 56px;
`;
