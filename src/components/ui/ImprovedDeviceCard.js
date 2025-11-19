import { useState } from 'react';
import styled from 'styled-components';
import { StatusBadge, StatusIndicator, getDeviceStatus } from './StatusBadge';
import { MetricCard, InlineMetric } from './MetricCard';

/**
 * ImprovedDeviceCard Component
 * Example implementation of Phase 1 UX improvements
 *
 * Features:
 * - Clear visual hierarchy (large temp, smaller secondary info)
 * - Status color coding
 * - Only 5 data points in collapsed state
 * - Clean, focused design
 *
 * Usage:
 * <ImprovedDeviceCard device={deviceData} location={locationName} />
 */

const Card = styled.div`
  background: rgba(35, 58, 84, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DeviceName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const LocationText = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
`;

const ExpandButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 6px 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
`;

const StatusItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &::after {
    content: '•';
    margin-left: 12px;
    color: rgba(255, 255, 255, 0.3);
  }

  &:last-child::after {
    display: none;
  }
`;

const ExpandedContent = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProgramList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const ProgramBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 6px;
  font-size: 12px;
  color: #10b981;
  width: fit-content;
`;

const NoPrograms = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
`;

const SystemStatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
`;

const SystemStatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${(props) => (props.$ok ? '#10b981' : '#ef4444')};
`;

export const ImprovedDeviceCard = ({ device, location, onExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = getDeviceStatus(device);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (onExpand) onExpand(!isExpanded);
  };

  // Calculate uptime
  const getLastUpdate = () => {
    // This would come from real data
    return '2 seconds ago';
  };

  return (
    <Card>
      <CardHeader>
        <HeaderLeft>
          <StatusIndicator device={device} />
          <div>
            <DeviceName>{device.machineName || 'Unknown Device'}</DeviceName>
            <LocationText>{location}</LocationText>
          </div>
        </HeaderLeft>
        <ExpandButton onClick={handleToggle}>
          {isExpanded ? '▲ Collapse' : '▼ Details'}
        </ExpandButton>
      </CardHeader>

      {/* Collapsed View - Only 5 Key Metrics */}
      <MetricCard
        variant="compact"
        primary={{
          value: `${device.currentTemp || '--'}°${device.instantHeat?.isF ? 'F' : 'C'}`,
          label: 'Current Temperature',
        }}
        secondary={[
          {
            label: 'Set Point',
            value: `${device.setTemp || '--'}°${device.instantHeat?.isF ? 'F' : 'C'}`,
          },
          {
            label: 'Energy',
            value: device.consumption
              ? `${device.consumption.toFixed(1)} kWh`
              : '--',
          },
        ]}
      />

      <StatusRow>
        <StatusItem>
          <StatusBadge device={device} size="small" />
        </StatusItem>
        <StatusItem>
          {device.isFaults ? '⚠️ Has Faults' : '✓ No Faults'}
        </StatusItem>
        <StatusItem>Last update: {getLastUpdate()}</StatusItem>
      </StatusRow>

      {/* Expanded View - Additional Details */}
      {isExpanded && (
        <ExpandedContent>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '12px',
            }}
          >
            Active Programs
          </h4>
          <ProgramList>
            {device.instantHeat?.isActivated && (
              <ProgramBadge>
                ✓ Instant Heat ({device.instantHeat.inputTemp}°
                {device.instantHeat.isF ? 'F' : 'C'})
              </ProgramBadge>
            )}
            {device.snowSensor?.isActivated && (
              <ProgramBadge>
                ✓ Snow Sensor (Threshold: {device.snowSensor.defaultTemp})
              </ProgramBadge>
            )}
            {device.windFactor?.isActivated && (
              <ProgramBadge>✓ Wind Factor</ProgramBadge>
            )}
            {device.optionalConstantTemp?.isActivated && (
              <ProgramBadge>
                ✓ Constant Temp ({device.optionalConstantTemp.inputTemp}°
                {device.optionalConstantTemp.isF ? 'F' : 'C'})
              </ProgramBadge>
            )}
            {!device.instantHeat?.isActivated &&
              !device.snowSensor?.isActivated &&
              !device.windFactor?.isActivated &&
              !device.optionalConstantTemp?.isActivated && (
                <NoPrograms>No active programs</NoPrograms>
              )}
          </ProgramList>

          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: '20px',
              marginBottom: '12px',
            }}
          >
            System Status
          </h4>
          <SystemStatusGrid>
            <SystemStatusItem $ok={device.isGp}>
              {device.isGp ? '✓' : '✗'} GP Battery
            </SystemStatusItem>
            <SystemStatusItem $ok={device.isEbp}>
              {device.isEbp ? '✓' : '✗'} EBP Battery
            </SystemStatusItem>
            <SystemStatusItem $ok={device.isWifi}>
              {device.isWifi ? '✓' : '✗'} WiFi
            </SystemStatusItem>
          </SystemStatusGrid>

          {device.hoursOfUsage && (
            <div style={{ marginTop: '16px' }}>
              <InlineMetric>
                <span className="label">Runtime Today:</span>
                <span className="value">{device.hoursOfUsage} hours</span>
              </InlineMetric>
            </div>
          )}
        </ExpandedContent>
      )}
    </Card>
  );
};

export default ImprovedDeviceCard;
