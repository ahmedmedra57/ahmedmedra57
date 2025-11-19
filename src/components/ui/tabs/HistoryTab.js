import styled from 'styled-components';

/**
 * HistoryTab - Telemetry data and usage history
 *
 * Shows:
 * - Temperature trends over time
 * - Energy consumption history
 * - System events log
 * - Usage statistics
 *
 * Separate from real-time data for better focus
 */
const HistoryTab = ({ device, telemetryData }) => {
  // Mock data for demonstration - replace with real telemetry data
  const recentEvents = [
    { time: '2 min ago', event: 'Temperature reached set point', type: 'info' },
    { time: '15 min ago', event: 'Instant Heat activated', type: 'success' },
    { time: '1 hour ago', event: 'Snow Sensor triggered', type: 'warning' },
    { time: '3 hours ago', event: 'Scheduled heating started', type: 'info' },
    { time: '5 hours ago', event: 'System power on', type: 'success' },
  ];

  const energyHistory = [
    { period: 'Last Hour', value: 2.3, unit: 'kWh' },
    { period: 'Today', value: 45.2, unit: 'kWh' },
    { period: 'Yesterday', value: 52.1, unit: 'kWh' },
    { period: 'This Week', value: 284.6, unit: 'kWh' },
    { period: 'This Month', value: 1124.8, unit: 'kWh' },
  ];

  return (
    <HistoryContainer>
      {/* Recent Activity Timeline */}
      <Section>
        <SectionHeader>
          <SectionTitle>Recent Activity</SectionTitle>
          <TimeFilter>Last 24 hours ▼</TimeFilter>
        </SectionHeader>

        <Timeline>
          {recentEvents.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineDot type={event.type} />
              <TimelineContent>
                <EventText>{event.event}</EventText>
                <EventTime>{event.time}</EventTime>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      {/* Energy Consumption */}
      <Section>
        <SectionHeader>
          <SectionTitle>Energy Consumption</SectionTitle>
          <ViewToggle>Chart / Table</ViewToggle>
        </SectionHeader>

        <EnergyGrid>
          {energyHistory.map((item, index) => (
            <EnergyCard key={index}>
              <EnergyPeriod>{item.period}</EnergyPeriod>
              <EnergyValue>
                {item.value} <EnergyUnit>{item.unit}</EnergyUnit>
              </EnergyValue>
            </EnergyCard>
          ))}
        </EnergyGrid>

        <ChartPlaceholder>
          <ChartIcon>📊</ChartIcon>
          <ChartText>Interactive energy chart will appear here</ChartText>
          <ChartSubtext>
            Connect to existing MainChart component for full visualization
          </ChartSubtext>
        </ChartPlaceholder>
      </Section>

      {/* Temperature Trends */}
      <Section>
        <SectionHeader>
          <SectionTitle>Temperature Trends</SectionTitle>
          <RangeSelector>
            <RangeButton active>24h</RangeButton>
            <RangeButton>7d</RangeButton>
            <RangeButton>30d</RangeButton>
          </RangeSelector>
        </SectionHeader>

        <TempStats>
          <StatCard>
            <StatLabel>Average</StatLabel>
            <StatValue>146.8°C</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Minimum</StatLabel>
            <StatValue>142.1°C</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Maximum</StatLabel>
            <StatValue>151.3°C</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Deviation</StatLabel>
            <StatValue>±2.4°C</StatValue>
          </StatCard>
        </TempStats>

        <ChartPlaceholder>
          <ChartIcon>📈</ChartIcon>
          <ChartText>Temperature trend chart will appear here</ChartText>
          <ChartSubtext>
            Integrate with existing telemetry visualization components
          </ChartSubtext>
        </ChartPlaceholder>
      </Section>

      {/* System Statistics */}
      <Section>
        <SectionHeader>
          <SectionTitle>System Statistics</SectionTitle>
        </SectionHeader>

        <StatsGrid>
          <StatsCard>
            <StatsIcon>⏱️</StatsIcon>
            <StatsContent>
              <StatsValue>{device.hoursOfUsage || 0}</StatsValue>
              <StatsLabel>Total Runtime Hours</StatsLabel>
            </StatsContent>
          </StatsCard>

          <StatsCard>
            <StatsIcon>🔄</StatsIcon>
            <StatsContent>
              <StatsValue>247</StatsValue>
              <StatsLabel>Heating Cycles</StatsLabel>
            </StatsContent>
          </StatsCard>

          <StatsCard>
            <StatsIcon>✅</StatsIcon>
            <StatsContent>
              <StatsValue>99.2%</StatsValue>
              <StatsLabel>Uptime</StatsLabel>
            </StatsContent>
          </StatsCard>

          <StatsCard>
            <StatsIcon>⚡</StatsIcon>
            <StatsContent>
              <StatsValue>{device.consumption || 0}</StatsValue>
              <StatsLabel>kWh Today</StatsLabel>
            </StatsContent>
          </StatsCard>
        </StatsGrid>
      </Section>

      {/* Export Options */}
      <ExportSection>
        <ExportTitle>Export Data</ExportTitle>
        <ExportButtons>
          <ExportButton>📄 Export as CSV</ExportButton>
          <ExportButton>📑 Export as PDF</ExportButton>
          <ExportButton>📧 Email Report</ExportButton>
        </ExportButtons>
      </ExportSection>
    </HistoryContainer>
  );
};

export default HistoryTab;

// Styled Components

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
`;

const TimeFilter = styled.button`
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ViewToggle = styled(TimeFilter)``;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 8px;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  position: relative;

  &:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 24px;
    width: 2px;
    height: calc(100% + 12px);
    background: rgba(255, 255, 255, 0.2);
  }
`;

const TimelineDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ type }) =>
    type === 'success'
      ? '#10b981'
      : type === 'warning'
      ? '#f59e0b'
      : type === 'error'
      ? '#ef4444'
      : '#3b82f6'};
  border: 3px solid rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  margin-top: 2px;
`;

const TimelineContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EventText = styled.p`
  font-size: 14px;
  color: #ffffff;
  margin: 0;
  font-weight: 500;
`;

const EventTime = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;

const EnergyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
`;

const EnergyCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const EnergyPeriod = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const EnergyValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
`;

const EnergyUnit = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
`;

const ChartPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 24px;
  background: rgba(0, 0, 0, 0.2);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
`;

const ChartIcon = styled.span`
  font-size: 48px;
  opacity: 0.5;
`;

const ChartText = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-weight: 500;
`;

const ChartSubtext = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  text-align: center;
  max-width: 400px;
`;

const RangeSelector = styled.div`
  display: flex;
  gap: 4px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 4px;
`;

const RangeButton = styled.button`
  padding: 6px 12px;
  background: ${({ active }) => (active ? 'rgba(59, 130, 246, 0.3)' : 'transparent')};
  border: ${({ active }) =>
    active ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent'};
  border-radius: 4px;
  color: ${({ active }) => (active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)')};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
    color: #ffffff;
  }
`;

const TempStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const StatsCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const StatsIcon = styled.span`
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
`;

const StatsContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatsValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
`;

const StatsLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
`;

const ExportSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
`;

const ExportTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const ExportButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ExportButton = styled.button`
  padding: 10px 16px;
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
