import styled, { css } from 'styled-components';

/**
 * ControlsTab - Device activation and control settings
 *
 * Provides organized access to:
 * - Instant Heat controls
 * - Snow Sensor configuration
 * - Heating Schedule activation
 * - Wind Factor settings
 * - Auto-off configuration
 *
 * Much clearer than mixing controls with data in one view
 */
const ControlsTab = ({ device, onControlChange }) => {
  const handleToggle = (controlType, value) => {
    if (onControlChange) {
      onControlChange(controlType, value);
    }
  };

  return (
    <ControlsContainer>
      {/* Instant Heat Control */}
      <ControlSection>
        <ControlHeader>
          <ControlIcon>🔥</ControlIcon>
          <ControlInfo>
            <ControlTitle>Instant Heat</ControlTitle>
            <ControlDescription>
              Immediately heat to target temperature
            </ControlDescription>
          </ControlInfo>
          <ToggleSwitch
            active={device.instantHeat?.isActivated}
            onClick={() =>
              handleToggle('instantHeat', !device.instantHeat?.isActivated)
            }
          >
            <ToggleSlider active={device.instantHeat?.isActivated} />
          </ToggleSwitch>
        </ControlHeader>

        {device.instantHeat?.isActivated && (
          <ControlDetails>
            <ControlField>
              <FieldLabel>Target Temperature</FieldLabel>
              <FieldInput
                type="number"
                value={device.instantHeat?.inputTemp || 0}
                onChange={(e) =>
                  handleToggle('instantHeat.temp', e.target.value)
                }
              />
              <FieldUnit>°C</FieldUnit>
            </ControlField>

            <ControlField>
              <FieldLabel>Auto-Off</FieldLabel>
              <CheckboxWrapper>
                <Checkbox
                  type="checkbox"
                  checked={device.instantHeat?.isAutoOff || false}
                  onChange={(e) =>
                    handleToggle('instantHeat.autoOff', e.target.checked)
                  }
                />
                <CheckboxLabel>
                  Automatically turn off when target reached
                </CheckboxLabel>
              </CheckboxWrapper>
            </ControlField>

            <InfoBox>
              <InfoIcon>ℹ️</InfoIcon>
              <InfoText>
                Instant Heat will override other programs until target is
                reached or manually disabled.
              </InfoText>
            </InfoBox>
          </ControlDetails>
        )}
      </ControlSection>

      {/* Snow Sensor Control */}
      <ControlSection>
        <ControlHeader>
          <ControlIcon>❄️</ControlIcon>
          <ControlInfo>
            <ControlTitle>Snow Sensor & Wind Factor</ControlTitle>
            <ControlDescription>
              Automatic activation based on conditions
            </ControlDescription>
          </ControlInfo>
          <ToggleSwitch
            active={device.snowSensor?.isActivated}
            onClick={() =>
              handleToggle('snowSensor', !device.snowSensor?.isActivated)
            }
          >
            <ToggleSlider active={device.snowSensor?.isActivated} />
          </ToggleSwitch>
        </ControlHeader>

        {device.snowSensor?.isActivated && (
          <ControlDetails>
            <ControlField>
              <FieldLabel>Activation Threshold</FieldLabel>
              <FieldInput
                type="number"
                value={device.snowSensor?.defaultTemp || 0}
                onChange={(e) =>
                  handleToggle('snowSensor.threshold', e.target.value)
                }
              />
              <FieldUnit>°C</FieldUnit>
            </ControlField>

            <ControlField>
              <FieldLabel>Wind Factor</FieldLabel>
              <CheckboxWrapper>
                <Checkbox
                  type="checkbox"
                  checked={device.snowSensor?.windFactor || false}
                  onChange={(e) =>
                    handleToggle('snowSensor.windFactor', e.target.checked)
                  }
                />
                <CheckboxLabel>
                  Adjust heating based on wind conditions
                </CheckboxLabel>
              </CheckboxWrapper>
            </ControlField>

            <StatusIndicator active={device.snowSensor?.isActivated}>
              <StatusDot active={device.snowSensor?.isActivated} />
              <StatusLabel>
                {device.snowSensor?.isActivated
                  ? 'Sensor monitoring conditions'
                  : 'Sensor inactive'}
              </StatusLabel>
            </StatusIndicator>
          </ControlDetails>
        )}
      </ControlSection>

      {/* Heating Schedule Control */}
      <ControlSection>
        <ControlHeader>
          <ControlIcon>📅</ControlIcon>
          <ControlInfo>
            <ControlTitle>Heating Schedule</ControlTitle>
            <ControlDescription>
              Time-based automatic heating
            </ControlDescription>
          </ControlInfo>
          <ToggleSwitch
            active={device.heatingSchedule?.isActivated}
            onClick={() =>
              handleToggle(
                'heatingSchedule',
                !device.heatingSchedule?.isActivated
              )
            }
          >
            <ToggleSlider active={device.heatingSchedule?.isActivated} />
          </ToggleSwitch>
        </ControlHeader>

        {device.heatingSchedule?.isActivated && (
          <ControlDetails>
            <ScheduleInfo>
              <ScheduleCount>
                {device.heatingSchedule?.numberOfSchedules || 0}
              </ScheduleCount>
              <ScheduleLabel>Active Schedules</ScheduleLabel>
            </ScheduleInfo>

            <ActionButton onClick={() => handleToggle('schedule.manage')}>
              📝 Manage Schedules
            </ActionButton>

            <InfoBox>
              <InfoIcon>ℹ️</InfoIcon>
              <InfoText>
                Click "Schedules" tab to view and edit your heating schedule
                details.
              </InfoText>
            </InfoBox>
          </ControlDetails>
        )}
      </ControlSection>

      {/* System Power Control */}
      <ControlSection variant="danger">
        <ControlHeader>
          <ControlIcon>⚡</ControlIcon>
          <ControlInfo>
            <ControlTitle>System Power</ControlTitle>
            <ControlDescription>
              Turn device on or off completely
            </ControlDescription>
          </ControlInfo>
          <ToggleSwitch
            active={device.deviceStatus === 'ONLINE'}
            variant="danger"
            onClick={() =>
              handleToggle(
                'power',
                device.deviceStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE'
              )
            }
          >
            <ToggleSlider active={device.deviceStatus === 'ONLINE'} />
          </ToggleSwitch>
        </ControlHeader>

        {device.deviceStatus === 'OFFLINE' && (
          <WarningBox>
            <WarningIcon>⚠️</WarningIcon>
            <WarningText>
              Device is currently offline. All programs are disabled.
            </WarningText>
          </WarningBox>
        )}
      </ControlSection>

      {/* Quick Actions */}
      <QuickActions>
        <QuickActionTitle>Quick Actions</QuickActionTitle>
        <QuickActionButtons>
          <QuickButton onClick={() => handleToggle('quickAction.allOff')}>
            🔴 Turn All Off
          </QuickButton>
          <QuickButton onClick={() => handleToggle('quickAction.reset')}>
            🔄 Reset to Defaults
          </QuickButton>
          <QuickButton onClick={() => handleToggle('quickAction.boost')}>
            ⚡ Emergency Boost
          </QuickButton>
        </QuickActionButtons>
      </QuickActions>
    </ControlsContainer>
  );
};

export default ControlsTab;

// Styled Components

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ControlSection = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid
    ${({ variant }) =>
      variant === 'danger' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
    border-color: ${({ variant }) =>
      variant === 'danger' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const ControlHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ControlIcon = styled.span`
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
`;

const ControlInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ControlTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const ControlDescription = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
`;

const ToggleSwitch = styled.button`
  position: relative;
  width: 56px;
  height: 32px;
  background: ${({ active, variant }) =>
    active
      ? variant === 'danger'
        ? '#ef4444'
        : '#10b981'
      : 'rgba(255, 255, 255, 0.2)'};
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    background: ${({ active, variant }) =>
      active
        ? variant === 'danger'
          ? '#dc2626'
          : '#059669'
        : 'rgba(255, 255, 255, 0.3)'};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px
      ${({ active, variant }) =>
        active
          ? variant === 'danger'
            ? 'rgba(239, 68, 68, 0.3)'
            : 'rgba(16, 185, 129, 0.3)'
          : 'rgba(255, 255, 255, 0.2)'};
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

const ControlDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ControlField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

const FieldInput = styled.input`
  width: 100%;
  max-width: 200px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const FieldUnit = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
`;

const InfoBox = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
`;

const InfoIcon = styled.span`
  font-size: 16px;
`;

const InfoText = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.5;
`;

const WarningBox = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px;
  margin-top: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
`;

const WarningIcon = styled.span`
  font-size: 16px;
`;

const WarningText = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.5;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ active }) => (active ? '#10b981' : '#6b7280')};
`;

const StatusLabel = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const ScheduleInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const ScheduleCount = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #3b82f6;
`;

const ScheduleLabel = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ActionButton = styled.button`
  padding: 12px 16px;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.4);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.3);
    border-color: rgba(59, 130, 246, 0.6);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
`;

const QuickActionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const QuickActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
`;

const QuickButton = styled.button`
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }
`;
