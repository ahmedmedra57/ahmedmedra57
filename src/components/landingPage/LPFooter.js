import styled, { css } from 'styled-components';

import { breakpoints, devices } from './landing-page-breakpoints/breakpoints';
import { flexBoxCenter } from '../styles/commonStyles';

const LPFooter = () => {
  return (
    <Wrapper>
      <Img src='/images/home_page_footer_icon.svg' />
    </Wrapper>
  );
};

export default LPFooter;

const Wrapper = styled.div`
  height: 140px;
  width: 100vw;

  background: #18253a;
  border: 2px solid #18253a;
  ${flexBoxCenter};
`;

const Img = styled.img`
  width: 45%;
  height: 30%;

  @media only screen and ${devices.md} {
    width: 355.5px;
    height: 43px;
  }
`;
