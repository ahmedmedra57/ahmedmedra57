// libraries
import styled, { css } from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import { alignItemsFlexStart, flexBoxCenter } from '../styles/commonStyles';
import { breakpoints } from './landing-page-breakpoints/breakpoints';

const About = ({ isEnglish }) => {
  // french translation
  const frenchTranslationArr = [
    {
      title: "Piste D'audit et Traçabilité Complètes",
      text: "Fournit un rapport de connexion pour assurer la traçabilité de qui, quand, et combien de temps chaque utilisateur s'est connecté.",
    },
    {
      title: 'Compatible Avec les Pare-feu',
      text: "utilise une connexion sortante à travers le réseau local de l'usine (port HTTPS 443 ou UDP 1194). Aucune modification de l'informatique ou du pare-feu n'est nécessaire pour établir la communication. Un atout informatique essentiel !",
    },
    {
      title: 'Sécurité et Contrôle',
      text: "Un tunnel VPN entièrement sécurisé basé sur le protocole SSL est utilisé pour tout le trafic. Les informations échangées pendant la communication sont cryptées via SSL (clé de 2048 bits), ce qui permet aux seuls utilisateurs authentifiés de se conznecter. L'accès au VPN peut être contrôlé par un interrupteur à clé ou un bouton HMI pour activer ou désactiver manuellement la connexion VPN sur site, ce qui permet à l'utilisateur final de contrôler quand l'accès est disponible.",
    },
    {
      title: 'Vantage Point',
      text: "Accès et contrôle à distance en direct de tous les sites grâce à l'intégration de Smart Track. Les intégrateurs de systèmes dépannent à distance sans se rendre sur place, ce qui réduit considérablement les coûts d'assistance.",
    },
    {
      title: 'La Communication Facilitée',
      text: "L'administrateur se connecte à distance à son compte UMBRELLA et sélectionne le site auquel il souhaite se connecter via un tunnel VPN entièrement sécurisé. un tunnel VPN entièrement sécurisé.",
    },
    {
      title: 'Connectivité WiFi et Cellulaire Intégrée',
      text: "La capacité WiFi et cellulaire permet une connectivité Internet tout en évitant une connexion sur le réseau LAN de l'usine/de l'entreprise avec une bande passante élevée, un déploiement facile (pas de câblage) et facilite la gestion sécurisée du réseau.",
    },
  ];

  // english translation
  const englishTranslationArr = [
    {
      title: 'Full Audit Trail & Traceability',
      text: 'Provides a connection report to keep traceability about whom, when, and how long each user has connected.',
    },
    {
      title: 'Firewall Friendly',
      text: 'uses an outbound connection across the factory LAN (HTTPS port 443 or UDP 1194). No IT/firewall changes are needed to establish communication. A key IT asset!',
    },
    {
      title: 'Security & Control',
      text: 'A fully secure SSL-based VPN tunnel is used for all traffic. The information exchanged during the communication is encrypted via SSL (2048-bit key) allowing only authenticated users to connect. The VPN access can be controlled by a key switch or HMI button to manually enable or disable the VPN connection on-site letting the end user control when access is available.',
    },
    {
      title: 'Vantage Point',
      text: 'Direct live remote access & control of all locations through Smart Track Integration. System Integrators Troubleshoot remotely without going on site, drastically reducing support costs.',
    },
    {
      title: 'Communication Made Easy',
      text: 'The administrator remotely to log into his UMBRELLA account, and selects the location he wants to connect through a fully secure VPN tunnel.',
    },
    {
      title: 'Integrated WiFi & Cellular Connectivity',
      text: 'WiFi and cellular capable allows Internet connectivity while avoiding a connection on the factory/corporate LAN network with high bandwidth, easy deployment (no cabling) and facilitates secure network management.',
    },
  ];

  const isXl = useMediaQuery({ query: '(min-width:975px)' });

  return (
    <>
      {isEnglish ? (
        <Wrapper>
          {isXl && <Logo src='/images/logo-umbrella-01.webp' />}
          <Section>
            <LeftSection>
              <Logo2 src='/images/logo-umbrella-01.webp' />
              <Text>
                The ability of railway operators and maintenance engineers to
                prevent costly system faiuresdepends on real-time asset
                condition. UMBRELLA OS empowers the authorized user-asigned
                territory a single point of entry to oversee and manage all
                operational functionality of integrated critical assets spread
                across a globally distributed infrastructure.
                <br />
                <br />
                UMBRELLA OS integration constitutes an investment in safety,
                efficiency & resiliency through infrastructure modernisation
                improving network fluidity to meet growing demand by its ability
                to set future rail safety standards as an essential day to day
                operational tool further benefiting situational awareness and
                commuter safety.
              </Text>
            </LeftSection>
            <RightSection>
              {englishTranslationArr.map(({ title, text }) => {
                return (
                  <RightSideText key={title}>
                    <Title>{title}</Title>
                    <Text>{text}</Text>
                  </RightSideText>
                );
              })}
            </RightSection>
          </Section>
        </Wrapper>
      ) : (
        <Wrapper>
          {isXl && <Logo src='/images/logo-umbrella-01.webp' />}
          <Section>
            <LeftSection>
              <Logo2 src='/images/logo-umbrella-01.webp' />
              <Text>
                La capacité des opérateurs ferroviaires et des ingénieurs de
                maintenance à prévenir les défaillances coûteuses des systèmes
                dépend de l'état des actifs en temps réel. UMBRELLA OS permet à
                l'utilisateur autorisé - assigné à un territoire - de disposer
                d'un point d'entrée unique pour superviser et gérer toutes les
                fonctionnalités opérationnelles des actifs critiques intégrés
                répartis sur une infrastructure mondiale.
                <br />
                <br />
                L'intégration d'UMBRELLA OS constitue un investissement dans la
                sécurité, l'efficacité et la résilience grâce à la modernisation
                de l'infrastructure, améliorant ainsi la fluidité du réseau pour
                répondre à la demande croissante, grâce à sa capacité à définir
                les futures normes de sécurité ferroviaire en tant qu'outil
                opérationnel quotidien essentiel, améliorant ainsi la
                connaissance de la situation et la sécurité des voyageurs.
              </Text>
            </LeftSection>
            <RightSection>
              {frenchTranslationArr.map(({ title, text }) => {
                return (
                  <RightSideText key={title}>
                    <Title>{title}</Title>
                    <Text>{text}</Text>
                  </RightSideText>
                );
              })}
            </RightSection>
          </Section>
        </Wrapper>
      )}
    </>
  );
};

export default About;

const Wrapper = styled.div`
  height: auto;
  width: 100%;
  padding-top: 6%;
  padding-bottom: 6%;
  background-image: url('/images/base-on-water.jpg');
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  /* background-size: cover;
  background-attachment: scroll; */

  position: relative;
  ${flexBoxCenter}
`;

const Logo = styled.img`
  width: 360px;
  height: 43px;

  position: absolute;
  top: 10px;
  right: 80px;
`;

const Logo2 = styled.img`
  width: 90%;
  margin-bottom: 42px;
`;

const Section = styled.section`
  height: 80%;
  width: 100%;
  padding: 3% 0;
  background-color: rgba(0, 3, 8, 0.6);
  ${flexBoxCenter}
  gap: 30px;

  @media (max-width: ${breakpoints.xl}) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  width: 46%;

  ${alignItemsFlexStart}
  flex-direction: column;

  @media (max-width: ${breakpoints.xl}) {
    width: 85%;
  }
`;

const RightSection = styled.div`
  width: 46%;

  @media (max-width: ${breakpoints.xl}) {
    width: 85%;
  }
`;

const RightSideText = styled.div`
  height: 100%;
  width: 100%;
  margin-bottom: 4%;
`;

const Title = styled.h3`
  font-size: 18px;
  color: #ffff;
  margin-bottom: 2px;
  text-transform: capitalize;
  font-family: 'Roboto', sans-serif;
`;

const Text = styled.p`
  color: #ffff;
  font-size: 13px;
  font-family: 'Roboto', sans-serif;
  text-transform: capitalize;
  line-height: 1.844;
  margin-top: 10px;
`;
