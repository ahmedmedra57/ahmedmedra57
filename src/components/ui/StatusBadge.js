import styled from 'styled-components';

/**
 * StatusBadge Component
 * Standardized status indicator with color coding
 *
 * Status Colors:
 * - Green (🟢): Normal operation
 * - Yellow (🟡): Warning
 * - Red (🔴): Critical/Fault
 * - Gray (⚪): Inactive/Off
 */

export const getDeviceStatus = (device) => {
  // Offline or no status
  if (!device.deviceStatus || device.deviceStatus === 'OFFLINE') {
    return {
      color: 'critical',
      icon: '🔴',
      label: 'Offline',
      bgColor: '#ef4444',
    };
  }

  // Has faults
  if (device.isFaults) {
    return {
      color: 'critical',
      icon: '🔴',
      label: 'Fault',
      bgColor: '#ef4444',
    };
  }

  // Device is off
  if (device.isOff) {
    return {
      color: 'inactive',
      icon: '⚪',
      label: 'Off',
      bgColor: '#6b7280',
    };
  }

  // Not activated (no programs running)
  if (!device.instantHeat?.isActivated && !device.snowSensor?.isActivated) {
    return {
      color: 'inactive',
      icon: '⚪',
      label: 'Inactive',
      bgColor: '#6b7280',
    };
  }

  // Check temperature deviation
  const tempDiff = Math.abs((device.currentTemp || 0) - (device.setTemp || 0));

  if (tempDiff <= 5) {
    return {
      color: 'normal',
      icon: '🟢',
      label: 'Normal',
      bgColor: '#10b981',
    };
  } else if (tempDiff <= 10) {
    return {
      color: 'warning',
      icon: '🟡',
      label: 'Warning',
      bgColor: '#f59e0b',
    };
  } else {
    return {
      color: 'critical',
      icon: '🔴',
      label: 'Over Temp',
      bgColor: '#ef4444',
    };
  }
};

const BadgeContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) => {
    switch (props.$status) {
      case 'normal':
        return 'rgba(16, 185, 129, 0.15)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.15)';
      case 'critical':
        return 'rgba(239, 68, 68, 0.15)';
      case 'inactive':
        return 'rgba(107, 114, 128, 0.15)';
      default:
        return 'rgba(107, 114, 128, 0.15)';
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case 'normal':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      case 'inactive':
        return '#9ca3af';
      default:
        return '#9ca3af';
    }
  }};
  border: 1px solid ${(props) => {
    switch (props.$status) {
      case 'normal':
        return 'rgba(16, 185, 129, 0.3)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.3)';
      case 'critical':
        return 'rgba(239, 68, 68, 0.3)';
      case 'inactive':
        return 'rgba(107, 114, 128, 0.3)';
      default:
        return 'rgba(107, 114, 128, 0.3)';
    }
  }};
`;

const StatusDot = styled.span`
  font-size: 10px;
  line-height: 1;
`;

export const StatusBadge = ({ device, showLabel = true, size = 'medium' }) => {
  const status = getDeviceStatus(device);

  return (
    <BadgeContainer $status={status.color} $size={size}>
      <StatusDot>{status.icon}</StatusDot>
      {showLabel && <span>{status.label}</span>}
    </BadgeContainer>
  );
};

/**
 * Large status indicator for collapsed cards
 */
const LargeStatusDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  box-shadow: 0 0 8px ${(props) => props.$color}66;
`;

export const StatusIndicator = ({ device }) => {
  const status = getDeviceStatus(device);

  return <LargeStatusDot $color={status.bgColor} title={status.label} />;
};

export default StatusBadge;
