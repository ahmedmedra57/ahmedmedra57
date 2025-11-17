import styled, { css } from 'styled-components';
import { devices, breakpoints } from './landing-page-breakpoints/breakpoints';

const Features = ({ isEnglish }) => {
  return (
    <Wrapper>
      <IndentWrapper>
        {isEnglish ? (
          <SmallWrapper>
            <IndivWrapper>
              <Div>
                <Img src='/images/umbrella-metal-logo.png' />
                <Title>PLATFORM</Title>
                <Text>
                  TEMPORA’S world first centralized monitoring & <br /> control
                  platform <br />
                  for distributed <br /> rail network.
                </Text>
              </Div>
            </IndivWrapper>
            <IndivWrapper>
              <Div>
                <Img src='/images/brain.png' />
                <Title>Smart e-Controls</Title>
                <Text>
                  Smart I-Management Energy efficient power Control enclosure.
                  <br />
                  <br />
                  Meteorological detection Sensors & response center. <br />
                  <br />
                  Thermal rail integration.
                </Text>
              </Div>
            </IndivWrapper>
            <IndivWrapper>
              <Div>
                <Img src='/images/monitoring.png' />
                <Title>site monitoring</Title>
                <Text>
                  24/7 On-site monitoring utilizing smart robotic speed-sphere
                  vision. Live streaming. Data & video logging.
                </Text>
              </Div>
            </IndivWrapper>
            <IndivWrapper>
              <Div>
                <Img src='/images/data-logging.png' />
                <Title>data logging</Title>
                <Text>
                  Data evolution & reporting. Direct communication & virtual
                  presence.
                </Text>
              </Div>
            </IndivWrapper>
          </SmallWrapper>
        ) : (
          <SmallWrapper>
            <IndivWrapper>
              <Div>
                <Img src='/images/umbrella-metal-logo.png' />
                <Title>Plateau</Title>
                <Text>
                  TEMPORA est la première plateforme centralisée de surveillance
                  et de contrôle
                  <br /> pour un réseau <br />
                  ferroviaire distribué.
                </Text>
              </Div>
            </IndivWrapper>
            <IndivWrapper>
              <Div>
                <Img src='/images/brain.png' />
                <Title>e-Controls</Title>
                <Text>
                  Smart <span>I-Management</span> Enceinte de contrôle de
                  l'énergie à haut rendement énergétique. <br />
                  <br />
                  Détection météorologique Capteurs et centre de réponse.
                  <br />
                  <br /> Intégration desrails thermiques. Smart I-Management
                </Text>
              </Div>
            </IndivWrapper>
            <IndivWrapper>
              <Div>
                <Img src='/images/monitoring.png' />
                <Title>Surveillance du site</Title>
                <Text>
                  20-24/7 Surveillance du site à l'aide d'un système robotique
                  intelligent vision de la sphère de vitesse. <br />
                  <br /> Diffusion en direct. <br />
                  <br />
                  Enregistrement de données et de vidéos.
                </Text>
              </Div>
            </IndivWrapper>
            <IndivWrapper>
              <Div>
                <Img src='/images/data-logging.png' />
                <Title>Enregistrement des données</Title>
                <Text>
                  Évolution des données et rapports.
                  <br />
                  <br />
                  Communication directe et présence virtuelle.
                </Text>
              </Div>
            </IndivWrapper>
          </SmallWrapper>
        )}
      </IndentWrapper>
    </Wrapper>
  );
};

export default Features;

const Wrapper = styled.div`
  /* height: 494px; */
  height: auto;
  width: auto;

  border-top: 1px solid #3b506c;
  padding: 16px;
  margin-right: 16px;
  background: linear-gradient(180deg, #1e2f49 0%, #131e2f 80%);

  @media (max-width: ${breakpoints.xl}) {
    height: 866px;
  }
  @media (max-width: 686px) {
    height: fit-content;
  }
  @media (max-width: ${breakpoints.mm}) {
    margin-right: 0;
  }
`;

const IndentWrapper = styled.div`
  height: auto;
  width: auto;
  background: #18253a;
  border-radius: 20px;
  box-shadow: inset 0px 0px 4px black;
  padding: 16px;
  border-bottom: 1px solid #253448;
  @media (max-width: 686px) {
    height: fit-content;
  }
`;

const SmallWrapper = styled.div`
  background: linear-gradient(180deg, #1f304b, #111a29);
  height: 92%;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0px 0px 4px black;
  border-top: 1px solid #40536e;
  padding: 35px 0;
  /* padding-top: 35px; */

  display: flex;

  @media (max-width: ${breakpoints.xl}) {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 95.5%;
  }
  @media (max-width: 686px) {
    height: fit-content;
  }
`;

const IndivWrapper = styled.div`
  flex: 0 0 auto;
  width: 25%;
  @media (max-width: ${breakpoints.xl}) {
    width: 45%;
  }
  @media (max-width: 686px) {
    width: 86%;
  }
`;

const Div = styled.div`
  max-width: 160px;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffff;
  flex-direction: column;
  text-align: center;
  margin: auto;
`;

const Img = styled.img`
  margin-bottom: 33px;
  height: 108px;
`;

const Title = styled.h3`
  position: relative;
  height: 48px;
  font-size: 16.667px;
  line-height: 1.2;
  margin-bottom: 25px;
  font-weight: bold;
  text-transform: uppercase;
  white-space: pre-line;

  &::after {
    content: '';
    position: absolute;
    width: 64px;
    height: 2px;
    background-color: #ffff;
    opacity: 50%;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Text = styled.p`
  font-size: 13px;
  white-space: pre-line;
  text-align: center;
  font-family: 'Roboto';
  text-transform: capitalize;
  line-height: 1.385;
`;
