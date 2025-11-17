import styled, { css } from 'styled-components';
import { devices, breakpoints } from './landing-page-breakpoints/breakpoints';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
} from '../styles/commonStyles';
import { useState } from 'react';
import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUserInfo, handleAccessToken } from '../store/slices/userSlice';
import { useMutation } from 'react-query';
import { loginService, resetPasswordService } from '../../services';
import { NOT_ALLOWED_ROLES, ROLES } from '../../constants';

const LoginBox = ({ isEnglish }) => {
  const englishTextContent = [
    {
      login: 'login',
      rememberAccount: 'remember my account name',
      enter: 'enter',
      forgotPassword: 'forgot your password?',
      enterAccountName: 'enter your account name to reset password',
      send: 'send',
      placeholderAccountName: 'account name',
      placeholderPassword: 'password',
      error:"invalid username or password",
    },
  ];

  const frenchTextContent = [
    {
      login: 'login',
      rememberAccount: 'Mémoriser mon nom de compte',
      enter: 'entrer',
      forgotPassword: 'Mot de passe oublié?',
      enterAccountName:
        'Entrez votre nom de compte pour réinitialiser le mot de passe.',
      send: 'envoyer',
      placeholderAccountName: 'nom de compte',
      placeholderPassword: 'mot de passe',
      error:"Nom d'utilisateur ou mot de passe invalide",
    },
  ];

  const loggedContent = isEnglish ? englishTextContent : frenchTextContent;

  const navigation = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  // responsive design
  const isUserNotAllowed = (user) => {
    return NOT_ALLOWED_ROLES.includes(user.user_role);
  };
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const { mutate: mutateLogin } = useMutation(loginService, {
    onSuccess: (data) => {
      if (data?.token) {
        if (isUserNotAllowed(data.user)) {
          alert('You are not allowed to login');
          return;
        }
        navigation('/');
        localStorage.setItem('access_token', data.token);
        localStorage.setItem('loginTime', new Date());
        dispatch(handleAccessToken(data.token));
        dispatch(addUserInfo(data.user));
      }
    },
    onError:(err)=>{
      const errorText = loggedContent[0]?.error || 'Invalid username or password';
       setErrorMessage(errorText);
    }
  });
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [resetAccount, setResetAccount] = useState('');
  const [displayResetPasswordBox, setDisplayResetPasswordBox] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('rememberedUsername');

    if (storedUsername) {
      setUsername(storedUsername);
      setRemember(true);
    }
  }, []);

  const handleRememberChange = (event) => {
    setRemember(event.target.checked);
    if (event.target.checked) {
      localStorage.setItem('rememberedUsername', username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }
  };

  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
    setErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage('');
  };

  useEffect(() => {
    if (remember) {
      localStorage.setItem('rememberedUsername', username);
    }
  }, [username, remember]);

  const handleSubmit = (e) => {
    e.preventDefault();
    mutateLogin({ username, password, remember });
  };

  const handleDisplayResetPasswordBox = () => {
    setDisplayResetPasswordBox((prev) => !prev);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const response = resetPasswordService(resetAccount);
  };

  const handleResetPasswordAccountName = (e) => {
    setResetAccount(e.target.value);
  };

  return (
    <>
      {loggedContent.map(
        ({
          login,
          rememberAccount,
          enter,
          forgotPassword,
          enterAccountName,
          send,
          placeholderAccountName,
          placeholderPassword,
          
        }) => (
          <Wrapper key={enter}>
            <InnerWrapper>
              <FlexWrapper>
                <Title>{login}</Title>
                <Form onSubmit={handleSubmit}>
                  <InputWrapper>
                    <Input
                      type='text'
                      placeholder={placeholderAccountName}
                      value={username}
                      onChange={handleUserNameChange}
                    ></Input>
                  </InputWrapper>
                  <InputWrapper>
                    <Input
                      type='password'
                      placeholder={placeholderPassword}
                      value={password}
                      onChange={handlePasswordChange}
                    ></Input>
                  </InputWrapper>
                  <InputWrapper isCheckBox={true}>
                    <Input
                      isCheckBox={true}
                      type='checkbox'
                      checked={remember}
                      onChange={handleRememberChange}
                    ></Input>
                    <RememberAccountLabel>
                      {rememberAccount}
                    </RememberAccountLabel>
                  </InputWrapper>
                 { errorMessage && <p style={{color:"red",fontSize:"20px",textAlign:"center"}}>{errorMessage}</p> }
                  <Button type='submit'>
                    <InnerButton>
                      <SmallButton>
                        <SmallInnerButton>
                          <P>{enter}</P>
                        </SmallInnerButton>
                      </SmallButton>
                    </InnerButton>
                  </Button>
                </Form>
                <ForgotPasswordButton onClick={handleDisplayResetPasswordBox}>
                  {forgotPassword}
                </ForgotPasswordButton>
                {displayResetPasswordBox && (
                  <Form onSubmit={handleResetPassword}>
                    <BaseLayer>
                      <MainLayer>
                        <LabelBaseLayer>
                          <Label>{enterAccountName}</Label>
                        </LabelBaseLayer>
                        <Input
                          resetPassword={true}
                          type='text'
                          placeholder={placeholderAccountName}
                          value={resetAccount}
                          onChange={handleResetPasswordAccountName}
                        ></Input>
                        <ButtonBaseLayer>
                          <Button type='submit' sendButton={true}>
                            <P>{send}</P>
                          </Button>
                        </ButtonBaseLayer>
                      </MainLayer>
                    </BaseLayer>
                  </Form>
                )}
              </FlexWrapper>
            </InnerWrapper>
          </Wrapper>
        )
      )}
    </>
  );
};

export default LoginBox;
const Wrapper = styled.section`
  display: flex;
  padding: 4px;
  align-items: center;
  gap: 10px;

  border-radius: 10px;
  background: rgba(19, 32, 51, 0.2);
  box-shadow: 0px 0px 2px 0px #000 inset;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
  }
`;

const InnerWrapper = styled.div`
  width: 397px;
  height: 595px;
  padding: 40px 10px;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 20px;

  border-radius: 6px;
  border: 1px solid #000;
  background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15) 0%,
      rgba(0, 0, 0, 0.15) 100%
    ),
    linear-gradient(
      180deg,
      rgba(35, 58, 84, 0.15) 0%,
      rgba(35, 58, 84, 0.15) 44%,
      rgba(6, 13, 25, 0.15) 100%
    );
  box-shadow: 1px 1px 1px 0px rgba(255, 255, 255, 0.25) inset,
    0px 0px 4px 0px #000;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
  }
`;

const FlexWrapper = styled.div`
  width: 100%;
  height: 380px;
  ${justifyContentSpaceBetween}
  flex-direction: column;
`;

const Title = styled.p`
  font-size: 16px;
  letter-spacing: 1.6px;
`;

const Form = styled.form`
  width: 372px;
  height: 318px;
  ${justifyContentSpaceEvenly}
  flex-direction: column;

  @media (max-width: ${breakpoints.xl}) {
    width: 80%;
  }
`;

const InputWrapper = styled.div`
  ${({ isCheckBox }) =>
    isCheckBox
      ? css`
          width: 278px;
          height: auto;
          /* margin-left: 64px; */
          ${justifyContentSpaceBetween}
          gap:8px;
          border-bottom: none;
        `
      : css`
          width: 332px;
          height: 20px;
          border-bottom: 1px solid #b4b4b4;
        `}

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
  }
`;

const Input = styled.input`
  ${({ isCheckBox, resetPassword }) =>
    isCheckBox
      ? css`
          width: 10px;
          height: 10px;
        `
      : resetPassword
      ? css`
          width: 334px;
          height: 19px;
          padding: 1px;

          ${flexBoxCenter}

          border-radius: 18px;
          background: var(
            --Light_blue_100,
            linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.2) 0%,
              rgba(0, 0, 0, 0.2) 100%
            ),
            #233a54
          );

          /* IN */
          box-shadow: 0px 0px 3px 0px #000 inset;

          &::placeholder {
            font-size: 10px;
            color: #b4b4b4;
            text-align: center;
          }

          @media (max-width: ${breakpoints.xl}) {
            width: 100%;
          }
        `
      : css`
          width: 100%;
          height: 100%;
          background-color: transparent;
          font-size: 12px;
          text-align: left;
          &::placeholder {
            color: #b4b4b4;
            text-align: left;
          }
        `}
`;

const Button = styled.button`
  ${({ sendButton }) =>
    sendButton
      ? css`
          width: 332px;
          padding: 2px 8px;
          ${flexBoxCenter}
          gap: 8px;

          border-radius: 16px;
          border: 0.5px solid #000;
          background: linear-gradient(180deg, #233a54 0%, #060d19 100%);

          /* OUT */
          box-shadow: 0px 0.5px 1px 0px rgba(255, 255, 255, 0.25) inset;
        `
      : css`
          padding: 2px;

          border-radius: 22px;
          background: rgba(35, 58, 84, 0.4);

          /* INNER BLACK SHADOW */
          box-shadow: 0px 0px 2px 0px #000 inset;
          ${flexBoxCenter}
          gap: 4px;
        `}/* @media (max-width: ${breakpoints.xl}) {
    width: 100%;
  } */
`;

const InnerButton = styled.div`
  padding: 3px;

  border-radius: 20px;
  border: 0.5px solid #000;
  background: linear-gradient(180deg, #233a54 0%, #060d19 100%);

  /* OUT */
  box-shadow: 0px 0.5px 1px 0px rgba(255, 255, 255, 0.25) inset;

  ${flexBoxCenter}
  gap: 8px;
`;

const SmallButton = styled.div`
  padding: 1px;

  border-radius: 18px;
  background: var(
    --Light_blue_100,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    #233a54
  );

  /* IN */
  box-shadow: 0px 0px 3px 0px #000 inset;

  ${flexBoxCenter}
`;

const SmallInnerButton = styled.div`
  width: 332px;
  padding: 2px 8px;

  border-radius: 16px;
  border: 0.5px solid #000;
  background: linear-gradient(180deg, #233a54 0%, #060d19 100%);

  /* OUT */
  box-shadow: 0px 0.5px 1px 0px rgba(255, 255, 255, 0.25) inset;

  ${flexBoxCenter}
  gap: 8px;

  @media (max-width: ${breakpoints.xl}) {
    width: 174px;
  }
`;

const P = styled.p`
  font-size: 12px;
  letter-spacing: 1.2px;

  @media (max-width: ${breakpoints.xl}) {
    font-size: 10px;
    letter-spacing: 1px;
  }
`;

const RememberAccountLabel = styled.label`
  font-size: 12px;
  letter-spacing: 1.2px;
  @media (max-width: ${breakpoints.xl}) {
    font-size: 10px;
    letter-spacing: 1px;
  }
`;

const ForgotPasswordButton = styled.button`
  /* cursor: pointer; */
  font-size: 12px;
  letter-spacing: 1.2px;

  @media (max-width: ${breakpoints.xl}) {
    width: 60%;
    font-size: 8px;
    letter-spacing: 1px;
  }
`;

const BaseLayer = styled.div`
  padding: 2px;
  ${flexBoxCenter}
  gap: 4px;

  border-radius: 15px;
  background: rgba(35, 58, 84, 0.4);

  /* INNER BLACK SHADOW */
  box-shadow: 0px 0px 2px 0px #000 inset;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
  }
`;

const MainLayer = styled.div`
  padding: 3px;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 4px;

  border-radius: 13px;
  border: 0.5px solid #000;
  background: linear-gradient(180deg, #233a54 0%, #060d19 100%);

  /* OUT */
  box-shadow: 0px 0.5px 1px 0px rgba(255, 255, 255, 0.25) inset;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
  }
`;
const LabelBaseLayer = styled.div`
  padding: 1px;
  ${flexBoxCenter}

  border-radius: 18px;
  background: var(
    --Light_blue_100,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    #233a54
  );

  /* IN */
  box-shadow: 0px 0px 3px 0px #000 inset;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
  }
`;

const Label = styled.label`
  width: 332px;
  height: 22px;
  padding: 2px 8px;
  font-size: 10px;

  ${flexBoxCenter}
  gap: 8px;

  border-radius: 16px;
  border: 0.5px solid #000;
  background: linear-gradient(180deg, #233a54 0%, #060d19 100%);

  /* OUT */
  box-shadow: 0px 0.5px 1px 0px rgba(255, 255, 255, 0.25) inset;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
    font-size: 8px;
  }
`;

const ButtonBaseLayer = styled.div`
  padding: 1px;
  ${flexBoxCenter}

  border-radius: 18px;
  background: var(
    --Light_blue_100,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    #233a54
  );

  /* IN */
  box-shadow: 0px 0px 3px 0px #000 inset;

  @media (max-width: ${breakpoints.xl}) {
    width: 100%;
  }
`;
