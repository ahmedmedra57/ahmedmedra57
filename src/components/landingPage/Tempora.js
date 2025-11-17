import styled, { css } from 'styled-components';

import { useState } from 'react';
import { breakpoints, devices } from './landing-page-breakpoints/breakpoints';
import { useMediaQuery } from 'react-responsive';
import {
  alignItemsFlexEnd,
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
} from '../styles/commonStyles';

const Tempora = ({ isEnglish }) => {
  const isLg = useMediaQuery({ query: '(min-width:750px)' });
  const isSm = useMediaQuery({ query: '(min-width:282px)' });

  const [toggleImages, setToggleImages] = useState([true, true, true]);

  const handleToggleImg = (Idx) => {
    const copyToggleImages = [...toggleImages];
    copyToggleImages[Idx] = !copyToggleImages[Idx];
    setToggleImages(copyToggleImages);
  };

  return (
    <Wrapper>
      {isEnglish ? (
        <FlexColumn>
          <LogoSection>
            <Logo src='/images/tempora.webp' alt='tempora' />
            <DivisionLine isBlack={true}></DivisionLine>
            <Title isBlackTitle={true}>
              TRACK TRANSIT & FREIGHT
              <br /> HEATING SYSTEMS
            </Title>
          </LogoSection>
          {/* electric track heating systems*/}
          <RedSection>
            <Container>
              <Flex>
                {isSm && (
                  <Logo
                    src='/images/VERTICAL_LOGO.webp'
                    isUmbrellaLogo={true}
                    alt='umbrella logo'
                  />
                )}

                <Img
                  src={
                    toggleImages[0]
                      ? '/images/train-track.png'
                      : '/images/electric-heater.png'
                  }
                >
                  <SmallRedTriangle
                    isPointingLeft={true}
                    onClick={() => handleToggleImg(0)}
                  ></SmallRedTriangle>
                  <SmallRedTriangle
                    onClick={() => handleToggleImg(0)}
                  ></SmallRedTriangle>
                </Img>
              </Flex>
              <FlexColumn RedDivision={true}>
                <Title>electric track heating systems</Title>
                <DivisionLine></DivisionLine>
                <Text>
                  Made of high density ceramic insulators and compacted using
                  high purity MgO for vibration protection and exceptional
                  dielectric strength ensuring the reliability needed in the
                  harshest conditions by its most comprehensive energy efficient
                  thermal transfer ratio HEATER to RAIL due by its excellent
                  contact along its entire length of the rail.
                </Text>
              </FlexColumn>
            </Container>
          </RedSection>
          {/* typhoon gas switch heating systems */}
          <RedSection>
            <Container>
              {isLg ? (
                <>
                  <FlexColumn RedDivision={true}>
                    <Title>typhoon gas switch heating systems</Title>
                    <DivisionLine></DivisionLine>
                    <Text>
                      The TYPHOON is a self-contained NFPA86 approved fuel train
                      Gas Powered (NG -PG) hot air switch blower system that
                      efficiently regulates its consumption based on track
                      conditions & requirements remotely in real time, &
                      integrated Video Monitoring Camera Powered by the UMBRELLA
                      OS platform.
                    </Text>
                    <LogoWrapper>
                      <Logo
                        src='/images/typhoon-logo.png'
                        alt='typhoon logo'
                        isTyphoon={true}
                      />
                    </LogoWrapper>
                  </FlexColumn>
                  <Flex>
                    <Img
                      src={
                        toggleImages[1]
                          ? '/images/heater.png'
                          : '/images/gas-heater.png'
                      }
                    >
                      <SmallRedTriangle
                        isPointingLeft={true}
                        onClick={() => handleToggleImg(1)}
                      ></SmallRedTriangle>
                      <SmallRedTriangle
                        onClick={() => handleToggleImg(1)}
                      ></SmallRedTriangle>
                    </Img>

                    <Logo
                      src='/images/VERTICAL_LOGO.webp'
                      alt='umbrella logo'
                      isUmbrellaLogo={true}
                      isFlipped={true}
                    />
                  </Flex>
                </>
              ) : (
                <>
                  <Flex>
                    <Img
                      src={
                        toggleImages[1]
                          ? '/images/heater.png'
                          : '/images/gas-heater.png'
                      }
                    >
                      <SmallRedTriangle
                        isPointingLeft={true}
                        onClick={() => handleToggleImg(1)}
                      ></SmallRedTriangle>
                      <SmallRedTriangle
                        onClick={() => handleToggleImg(1)}
                      ></SmallRedTriangle>
                    </Img>

                    {isSm && (
                      <Logo
                        src='/images/VERTICAL_LOGO.webp'
                        alt='umbrella logo'
                        isUmbrellaLogo={true}
                        isFlipped={true}
                      />
                    )}
                  </Flex>
                  <FlexColumn RedDivision={true}>
                    <Title>typhoon gas switch heating systems</Title>
                    <DivisionLine></DivisionLine>
                    <Text>
                      The TYPHOON is a self-contained NFPA86 approved fuel train
                      Gas Powered (NG -PG) hot air switch blower system that
                      efficiently regulates its consumption based on track
                      conditions & requirements remotely in real time, &
                      integrated Video Monitoring Camera Powered by the UMBRELLA
                      OS platform.
                    </Text>
                  </FlexColumn>
                </>
              )}
            </Container>
          </RedSection>
          {/* platform & surface heating technology */}
          <RedSection RedDivision={true}>
            <Container>
              <Flex>
                {isSm && (
                  <Logo
                    src='/images/VERTICAL_LOGO.webp'
                    alt='umbrella logo'
                    isUmbrellaLogo={true}
                    isFlipped={true}
                  />
                )}
                <Img
                  src={
                    toggleImages[2]
                      ? '/images/photo-platform.png'
                      : '/images/item_2.png'
                  }
                >
                  <SmallRedTriangle
                    isPointingLeft={true}
                    onClick={() => handleToggleImg(2)}
                  ></SmallRedTriangle>
                  <SmallRedTriangle
                    onClick={() => handleToggleImg(2)}
                  ></SmallRedTriangle>
                </Img>
              </Flex>
              <FlexColumn RedDivision={true}>
                <Title>platform & surface heating technology</Title>
                <DivisionLine></DivisionLine>
                <Text>
                  This innovative technology is an all-natural and
                  environmentally friendly approach to platform and surface
                  thermal winter protection offsetting millions of dollars in
                  maintenance costs, and extending the life cycle of assets
                  through structural integrity and conforming to all
                  transportation and ADA requirements and standards and
                  providing the resiliency, safety and reliability needed to
                  meet any winter condition with confidence.
                </Text>
              </FlexColumn>
            </Container>
          </RedSection>
          <BottomSection>
            <DivisionLine></DivisionLine>
            <BottomText>
              ENSURING THE SECURITY AND LIVEHOOD OF THE RAIL INDUSTRY IN THE
              HARSHEST OF CONDITIONS
            </BottomText>
          </BottomSection>
        </FlexColumn>
      ) : (
        <FlexColumn>
          {/* {French} */}
          <LogoSection>
            <Logo src='/images/tempora.webp' alt='tempora' />
            <DivisionLine isBlack={true}></DivisionLine>
            <Title isBlackTitle={true}>
              SYSTÈMES DE CHAUFFAGE <br />
              DU TRANSIT ET DU FRET
            </Title>
          </LogoSection>
          {/* electric track heating systems*/}
          <RedSection>
            <Container>
              <Flex>
                {isSm && (
                  <Logo
                    src='/images/VERTICAL_LOGO.webp'
                    alt='umbrella logo'
                    isUmbrellaLogo={true}
                    isFlipped={true}
                  />
                )}
                <Img
                  src={
                    toggleImages[0]
                      ? '/images/train-track.png'
                      : '/images/electric-heater.png'
                  }
                >
                  <SmallRedTriangle
                    isPointingLeft={true}
                    onClick={() => handleToggleImg(0)}
                  ></SmallRedTriangle>
                  <SmallRedTriangle
                    onClick={() => handleToggleImg(0)}
                  ></SmallRedTriangle>
                </Img>
              </Flex>
              <FlexColumn RedDivision={true}>
                <Title>SYSTÈMES DE CHAUFFAGE TYPHOON AU GAS</Title>
                <DivisionLine></DivisionLine>
                <Text>
                  Le TYPHOON est un système autonome de soufflerie d'aiguillage
                  à air chaud alimenté au gaz, approuvé par la norme NFPA86. (NG
                  -PG) qui régule efficacement sa consommation en fonction de
                  l'état de la voie et des besoins, à distance et en temps réel,
                  ainsi qu'une caméra de surveillance vidéo intégrée
                  fonctionnant sur la plateforme UMBRELLA OS.
                </Text>
              </FlexColumn>
            </Container>
          </RedSection>
          {/* typhoon gas switch heating systems */}
          <RedSection>
            <Container>
              {isLg ? (
                <>
                  <FlexColumn RedDivision={true}>
                    <Title>SYSTÈMES DE CHAUFFAGE TYPHOON AU GAS</Title>
                    <DivisionLine></DivisionLine>
                    <Text>
                      Le TYPHOON est un système autonome de soufflerie
                      d'aiguillage à air chaud alimenté au gaz, approuvé par la
                      norme NFPA86. (NG -PG) qui régule efficacement sa
                      consommation en fonction de l'état de la voie et des
                      besoins, à distance et en temps réel, ainsi qu'une caméra
                      de surveillance vidéo intégrée fonctionnant sur la
                      plateforme UMBRELLA OS.
                    </Text>
                    <LogoWrapper>
                      <Logo
                        src='/images/typhoon-logo.png'
                        alt='typhoon logo'
                        isTyphoon={true}
                      />
                    </LogoWrapper>
                  </FlexColumn>
                  <Flex>
                    <Img
                      src={
                        toggleImages[1]
                          ? '/images/heater.png'
                          : '/images/gas-heater.png'
                      }
                    >
                      <SmallRedTriangle
                        isPointingLeft={true}
                        onClick={() => handleToggleImg(1)}
                      ></SmallRedTriangle>
                      <SmallRedTriangle
                        onClick={() => handleToggleImg(1)}
                      ></SmallRedTriangle>
                    </Img>

                    <Logo
                      src='/images/VERTICAL_LOGO_FR.webp'
                      alt='umbrella logo'
                      isUmbrellaLogo={true}
                      isFlipped={true}
                    />
                  </Flex>
                </>
              ) : (
                <>
                  <Flex>
                    <Img
                      src={
                        toggleImages[1]
                          ? '/images/heater.png'
                          : '/images/gas-heater.png'
                      }
                    >
                      <SmallRedTriangle
                        isPointingLeft={true}
                        onClick={() => handleToggleImg(1)}
                      ></SmallRedTriangle>
                      <SmallRedTriangle
                        onClick={() => handleToggleImg(1)}
                      ></SmallRedTriangle>
                    </Img>

                    <Logo
                      src='/images/VERTICAL_LOGO_FR.webp'
                      alt='umbrella logo'
                      isUmbrellaLogo={true}
                      isFlipped={true}
                    />
                  </Flex>
                  <FlexColumn RedDivision={true}>
                    <Title>SYSTÈMES DE CHAUFFAGE TYPHOON AU GAS</Title>
                    <DivisionLine></DivisionLine>
                    <Text>
                      Le TYPHOON est un système autonome de soufflerie
                      d'aiguillage à air chaud alimenté au gaz, approuvé par la
                      norme NFPA86. (NG -PG) qui régule efficacement sa
                      consommation en fonction de l'état de la voie et des
                      besoins, à distance et en temps réel, ainsi qu'une caméra
                      de surveillance vidéo intégrée fonctionnant sur la
                      plateforme UMBRELLA OS.
                    </Text>
                    <Logo
                      src='/images/typhoon-logo.png'
                      alt='typhoon logo'
                      isTyphoon={true}
                    />
                  </FlexColumn>
                </>
              )}
            </Container>
          </RedSection>
          {/* platform & surface heating technology */}
          <RedSection RedDivision={true}>
            <Container>
              <Flex>
                {isSm && (
                  <Logo
                    src='/images/VERTICAL_LOGO.webp'
                    alt='umbrella logo'
                    isUmbrellaLogo={true}
                    isFlipped={true}
                  />
                )}
                <Img
                  src={
                    toggleImages[2]
                      ? '/images/photo-platform.png'
                      : '/images/item_2.png'
                  }
                >
                  <SmallRedTriangle
                    isPointingLeft={true}
                    onClick={() => handleToggleImg(2)}
                  ></SmallRedTriangle>
                  <SmallRedTriangle
                    onClick={() => handleToggleImg(2)}
                  ></SmallRedTriangle>
                </Img>
              </Flex>
              <FlexColumn RedDivision={true}>
                <Title>SYSTÈMES CHAUFFAGE POUR PLATE-FORME</Title>
                <DivisionLine></DivisionLine>
                <Text>
                  SYSTÈMES CHAUFFAGE POUR PLATE-FORME Cette technologie
                  innovante est une approche entièrement naturelle et écologique
                  de la protection thermique hivernale des plateformes et des
                  surfaces. protection thermique hivernale des plates-formes et
                  des surfaces, ce qui permet de compenser des millions de
                  dollars en coûts de maintenance et d'allonger le cycle de vie
                  des actifs grâce à une protection structurelle. prolongeant le
                  cycle de vie des actifs grâce à l'intégrité structurelle et en
                  se conformant à toutes les exigences et normes de transport et
                  de l'ADA et en fournissant la résilience, la sécurité et la
                  fiabilité nécessaires pour faire face à toutes les conditions
                  hivernales en toute confiance.
                </Text>
              </FlexColumn>
            </Container>
          </RedSection>
          <BottomSection>
            <DivisionLine></DivisionLine>
            <BottomText>
              ASSURER LA SÉCURITÉ ET LA SUBSISTANCE DE L'INDUSTRIE FERROVIAIRE
              DANS LES CONDITIONS LES PLUS DIFFICILES.
            </BottomText>
          </BottomSection>
        </FlexColumn>
      )}
    </Wrapper>
  );
};

export default Tempora;

const Wrapper = styled.div`
  height: auto;
  padding: 30px 0;

  background-attachment: scroll;
  background-size: 100% 230%;
  background-position: 100% 80%;
  background-image: url('/images/bg-tempora.png');

  @media only screen and ${devices.lg} {
    /* height: 1542px; */
    padding-top: 0;
    padding-bottom: 68px;
  }
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  ${({ RedDivision }) =>
    RedDivision
      ? css`
          width: 100%;
          margin-bottom: 46px;
          margin-top: 10px;
          @media only screen and ${devices.lg} {
            align-items: flex-start;
            justify-content: center;
            width: 60%;
            margin-right: 30px;
            margin-bottom: 0;
            position: relative;
          }
        `
      : css`
          gap: 14px;
        `}
`;

const LogoSection = styled.div`
  width: 100%;
  height: 25%;
  margin-top: 26px;
  ${flexBoxCenter}
  flex-direction: column;
`;

const LogoWrapper = styled.div`
  width: 100%;
  ${justifyContentFlexEnd}
`;

const Logo = styled.img`
  ${({ isUmbrellaLogo, isTyphoon }) =>
    isUmbrellaLogo
      ? css`
          width: 8%;
          height: 50%;

          ${({ isFlipped }) =>
            isFlipped &&
            css`
              transform: rotate(180deg);
            `}

          @media only screen and ${devices.md} {
            width: 32px;
            height: 185.5px;
          }
        `
      : isTyphoon
      ? css`
          width: 144px;
          height: 35px;
          margin-top: 10px;
          /* position: absolute;
          top: 84%;
          right: 0; */
        `
      : css`
          /* width: 538px;
          height: 108px; */
          width: 34%;
          height: 25%;
        `}
`;

const RedSection = styled.div`
  /* height: 500px; */
  height: auto;

  margin-top: 80px;
  background-color: rgb(100, 0, 0);
  padding: 26px 0;
  padding-right: 16px;
  /* padding-bottom: 26px; */
  background-clip: content-box;
  ${flexBoxCenter}
  &:nth-child(2) {
    margin-top: 40px;
  }
  @media only screen and ${devices.ll} {
    height: 350px;
    margin-top: 80px;
    padding-top: 24px;
    padding-bottom: 24px;
  }

  @media (max-width: ${breakpoints.mm}) {
    padding-right: 0;
  }
`;

const Container = styled.div`
  width: 90%;
  height: 100%;
  padding: 10px 0;
  ${flexBoxCenter};
  flex-direction: column;
  gap: 10px;
  @media only screen and ${devices.lg} {
    ${flexBoxCenter};
    flex-direction: row;
    padding: 0;
  }
`;

const Flex = styled.div`
  width: 100%;
  height: 310%;
  ${alignItemsFlexEnd}
  gap: 10px;
  @media only screen and ${devices.lg} {
    height: 100%;
    ${flexBoxCenter}
  }
`;

const DivisionLine = styled.div`
  ${({ isBlack }) =>
    isBlack
      ? css`
          width: 90%;
          border-top: 2px solid rgb(0, 3, 8);
          margin: 10px auto 10px;
        `
      : css`
          width: 100%;
          border-top: 2px solid #ffff;
          margin: 10px auto 10px;
        `}
`;

const Title = styled.h4`
  font-family: 'Zen Dots';
  text-transform: uppercase;

  ${({ isBlackTitle }) =>
    isBlackTitle
      ? css`
          margin-top: 4px;
          font-size: 14px;
          @media only screen and ${devices.md} {
            font-size: 18px;
          }
          @media only screen and ${devices.xl} {
            font-size: 28px;
          }
          font-weight: 400;
          color: #000000;
          line-height: 32px;
          text-align: center;
        `
      : css`
          font-size: 14px;
          font-weight: 500;
          color: #ffff;
          line-height: 18px;
          margin: 0;

          @media only screen and ${devices.lg} {
            font-size: 12px;
          }
          @media only screen and ${devices.xl} {
            font-size: 16px;
          }
          @media only screen and ${devices.xxl} {
            font-size: 18px;
          }
        `}
`;

const Img = styled.div`
  /* height: 350px;
  width: 570px; */
  transition: 1s;
  ${({ src }) =>
    css`
      background-image: url(${src});
    `};

  background-size: cover;
  ${justifyContentSpaceBetween}

  /* height:251px;
  width: 398px; */
  padding-top:0;

  @media only screen and ${devices.xs} {
    height: 365px;
    width: 100%;
    padding-top: 20px;
  }
  @media only screen and ${devices.lg} {
    height: 251px;
    width: 398px;
  }
  @media only screen and ${devices.xl} {
    height: 311.5px;
    width: 494px;
  }
  @media only screen and ${devices.xxl} {
    height: 350px;
    width: 570px;
  }
`;

const SmallRedTriangle = styled.div`
  cursor: pointer;
  ${({ isPointingLeft }) =>
    isPointingLeft
      ? css`
          width: 0;
          height: 0;
          border-top: 16px solid transparent;
          border-bottom: 16px solid transparent;

          border-right: 16px solid rgb(100, 0, 0);

          margin: 6px;
        `
      : css`
          width: 0;
          height: 0;
          border-top: 16px solid transparent;
          border-bottom: 16px solid transparent;

          border-left: 16px solid rgb(100, 0, 0);

          margin: 6px;
        `}
`;

const Text = styled.p`
  font-size: 16px;
  font-weight: 200;
  font-family: 'Outfit';
  text-transform: capitalize;
  line-height: 1.145;
  margin-bottom: 0;
  letter-spacing: 1px;
  color: rgb(255, 255, 255);

  /* 
  @media only screen and ${devices.xxl} {
    font-size: 16px;
  }
  @media only screen and ${devices.xxxl} {
    font-size: 16px;
  } */
`;

const BottomSection = styled.div`
  height: 20%;
  width: 86%;
  margin-top: 40px;
`;

const BottomText = styled.div`
  font-family: 'Zen Dots';
  font-size: 20px;
  color: #ffff;
  text-align: center;
`;
