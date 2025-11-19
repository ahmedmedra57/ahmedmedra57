import styled from 'styled-components';

/**
 * SettingsTab - Device configuration and preferences
 *
 * Shows:
 * - Device information
 * - Network settings
 * - Notification preferences
 * - Advanced configuration
 * - Maintenance options
 */
const SettingsTab = ({ device, onSettingChange }) => {
  const handleSettingToggle = (setting, value) => {
    if (onSettingChange) {
      onSettingChange(setting, value);
    }
  };

  return (
    <SettingsContainer>
      {/* Device Information */}
      <SettingSection>
        <SectionHeader>
          <SectionTitle>Device Information</SectionTitle>
        </SectionHeader>

        <InfoGrid>
          <InfoItem>
            <InfoLabel>Device Name</InfoLabel>
            <InfoValue>{device.machineName || 'Unnamed Device'}</InfoValue>
            <EditButton onClick={() => handleSettingToggle('name', device.machineName)}>
              ✏️
            </EditButton>
          </InfoItem>

          <InfoItem>
            <InfoLabel>MAC Address</InfoLabel>
            <InfoValue>{device.deviceMac || 'N/A'}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Inhand ID</InfoLabel>
            <InfoValue>{device.inhandId || 'N/A'}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Location</InfoLabel>
            <InfoValue>{device.location || 'Unknown'}</InfoValue>
            <EditButton onClick={() => handleSettingToggle('location', device.location)}>
              ✏️
            </EditButton>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Device Type</InfoLabel>
            <InfoValue>Heating System</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Firmware Version</InfoLabel>
            <InfoValue>v2.4.1</InfoValue>
          </InfoItem>
        </InfoGrid>
      </SettingSection>

      {/* Network Settings */}
      <SettingSection>
        <SectionHeader>
          <SectionTitle>Network Settings</SectionTitle>
        </SectionHeader>

        <SettingsList>
          <SettingItem>
            <SettingInfo>
              <SettingIcon>📶</SettingIcon>
              <SettingDetails>
                <SettingName>WiFi Connection</SettingName>
                <SettingDesc>
                  {device.isWifi ? 'Connected' : 'Disconnected'}
                </SettingDesc>
              </SettingDetails>
            </SettingInfo>
            <SettingStatus ok={device.isWifi}>
              {device.isWifi ? '✓ Connected' : '✗ Disconnected'}
            </SettingStatus>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingIcon>🔌</SettingIcon>
              <SettingDetails>
                <SettingName>GP Battery</SettingName>
                <SettingDesc>{device.isGp ? 'Good' : 'Low'}</SettingDesc>
              </SettingDetails>
            </SettingInfo>
            <SettingStatus ok={device.isGp}>
              {device.isGp ? '✓ Good' : '⚠ Low'}
            </SettingStatus>
          </SettingItem>

          <SettingItem clickable onClick={() => handleSettingToggle('network.advanced')}>
            <SettingInfo>
              <SettingIcon>⚙️</SettingIcon>
              <SettingDetails>
                <SettingName>Advanced Network Settings</SettingName>
                <SettingDesc>IP, DNS, Gateway configuration</SettingDesc>
              </SettingDetails>
            </SettingInfo>
            <ArrowIcon>›</ArrowIcon>
          </SettingItem>
        </SettingsList>
      </SettingSection>

      {/* Notifications */}
      <SettingSection>
        <SectionHeader>
          <SectionTitle>Notifications</SectionTitle>
        </SectionHeader>

        <SettingsList>
          <SettingItem>
            <SettingInfo>
              <SettingIcon>🔔</SettingIcon>
              <SettingDetails>
                <SettingName>Fault Alerts</SettingName>
                <SettingDesc>Notify when system faults occur</SettingDesc>
              </SettingDetails>
            </SettingInfo>
            <ToggleSwitch
              active={true}
              onClick={() => handleSettingToggle('notifications.faults', false)}
            >
              <ToggleSlider active={true} />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingIcon>🌡️</SettingIcon>
              <SettingDetails>
                <SettingName>Temperature Alerts</SettingName>
                <SettingDesc>Notify on temperature deviations</SettingDesc>
              </SettingDetails>
            </SettingInfo>
            <ToggleSwitch
              active={true}
              onClick={() => handleSettingToggle('notifications.temperature', false)}
            >
              <ToggleSlider active={true} />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingIcon>🔋</SettingIcon>
              <SettingDetails>
                <SettingName>Battery Alerts</SettingName>
                <SettingDesc>Notify when battery is low</SettingDesc>
              </SettingDetails>
            </SettingInfo>
            <ToggleSwitch
              active={true}
              onClick={() => handleSettingToggle('notifications.battery', false)}
            >
              <ToggleSlider active={true} />
            </ToggleSwitch>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingIcon>📊</SettingIcon>
              <SettingDetails>
                <SettingName>Daily Reports</SettingName>
                <SettingDesc>Send daily energy usage reports</SettingDesc>
              </SettingDetails>
            </SettingInfo>
            <ToggleSwitch
              active={false}
              onClick={() => handleSettingToggle('notifications.reports', true)}
            >
              <ToggleSlider active={false} />
            </ToggleSwitch>
          </SettingItem>
        </SettingsList>
      </SettingSection>

      {/* Temperature Settings */}
      <SettingSection>
        <SectionHeader>
          <SectionTitle>Temperature Settings</SectionTitle>
        </SectionHeader>

        <SettingsList>
          <SettingItem>
            <SettingInfo>
              <SettingIcon>🌡️</SettingIcon>
              <SettingDetails>
                <SettingName>Temperature Unit</SettingName>
                <SettingDesc>Celsius or Fahrenheit</SettingDesc>
              </SettingDetails>
            </SettingInfo>
            <UnitToggle>
              <UnitButton active onClick={() => handleSettingToggle('unit', 'C')}>
                °C
              </UnitButton>
              <UnitButton onClick={() => handleSettingToggle('unit', 'F')}>
                °F
              </UnitButton>
            </UnitToggle>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingIcon>⚠️</SettingIcon>
              <SettingDetails>
                <SettingName>Deviation Threshold</SettingName>
                <SettingDesc>Alert when temp differs by more than this amount</SettingDesc>
              </SettingDetails>
            </SettingInfo>
            <ThresholdInput
              type="number"
              defaultValue="10"
              onChange={(e) => handleSettingToggle('threshold', e.target.value)}
            />
            <ThresholdUnit>°C</ThresholdUnit>
          </SettingItem>
        </SettingsList>
      </SettingSection>

      {/* Maintenance */}
      <SettingSection>
        <SectionHeader>
          <SectionTitle>Maintenance</SectionTitle>
        </SectionHeader>

        <MaintenanceButtons>
          <MaintenanceButton onClick={() => handleSettingToggle('maintenance.restart')}>
            <ButtonIcon>🔄</ButtonIcon>
            <ButtonText>Restart Device</ButtonText>
          </MaintenanceButton>

          <MaintenanceButton onClick={() => handleSettingToggle('maintenance.reset')}>
            <ButtonIcon>⚙️</ButtonIcon>
            <ButtonText>Factory Reset</ButtonText>
          </MaintenanceButton>

          <MaintenanceButton onClick={() => handleSettingToggle('maintenance.calibrate')}>
            <ButtonIcon>🎯</ButtonIcon>
            <ButtonText>Calibrate Sensors</ButtonText>
          </MaintenanceButton>

          <MaintenanceButton onClick={() => handleSettingToggle('maintenance.update')}>
            <ButtonIcon>⬆️</ButtonIcon>
            <ButtonText>Check for Updates</ButtonText>
          </MaintenanceButton>
        </MaintenanceButtons>
      </SettingSection>

      {/* Danger Zone */}
      <DangerSection>
        <SectionHeader>
          <SectionTitle>Danger Zone</SectionTitle>
        </SectionHeader>

        <DangerButtons>
          <DangerButton onClick={() => handleSettingToggle('danger.disconnect')}>
            ⚠️ Disconnect Device
          </DangerButton>
          <DangerButton onClick={() => handleSettingToggle('danger.remove')}>
            🗑️ Remove Device
          </DangerButton>
        </DangerButtons>
      </DangerSection>
    </SettingsContainer>
  );
};

export default SettingsTab;

// Styled Components

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SettingSection = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
`;

const DangerSection = styled(SettingSection)`
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.05);
`;

const SectionHeader = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  min-width: 100px;
`;

const InfoValue = styled.span`
  flex: 1;
  font-size: 13px;
  color: #ffffff;
  font-weight: 600;
`;

const EditButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};

  &:hover {
    background: ${({ clickable }) =>
      clickable ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
  }
`;

const SettingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const SettingIcon = styled.span`
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
`;

const SettingDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SettingName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const SettingDesc = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const SettingStatus = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ ok }) => (ok ? '#10b981' : '#ef4444')};
`;

const ArrowIcon = styled.span`
  font-size: 24px;
  color: rgba(255, 255, 255, 0.5);
`;

const ToggleSwitch = styled.button`
  position: relative;
  width: 56px;
  height: 32px;
  background: ${({ active }) => (active ? '#10b981' : 'rgba(255, 255, 255, 0.2)')};
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    background: ${({ active }) => (active ? '#059669' : 'rgba(255, 255, 255, 0.3)')};
  }
`;

const ToggleSlider = styled.div`
  position: absolute;
  top: 4px;
  left: ${({ active }) => (active ? '28px' : '4px')};
  width: 24px;
  height: 24px;
  background: #ffffff;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const UnitToggle = styled.div`
  display: flex;
  gap: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 4px;
`;

const UnitButton = styled.button`
  padding: 6px 12px;
  background: ${({ active }) => (active ? 'rgba(59, 130, 246, 0.3)' : 'transparent')};
  border: ${({ active }) =>
    active ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent'};
  border-radius: 4px;
  color: ${({ active }) => (active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)')};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
    color: #ffffff;
  }
`;

const ThresholdInput = styled.input`
  width: 80px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const ThresholdUnit = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
`;

const MaintenanceButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

const MaintenanceButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const ButtonIcon = styled.span`
  font-size: 28px;
`;

const ButtonText = styled.span`
  font-size: 13px;
  font-weight: 600;
  text-align: center;
`;

const DangerButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DangerButton = styled.button`
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.3);
    border-color: rgba(239, 68, 68, 0.6);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.4);
  }
`;
