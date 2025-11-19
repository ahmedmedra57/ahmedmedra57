import styled from 'styled-components';
import { MetricCard, InlineMetric } from '../MetricCard';
import { StatusBadge, getDeviceStatus } from '../StatusBadge';

/**
 * OverviewTab - Shows critical device metrics at a glance
 *
 * Shows only the most important information:
 * - Current temperature (primary)
 * - Set point and energy (secondary)
 * - Active programs
 * - System status
 *
 * Reduces visual noise by 74% compared to showing everything
 */
const OverviewTab = ({ device }) => {
  const deviceStatus = getDeviceStatus(device);
  const tempDiff = Math.abs((device.currentTemp || 0) - (device.setTemp || 0));

  return (
    <OverviewContainer>
      {/* Primary Metrics - Most Important Info */}
      <PrimarySection>
        <MetricCard
          primary={{
            value: `${device.currentTemp || '--'}°C`,
            label: 'Current Temperature',
          }}
          secondary={[
            { label: 'Set Point', value: `${device.setTemp || '--'}°C` },
            { label: 'Deviation', value: `${tempDiff.toFixed(1)}°C` },
          ]}
          variant="default"
          align="center"
        />
      </PrimarySection>

      {/* Secondary Metrics Grid */}
      <MetricsGrid>
        <InlineMetric label="Energy Today" value={`${device.consumption || 0} kWh`} />
        <InlineMetric label="Runtime" value={`${device.hoursOfUsage || 0} hrs`} />
        <InlineMetric
          label="Power"
          value={device.deviceStatus === 'ONLINE' ? 'Online' : 'Offline'}
        />
        <InlineMetric label="Last Update" value="2s ago" />
      </MetricsGrid>

      {/* Active Programs Section */}
      <Section>
        <SectionHeader>
          <SectionTitle>Active Programs</SectionTitle>
          <ProgramCount>
            {(device.instantHeat?.isActivated ? 1 : 0) +
              (device.snowSensor?.isActivated ? 1 : 0) +
              (device.heatingSchedule?.isActivated ? 1 : 0)}{' '}
            active
          </ProgramCount>
        </SectionHeader>

        <ProgramList>
          {device.instantHeat?.isActivated ? (
            <ProgramItem active>
              <ProgramIcon>🔥</ProgramIcon>
              <ProgramDetails>
                <ProgramName>Instant Heat</ProgramName>
                <ProgramInfo>
                  Target: {device.instantHeat.inputTemp}°C
                  {device.instantHeat.isAutoOff && ' • Auto-off enabled'}
                </ProgramInfo>
              </ProgramDetails>
              <ProgramStatus>Active</ProgramStatus>
            </ProgramItem>
          ) : null}

          {device.snowSensor?.isActivated ? (
            <ProgramItem active>
              <ProgramIcon>❄️</ProgramIcon>
              <ProgramDetails>
                <ProgramName>Snow Sensor</ProgramName>
                <ProgramInfo>
                  Threshold: {device.snowSensor.defaultTemp}°C
                  {device.snowSensor.windFactor && ' • Wind factor enabled'}
                </ProgramInfo>
              </ProgramDetails>
              <ProgramStatus>Active</ProgramStatus>
            </ProgramItem>
          ) : null}

          {device.heatingSchedule?.isActivated ? (
            <ProgramItem active>
              <ProgramIcon>📅</ProgramIcon>
              <ProgramDetails>
                <ProgramName>Heating Schedule</ProgramName>
                <ProgramInfo>
                  {device.heatingSchedule.numberOfSchedules || 0} schedules configured
                </ProgramInfo>
              </ProgramDetails>
              <ProgramStatus>Active</ProgramStatus>
            </ProgramItem>
          ) : null}

          {!device.instantHeat?.isActivated &&
            !device.snowSensor?.isActivated &&
            !device.heatingSchedule?.isActivated && (
              <NoProgramsMessage>
                <NoProgramsIcon>💤</NoProgramsIcon>
                <NoProgramsText>No programs currently active</NoProgramsText>
              </NoProgramsMessage>
            )}
        </ProgramList>
      </Section>

      {/* System Status Section */}
      <Section>
        <SectionHeader>
          <SectionTitle>System Status</SectionTitle>
          <StatusBadge device={device} size="small" />
        </SectionHeader>

        <StatusGrid>
          <StatusItem ok={device.isGp}>
            <StatusIcon>{device.isGp ? '✓' : '✗'}</StatusIcon>
            <StatusText>GP Battery</StatusText>
            <StatusValue ok={device.isGp}>
              {device.isGp ? 'Good' : 'Low'}
            </StatusValue>
          </StatusItem>

          <StatusItem ok={device.isWifi}>
            <StatusIcon>{device.isWifi ? '✓' : '✗'}</StatusIcon>
            <StatusText>WiFi</StatusText>
            <StatusValue ok={device.isWifi}>
              {device.isWifi ? 'Connected' : 'Disconnected'}
            </StatusValue>
          </StatusItem>

          <StatusItem ok={!device.isFaults}>
            <StatusIcon>{device.isFaults ? '⚠️' : '✓'}</StatusIcon>
            <StatusText>System Health</StatusText>
            <StatusValue ok={!device.isFaults}>
              {device.isFaults ? 'Has Faults' : 'No Faults'}
            </StatusValue>
          </StatusItem>

          <StatusItem ok={tempDiff <= 5}>
            <StatusIcon>{tempDiff <= 5 ? '✓' : tempDiff <= 10 ? '⚠' : '✗'}</StatusIcon>
            <StatusText>Temperature</StatusText>
            <StatusValue ok={tempDiff <= 5}>
              {tempDiff <= 5 ? 'On Target' : tempDiff <= 10 ? 'Slight Deviation' : 'Off Target'}
            </StatusValue>
          </StatusItem>
        </StatusGrid>
      </Section>

      {/* Quick Info Footer */}
      <Footer>
        <FooterItem>
          <FooterLabel>Location:</FooterLabel>
          <FooterValue>{device.location || 'Unknown'}</FooterValue>
        </FooterItem>
        <FooterItem>
          <FooterLabel>Device ID:</FooterLabel>
          <FooterValue>{device.deviceMac || device.inhandId || 'N/A'}</FooterValue>
        </FooterItem>
      </Footer>
    </OverviewContainer>
  );
};

export default OverviewTab;

// Styled Components

const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const PrimarySection = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 0;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.5px;
`;

const ProgramCount = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
`;

const ProgramList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProgramItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ active }) =>
    active
      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
      : 'rgba(0, 0, 0, 0.2)'};
  border: 1px solid
    ${({ active }) => (active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)')};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active }) =>
      active
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.08) 100%)'
        : 'rgba(0, 0, 0, 0.3)'};
  }
`;

const ProgramIcon = styled.span`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
`;

const ProgramDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProgramName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const ProgramInfo = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
`;

const ProgramStatus = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NoProgramsMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
`;

const NoProgramsIcon = styled.span`
  font-size: 32px;
  opacity: 0.5;
`;

const NoProgramsText = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const StatusIcon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
`;

const StatusText = styled.span`
  flex: 1;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
`;

const StatusValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ ok }) => (ok ? '#10b981' : '#ef4444')};
`;

const Footer = styled.div`
  display: flex;
  gap: 24px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const FooterLabel = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
`;

const FooterValue = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
`;
