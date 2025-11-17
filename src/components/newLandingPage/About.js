// libraries
import styled, { css } from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import { alignItemsFlexStart, flexBoxCenter } from '../styles/commonStyles';
import { breakpoints } from './landing-page-breakpoints/breakpoints';

const About = ({ isEnglish }) => {
  const englishAboutContent = {
    paragraph_1:
      'The ability of railway operators and maintenance engineers to prevent costly system failures depends on real-time asset condition. UMBRELLA OS empowers the authorized user-assigned territory a single point of entry to oversee and manage all operational functionality of integrated critical assets spread across a globally distributed infrastructure.',
    paragraph_2:
      'UMBRELLA OS integration constitutes an investment in safety, efficiency & resiliency through infrastructure modernization improving network fluidity to meet growing demand by its ability to set future rail safety standards as an essential day to day operational tool further benefiting situational awareness and commuter safety.',
  };

  const frenchAboutContent = {
    paragraph_1:
      "La capacité des opérateurs ferroviaires et des ingénieurs de maintenance à prévenir les défaillances coûteuses des systèmes dépend de l'état des actifs en temps réel. UMBRELLA OS permet à l'utilisateur autorisé - assigné à un territoire - de disposer d'un point d'entrée unique pour superviser et gérer toutes les fonctionnalités opérationnelles des actifs critiques intégrés répartis sur une infrastructure mondiale.",
    paragraph_2:
      "L'intégration d'UMBRELLA OS constitue un investissement dans la sécurité, l'efficacité et la résilience grâce à la modernisation de l'infrastructure, améliorant ainsi la fluidité du réseau pour répondre à la demande croissante, grâce à sa capacité à définir les futures normes de sécurité ferroviaire en tant qu'outil opérationnel quotidien essentiel, améliorant ainsi la connaissance de la situation et la sécurité des voyageurs.",
  };

  const selectedAboutContent = isEnglish
    ? englishAboutContent
    : frenchAboutContent;

  // french translation
  const frenchFourSquare = [
    {
      key: '01',
      title: "Piste D'audit et Traçabilité Complètes",
      text: "Fournit un rapport de connexion pour assurer la traçabilité de qui, quand, et combien de temps chaque utilisateur s'est connecté.",
    },
    {
      key: '04',
      title: 'Vantage Point',
      text: "Accès et contrôle à distance en direct de tous les sites grâce à l'intégration de Smart Track. Les intégrateurs de systèmes dépannent à distance sans se rendre sur place, ce qui réduit considérablement les coûts d'assistance.",
    },
    {
      key: '02',
      title: 'Compatible Avec les Pare-feu',
      text: "utilise une connexion sortante à travers le réseau local de l'usine (port HTTPS 443 ou UDP 1194). Aucune modification de l'informatique ou du pare-feu n'est nécessaire pour établir la communication. Un atout informatique essentiel !",
    },
    { key: 'img', img: '/images/umbrella-metal-logo.png' },
  ];

  const frenchDoubleSquare = [
    {
      key: '03',
      title: 'Sécurité et Contrôle',
      text: "Un tunnel VPN entièrement sécurisé basé sur le protocole SSL est utilisé pour tout le trafic. Les informations échangées pendant la communication sont cryptées via SSL (clé de 2048 bits), ce qui permet aux seuls utilisateurs authentifiés de se conznecter. L'accès au VPN peut être contrôlé par un interrupteur à clé ou un bouton HMI pour activer ou désactiver manuellement la connexion VPN sur site, ce qui permet à l'utilisateur final de contrôler quand l'accès est disponible.",
    },
    {
      key: '05',
      title: 'La Communication Facilitée',
      text: "L'administrateur se connecte à distance à son compte UMBRELLA et sélectionne le site auquel il souhaite se connecter via un tunnel VPN entièrement sécurisé. un tunnel VPN entièrement sécurisé.",
    },
  ];

  const frenchSingleSquare = [
    {
      key: '06',
      title: 'Connectivité WiFi et Cellulaire Intégrée',
      text: "La capacité WiFi et cellulaire permet une connectivité Internet tout en évitant une connexion sur le réseau LAN de l'usine/de l'entreprise avec une bande passante élevée, un déploiement facile (pas de câblage) et facilite la gestion sécurisée du réseau.",
    },
  ];

  // english translation
  const englishFourSquare = [
    {
      key: '01',
      title: 'Full Audit Trail & Traceability',
      text: 'Provides a connection report to keep traceability about whom, when, and how long each user has connected.',
    },
    {
      key: '04',
      title: 'Vantage Point',
      text: 'Direct live remote access & control of all locations through Smart Track Integration. System Integrators Troubleshoot remotely without going on site, drastically reducing support costs.',
    },
    {
      key: '02',
      title: 'Firewall Friendly',
      text: 'uses an outbound connection across the factory LAN (HTTPS port 443 or UDP 1194). No IT/firewall changes are needed to establish communication. A key IT asset!',
    },
    { key: 'img', img: '/images/umbrella-metal-logo.png' },
  ];

  const englishDoubleSquare = [
    {
      key: '03',
      title: 'Security & Control',
      text: 'A fully secure SSL-based VPN tunnel is used for all traffic. The information exchanged during the communication is encrypted via SSL (2048-bit key) allowing only authenticated users to connect. The VPN access can be controlled by a key switch or HMI button to manually enable or disable the VPN connection on-site letting the end user control when access is available.',
    },
    {
      key: '05',
      title: 'Communication Made Easy',
      text: 'The administrator remotely to log into his UMBRELLA account, and selects the location he wants to connect through a fully secure VPN tunnel.',
    },
  ];

  const englishSingleSquare = [
    {
      key: '06',
      title: 'Integrated WiFi & Cellular Connectivity',
      text: 'WiFi and cellular capable allows Internet connectivity while avoiding a connection on the factory/corporate LAN network with high bandwidth, easy deployment (no cabling) and facilitates secure network management.',
    },
  ];

  const englishJoinedSquares = {
    fourSquare: englishFourSquare,
    singleSquare: englishSingleSquare,
    doubleSquare: englishDoubleSquare,
  };

  const frenchJoinedSquares = {
    fourSquare: frenchFourSquare,
    singleSquare: frenchSingleSquare,
    doubleSquare: frenchDoubleSquare,
  };

  const sevenContentBox = isEnglish
    ? englishJoinedSquares
    : frenchJoinedSquares;

  // english translation
  const englishCellphoneSquare = [
    {
      key: '01',
      title: 'Full Audit Trail & Traceability',
      text: 'Provides a connection report to keep traceability about whom, when, and how long each user has connected.',
    },

    {
      key: '02',
      title: 'Firewall Friendly',
      text: 'uses an outbound connection across the factory LAN (HTTPS port 443 or UDP 1194). No IT/firewall changes are needed to establish communication. A key IT asset!',
    },
    {
      key: '03',
      title: 'Security & Control',
      text: 'A fully secure SSL-based VPN tunnel is used for all traffic. The information exchanged during the communication is encrypted via SSL (2048-bit key) allowing only authenticated users to connect. The VPN access can be controlled by a key switch or HMI button to manually enable or disable the VPN connection on-site letting the end user control when access is available.',
    },
    {
      key: '04',
      title: 'Vantage Point',
      text: 'Direct live remote access & control of all locations through Smart Track Integration. System Integrators Troubleshoot remotely without going on site, drastically reducing support costs.',
    },
    {
      key: '05',
      title: 'Communication Made Easy',
      text: 'The administrator remotely to log into his UMBRELLA account, and selects the location he wants to connect through a fully secure VPN tunnel.',
    },
    {
      key: '06',
      title: 'Integrated WiFi & Cellular Connectivity',
      text: 'WiFi and cellular capable allows Internet connectivity while avoiding a connection on the factory/corporate LAN network with high bandwidth, easy deployment (no cabling) and facilitates secure network management.',
    },
  ];

  const frenchCellphoneSquare = [
    {
      key: '01',
      title: "Piste D'audit et Traçabilité Complètes",
      text: "Fournit un rapport de connexion pour assurer la traçabilité de qui, quand, et combien de temps chaque utilisateur s'est connecté.",
    },
    {
      key: '02',
      title: 'Compatible Avec les Pare-feu',
      text: "utilise une connexion sortante à travers le réseau local de l'usine (port HTTPS 443 ou UDP 1194). Aucune modification de l'informatique ou du pare-feu n'est nécessaire pour établir la communication. Un atout informatique essentiel !",
    },
    {
      key: '03',
      title: 'Sécurité et Contrôle',
      text: "Un tunnel VPN entièrement sécurisé basé sur le protocole SSL est utilisé pour tout le trafic. Les informations échangées pendant la communication sont cryptées via SSL (clé de 2048 bits), ce qui permet aux seuls utilisateurs authentifiés de se conznecter. L'accès au VPN peut être contrôlé par un interrupteur à clé ou un bouton HMI pour activer ou désactiver manuellement la connexion VPN sur site, ce qui permet à l'utilisateur final de contrôler quand l'accès est disponible.",
    },
    {
      key: '04',
      title: 'Vantage Point',
      text: "Accès et contrôle à distance en direct de tous les sites grâce à l'intégration de Smart Track. Les intégrateurs de systèmes dépannent à distance sans se rendre sur place, ce qui réduit considérablement les coûts d'assistance.",
    },
    {
      key: '05',
      title: 'La Communication Facilitée',
      text: "L'administrateur se connecte à distance à son compte UMBRELLA et sélectionne le site auquel il souhaite se connecter via un tunnel VPN entièrement sécurisé. un tunnel VPN entièrement sécurisé.",
    },
    {
      key: '06',
      title: 'Connectivité WiFi et Cellulaire Intégrée',
      text: "La capacité WiFi et cellulaire permet une connectivité Internet tout en évitant une connexion sur le réseau LAN de l'usine/de l'entreprise avec une bande passante élevée, un déploiement facile (pas de câblage) et facilite la gestion sécurisée du réseau.",
    },
  ];

  const cellphoneSquareContent = isEnglish
    ? englishCellphoneSquare
    : frenchCellphoneSquare;

  const cellphoneSize = useMediaQuery({ query: '(max-width:975px)' });

  return (
    <>
      <Wrapper>
        <ContentWrapper firstItem={true}>
          <ImgLogo src='/images/logo-umbrella-01.webp' alt='umbrella os logo' />
          {cellphoneSize && (
            <LogoImg
              src='/images/umbrella-metal-logo.png'
              alt='square metal logo'
            />
          )}
          <>
            <Text>{selectedAboutContent.paragraph_1}</Text>
            <br/>
            <br/>
            <Text>{selectedAboutContent.paragraph_2}</Text>
          </>
        </ContentWrapper>
        <ContentWrapper secondItem={true}>
          <Img src='/images/base-on-water.jpg' alt='oil rig on water' />
        </ContentWrapper>
        <ContentWrapper>
          {cellphoneSize ? (
            <>
              {cellphoneSquareContent.map(({ key, title, text }) => (
                <Item key={key}>
                  <NumberTitle>{key}</NumberTitle>
                  <Title>{title}</Title>
                  <P>{text}</P>
                </Item>
              ))}
            </>
          ) : (
            <>
              <FlexBox>
                <FourContainer>
                  {sevenContentBox.fourSquare.map(
                    ({ key, title, text, img }, idx) => (
                      <Item key={key} idx={key}>
                        {key === 'img' ? (
                          <LogoImg src={img} alt='square metal logo' />
                        ) : (
                          <>
                            <NumberTitle badge={idx === 0}>{key}</NumberTitle>
                            <Title>{title}</Title>
                            <P>{text}</P>
                          </>
                        )}
                      </Item>
                    )
                  )}
                </FourContainer>
                <SingleContainer>
                  {sevenContentBox.singleSquare.map(({ key, title, text }) => (
                    <Item key={key} idx={key}>
                      <NumberTitle>{key}</NumberTitle>
                      <Title>{title}</Title>
                      <P>{text}</P>
                    </Item>
                  ))}
                </SingleContainer>
              </FlexBox>
              <FlexBox>
                <DoubleContainer>
                  {sevenContentBox.doubleSquare.map(({ key, title, text }) => (
                    <Item key={key} idx={key}>
                      <NumberTitle>{key}</NumberTitle>
                      <Title>{title}</Title>
                      <P>{text}</P>
                    </Item>
                  ))}
                </DoubleContainer>
              </FlexBox>
            </>
          )}
        </ContentWrapper>
      </Wrapper>
    </>
  );
};

export default About;

const Wrapper = styled.div`
  height: auto;
  width: 100%;
  padding: 128px 0px;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 48px;

  /* @media (max-width: ${breakpoints.xl}) {
    background: var(
      --gradient-blue,
      linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
      linear-gradient(180deg, #233a54 0%, #233a54 44%, #060d19 100%)
    );
  } */
`;

const ContentWrapper = styled.section`
  width: 1196px;
  ${({ firstItem, secondItem }) =>
    firstItem
      ? css`
          height: 340px;
          padding: 36px 68px 70px 68px;
          ${flexBoxCenter}
          flex-direction: column;
          gap: 12px;

          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);

          @media (max-width: ${breakpoints.xl}) {
            width: 80%;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.05);
            gap: 24px;
            padding: 24px;
          }
        `
      : secondItem
      ? css`
          height: 497px;
          @media (max-width: ${breakpoints.xl}) {
            width: 89%;
          }
        `
      : css`
          height: 1024px;
          ${flexBoxCenter}
          gap: 30px;

          @media (max-width: ${breakpoints.xl}) {
            width: 89%;
            flex-direction: column;
            gap: 30px;
          }
        `}
  ${flexBoxCenter}

  @media (max-width: ${breakpoints.xl}) {
    height: auto;
  }
`;

const FlexBox = styled.div`
  height: inherit;
  width: inherit;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 30px;
`;

const FourContainer = styled.div`
  width: 788px;
  height: 727px;
  ${flexBoxCenter}
  flex-direction: column;
  flex-wrap: wrap;
  gap: 30px;
`;

const SingleContainer = styled.div`
  height: 322px;
  width: 788px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const DoubleContainer = styled.div`
  width: 380px;
  height: 1110px;

  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 30px;
`;

const Item = styled.div`
  width: 380px;
  height: 340px;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;

  text-transform: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);

  ${({ idx }) =>
    idx === '01' || idx === '02' || idx === '04'
      ? css`
          padding: 36px 24px 72px 24px;
        `
      : idx === 'img'
      ? css`
          background: inherit;
          ${flexBoxCenter}
        `
      : idx === '05'
      ? css`
          height: 552px;
          padding: 62px 24px;
          justify-content: flex-start;
          gap: 17px;
        `
      : idx === '03'
      ? css`
          height: 480px;
          padding: 62px 24px;
          justify-content: flex-start;
          gap: 17px;
        `
      : css`
          width: 788px;
          padding: 62px 24px;
          gap: 17px;
        `}

  @media (max-width: ${breakpoints.xl}) {
    height: auto;
    width: 100%;
    padding: 36px 24px;
    ${flexBoxCenter}
    flex-direction: column;
    gap: 17px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const NumberTitle = styled.p`
  height: 61px;
  color: #fff;
  font-family: Inter;
  font-size: 72px;
  font-style: normal;
  font-weight: 700;
  line-height: 27px;
  ${flexBoxCenter}
`;

const ImgLogo = styled.img`
  width: 412px;
  height: 47px;
  padding: 0.008px 0.026px 0.025px 0px;
  ${flexBoxCenter}

  @media (max-width: ${breakpoints.xl}) {
    width: 210px;
    height: 26px;
  }
`;

const Img = styled.img`
  width: inherit;
  height: inherit;

  border-radius: 12px;
  background: url(<path-to-image>) lightgray 50% / cover no-repeat;
`;

const LogoImg = styled.img`
  width: 201px;
  height: 197px;

  @media (max-width: ${breakpoints.xl}) {
    width: 163px;
    height: 160px;
  }
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
  color: #fff;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;

  /* font-size: 18px;
  color: #ffff;
  margin-bottom: 2px;
  text-transform: capitalize;
  font-family: 'Roboto', sans-serif; */
`;

const Text = styled.p`
  width: 1050px;
  color: #fff;
  text-align: justify;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  text-transform: none;
  line-height: 24px;
  @media (max-width: ${breakpoints.xl}) {
    width: 80%;
  }
`;

const P = styled.p`
  color: rgba(255, 255, 255, 0.6);
  text-align: justify;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0.4px;
`;
