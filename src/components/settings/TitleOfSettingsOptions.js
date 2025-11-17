import styled, { css } from 'styled-components';
import { useSelector } from 'react-redux';
import { selectSettingsOptions } from '../store/slices/settings/settingsOptionsSlice';
import {
  layerADark,
  flexBoxCenter,
  justifyContentSpaceBetween,
  justifyContentFlexStart,
} from '../styles/commonStyles';
import { useMediaQuery } from 'react-responsive';

function TitleOfAllSettings() {
  // // media query
  // const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const settingsOptionsState = useSelector(selectSettingsOptions);
  const {
    isUserProfileSelected,
    isUnitsSelected,
    isWindFactorSelected,
    isSnowSensorSelected,
    isForceAndCommandsSelected,
    isAdminSelected,
  } = settingsOptionsState.allSettingsOptions;

  const settingsTitles = isUserProfileSelected
    ? 'profile information'
    : isUnitsSelected
    ? 'units settings'
    : isWindFactorSelected
    ? 'wind factor trigger'
    : isSnowSensorSelected
    ? 'snow sensor trigger'
    : isForceAndCommandsSelected
    ? 'force & commands'
    : isAdminSelected
    ? 'administration settings'
    : 'interface mode';

  return (
    <Wrapper>
      <SubWrapper>
        <ContainerOptions>
          <SettingTitle>
            SETTINGS//SETTINGS OPTIONS//
            <Span>{settingsTitles}</Span>
          </SettingTitle>

          <UnitSettings>
            {settingsTitles}
            <Dots>
              .................................................................................................
            </Dots>
          </UnitSettings>
        </ContainerOptions>

        <Img src={'/images/settings-logo.svg'} />
      </SubWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 314px;
          height: 40px;
          margin-left: 4px;

          ${layerADark}
          border-radius: 30px;
          ${justifyContentFlexStart}
        `
      : css`
          width: 100%;
          height: 100%;

          ${flexBoxCenter}
        `}
`;

const SubWrapper = styled.div`
  width: 98%;
  height: 69%;
  border-bottom: 1px solid #fff;
  ${justifyContentSpaceBetween}
`;

const ContainerOptions = styled.div`
  height: auto;
  width: auto;

  display: flex;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  flex-direction: column;
`;

const SettingTitle = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css``
      : css`
          margin-bottom: 4px;
        `}
  font-size: 14px;
  color: #fff;
  letter-spacing: 1.4px;
`;

const Span = styled.span`
  color: #95ff45;
  font-size: 14px;
  text-transform: uppercase;
`;

const UnitSettings = styled.div`
  font-size: 20px;
  color: #fff;
  letter-spacing: 2px;

  margin-right: 13px;
  padding-bottom: 0.5px;
`;

const Dots = styled.span`
  letter-spacing: 4px;
`;

const Img = styled.img`
  height: 34px;
  width: 36px;
`;

export default TitleOfAllSettings;
