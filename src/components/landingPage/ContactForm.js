import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';

import { useMediaQuery } from 'react-responsive';
import { breakpoints, devices } from './landing-page-breakpoints/breakpoints';
import { flexBoxCenter } from '../styles/commonStyles';

const ContactForm = ({ isEnglish }) => {
  const isXl = useMediaQuery({ query: '(min-width:975px)' });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // !for backend to decide that to do with then onSubmit
  const onSubmit = (data) => console.log(data, 'data');

  return (
    <Wrapper>
      {isEnglish ? (
        <FlexColumn>
          <Title>get in touch</Title>
          <FlexRow>
            <FlexColumn>
              <Img src='/images/logo-footer.webp' isUmbrella={true} />
              <Text>
                2501 Avenue Dollard <br /> La Salle, Quebec <br />
                H2N 1S2
              </Text>
            </FlexColumn>
            <FlexColumn isMiddle={true}>
              {isXl && <EmptySpacing></EmptySpacing>}
              <Text>
                Tel: 514 933 - 1649 <br /> Toll free: 877 933 - 1649 <br /> Fax:
                514 933 - 2245 <br /> Email: sales@temporaheaters.com
              </Text>
            </FlexColumn>
            <FlexColumn>
              <Img src='/images/tempora-footer.webp' />
              <Text>
                795 George V. Avenue <br /> Lachine, Quebec <br /> H8S 1L2
              </Text>
            </FlexColumn>
          </FlexRow>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FlexColumn>
              <FlexRow isForm={true}>
                <FlexColumn isInputs={true}>
                  <Input
                    type='text'
                    placeholder='Name:'
                    {...register('name', { required: true, minLength: 3 })}
                    aria-invalid={errors.name ? 'true' : 'false'}
                  />
                  {errors.name?.type === 'required' && (
                    <ErrorTag role='alert'>Name is required</ErrorTag>
                  )}
                  <Input
                    type='email'
                    placeholder='Email:'
                    {...register('mail', {
                      required: 'Email Address is required',
                    })}
                    aria-invalid={errors.mail ? 'true' : 'false'}
                  />
                  {errors.mail && (
                    <ErrorTag role='alert'>{errors.mail.message}</ErrorTag>
                  )}
                  <Input
                    type='number'
                    placeholder='Phone:'
                    {...register('phone', { required: true, minLength: 9 })}
                    aria-invalid={errors.phone ? 'true' : 'false'}
                  />
                  {errors.phone?.type === 'required' && (
                    <ErrorTag role='alert'>phone number is required</ErrorTag>
                  )}
                </FlexColumn>
                <TextField
                  type='text'
                  placeholder='Message:'
                  {...register('message', { required: true, minLength: 10 })}
                  aria-invalid={errors.message ? 'true' : 'false'}
                />
                {errors.message?.type === 'required' && (
                  <ErrorTag role='alert'>Minimum 10 words is required</ErrorTag>
                )}
              </FlexRow>
              <Button type='submit'>send message</Button>
            </FlexColumn>
          </Form>
        </FlexColumn>
      ) : (
        <FlexColumn>
          <Title>CONTACTEZ-NOUS</Title>
          <FlexRow>
            <FlexColumn>
              <Img src='/images/logo-footer.webp' isUmbrella={true} />
              <Text>
                2501 Avenue Dollard <br /> La Salle, Quebec <br />
                H2N 1S2
              </Text>
            </FlexColumn>
            <FlexColumn isMiddle={true}>
              {isXl && <EmptySpacing></EmptySpacing>}
              <Text>
                Tel: 514 933 - 1649 <br /> Toll free: 877 933 - 1649 <br /> Fax:
                514 933 - 2245 <br /> Email: sales@temporaheaters.com
              </Text>
            </FlexColumn>
            <FlexColumn>
              <Img src='/images/tempora-footer.webp' />
              <Text>
                795 George V. Avenue <br /> Lachine, Quebec <br /> H8S 1L2
              </Text>
            </FlexColumn>
          </FlexRow>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FlexColumn>
              <FlexRow isForm={true}>
                <FlexColumn isInputs={true}>
                  <Input
                    type='text'
                    placeholder='Nom:'
                    {...register('name', { required: true, minLength: 3 })}
                    aria-invalid={errors.name ? 'true' : 'false'}
                  />
                  {errors.name?.type === 'required' && (
                    <ErrorTag role='alert'>Nom est requis</ErrorTag>
                  )}
                  <Input
                    type='email'
                    placeholder='Email:'
                    {...register('mail', {
                      required: 'Address Email est requis',
                    })}
                    aria-invalid={errors.mail ? 'true' : 'false'}
                  />
                  {errors.mail && (
                    <ErrorTag role='alert'>{errors.mail.message}</ErrorTag>
                  )}
                  <Input
                    type='number'
                    placeholder='Téléphone:'
                    {...register('phone', { required: true, minLength: 10 })}
                    aria-invalid={errors.phone ? 'true' : 'false'}
                  />
                  {errors.phone?.type === 'required' && (
                    <ErrorTag role='alert'>numéro de téléphone requis</ErrorTag>
                  )}
                </FlexColumn>
                <TextField
                  type='text'
                  placeholder='Message:'
                  {...register('message', { required: true, minLength: 10 })}
                  aria-invalid={errors.message ? 'true' : 'false'}
                />
                {errors.message?.type === 'required' && (
                  <ErrorTag role='alert'>Minimum 10 mots est requis</ErrorTag>
                )}
              </FlexRow>
              <Button type='submit'>envoyer le message</Button>
            </FlexColumn>
          </Form>
        </FlexColumn>
      )}
    </Wrapper>
  );
};

export default ContactForm;

const Wrapper = styled.div`
  /* height: 675px; */
  height: auto;
  padding: 20px 0;
  background-image: url('/images/map.webp');
  background-size: cover;
`;

const FlexColumn = styled.div`
  ${flexBoxCenter}
  flex-direction: column;
  gap: 24px;

  @media (max-width: ${breakpoints.md}) {
    width: 100%;
  }

  ${({ isMiddle }) =>
    isMiddle &&
    css`
      width: 294px;
    `}

  ${({ isInputs }) =>
    isInputs &&
    css`
      width: 36%;
    `}
`;

const Title = styled.h4`
  margin: 0;
  margin-top: 30px;
  text-transform: uppercase;
  font-size: 37px;
  font-weight: 600;
  color: rgb(24, 37, 58);
  line-height: 1.148;
  font-family: 'Roboto', sans-serif;
`;

const FlexRow = styled.div`
  width: 70%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  ${({ isForm }) =>
    isForm
      ? css`
          gap: 30px;
          width: 84%;
          justify-content: center;
          @media (max-width: ${breakpoints.md}) {
            flex-direction: column;
          }
        `
      : css`
          @media only screen and ${devices.xl} {
            align-items: flex-start;
            flex-direction: row;
          }
          flex-direction: column;
        `}
`;

const EmptySpacing = styled.div`
  height: 56px;
`;

const Img = styled.img`
  ${({ isUmbrella }) =>
    isUmbrella
      ? css`
          height: 26px;
          width: 272px;
          margin-top: 21px;
        `
      : css`
          width: 226px;
          height: 47px;
        `}
`;

const Text = styled.p`
  text-align: center;
  font-size: 18px;
  color: #212529;
  font-family: 'Roboto', sans-serif;
  text-transform: capitalize;
`;

const Form = styled.form`
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 60px;

  padding: 8px;

  font-size: 21px;
  color: rgb(24, 37, 58);
  font-weight: 700;
  line-height: 2.064;

  border: 2px solid rgb(24, 37, 58);
  border-radius: 8px;
  background-color: rgb(255, 255, 255);
  &::placeholder {
    text-align: left;
    color: rgb(24, 37, 58);
    text-transform: capitalize;
  }
  &:focus {
    border-color: #2e8cce;
    outline: none; /* Remove the default outline */
    box-shadow: 0 0 10px #2e8cce;
  }

  overflow: scroll;
`;

const TextField = styled.textarea`
  width: 36%;
  height: 226px;

  padding: 8px;

  font-size: 21px;
  color: rgb(24, 37, 58);
  font-weight: 700;

  border: 2px solid rgb(24, 37, 58);
  border-radius: 8px;
  background-color: rgb(255, 255, 255);
  &::placeholder {
    text-align: left;
    color: rgb(24, 37, 58);
    text-transform: capitalize;
  }
  &:focus {
    border-color: #2e8cce;
    outline: none; /* Remove the default outline */
    box-shadow: 0 0 10px #2e8cce;
  }
  @media (max-width: ${breakpoints.md}) {
    width: 100%;
  }

  overflow: scroll;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const Button = styled.button`
  cursor: pointer;
  height: 30px;
  width: 222px;
  padding: 0;
  border: none;
  color: #ffff;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 4px;
  background-color: #18253a;
`;

const ErrorTag = styled.p`
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  color: red;
`;
