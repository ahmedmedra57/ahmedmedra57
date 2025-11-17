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
import { loginService } from '../../services';
import { NOT_ALLOWED_ROLES, ROLES } from '../../constants';

const LoginBox = ({ isEnglish }) => {
  const navigation = useNavigate();
  // responsive design
  const isUserNotAllowed=(user)=>{
    return NOT_ALLOWED_ROLES.includes(user.user_role);
  }
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const { mutate: mutateLogin } = useMutation(loginService, {
    onSuccess: (data) => {
      if (data?.token) {
        if(isUserNotAllowed(data.user)){
          alert('You are not allowed to login');
          return;
        }
        navigation('/');
        localStorage.setItem('access_token', data.token);
        localStorage.setItem("loginTime", new Date());
        dispatch(handleAccessToken(data.token));
        dispatch(addUserInfo(data.user));
      }
    },
  });
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

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
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
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

  return (
    <>
      {isEnglish ? (
        <Wrapper>
          <FlexWrapper>
            <Title>login</Title>
            <Form onSubmit={handleSubmit}>
              <InputWrapper>
                <Input
                  type='text'
                  placeholder='account name'
                  value={username}
                  onChange={handleUserNameChange}
                ></Input>
              </InputWrapper>
              <InputWrapper>
                <Input
                  type='password'
                  placeholder='password'
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
                <P>remember my account name</P>
              </InputWrapper>
              <Button type='submit'>
                <P>enter</P>
              </Button>
              <Button>
                <P>edit account</P>
              </Button>
            </Form>
            <A>forgot your password?</A>
          </FlexWrapper>
        </Wrapper>
      ) : (
        <Wrapper>
          <FlexWrapper>
            <Title>login</Title>
            <Form onSubmit={handleSubmit}>
              <InputWrapper>
                <Input
                  type='text'
                  placeholder='account name'
                  value={username}
                  onChange={handleUserNameChange}
                ></Input>
              </InputWrapper>
              <InputWrapper>
                <Input
                  type='password'
                  placeholder='password'
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
                <P>Mémoriser mon mot de passe</P>
              </InputWrapper>
              <Button type='submit'>
                <P>entrer</P>
              </Button>
              <Button>
                <P>Modifier le compte</P>
              </Button>
            </Form>
            <A>Mot de passe oublié?</A>
          </FlexWrapper>
        </Wrapper>
      )}
    </>
  );
};

export default LoginBox;

// {isMobile ? (
//   <Wrapper>
//     <FlexWrapper>
//       <Title>login</Title>
//       <Form onSubmit={handleSubmit}>
//         <InputWrapper>
//           <Input
//             type='text'
//             placeholder='account name'
//             value={username}
//             onChange={handleUserNameChange}
//           ></Input>
//         </InputWrapper>
//         <InputWrapper>
//           <Input
//             type='password'
//             placeholder='password'
//             value={password}
//             onChange={handlePasswordChange}
//           ></Input>
//         </InputWrapper>
//         <InputWrapper isCheckBox={true}>
//           <Input
//             isCheckBox={true}
//             type='checkbox'
//             checked={remember}
//             onChange={handleRememberChange}
//           ></Input>
//           <P>remember my account name</P>
//         </InputWrapper>
//         <Button type='submit'>
//           <P>enter</P>
//         </Button>
//         <Button>
//           <P>edit account</P>
//         </Button>
//       </Form>
//       <P>forgot your password?</P>
//     </FlexWrapper>
//   </Wrapper>
// ) : (

const Wrapper = styled.div`
  max-width: 432px;

  height: 454px;

  background: transparent linear-gradient(180deg, #233a544d 0%, #060d19 100%);
  box-shadow: inset 0px 0px 2px #ffffff7a, 0px 0px 3px #000000;
  border: 0.5px solid #000000;
  border-radius: 12px;
  ${flexBoxCenter}

  @media only screen and ${devices.mm} {
    max-width: 412px;
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
`;

const InputWrapper = styled.div`
  ${({ isCheckBox }) =>
    isCheckBox
      ? css`
          width: 278px;
          height: 16px;
          /* margin-left: 64px; */
          ${justifyContentSpaceBetween}
          border-bottom:none;
        `
      : css`
          width: 332px;
          height: 20px;
          border-bottom: 1px solid #b4b4b4;
        `}
`;

const Input = styled.input`
  ${({ isCheckBox }) =>
    isCheckBox
      ? css`
          width: 10px;
          height: 10px;
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
  width: 208px;
  height: 29px;

  background: transparent linear-gradient(180deg, #3fb6e0 0%, #1f67be 100%);
  box-shadow: inset 0px 0px 1px #ffffffed, 0px 0px 2px #000000;
  border: 0.5px solid #000000;
  border-radius: 6px;

  ${flexBoxCenter}
`;

const P = styled.p`
  font-size: 12px;
  letter-spacing: 1.2px;
`;

const A = styled.a`
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 1.2px;
`;
