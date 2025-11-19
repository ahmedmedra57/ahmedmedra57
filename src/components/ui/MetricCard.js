import styled from 'styled-components';

/**
 * MetricCard Component
 * Displays metrics with proper visual hierarchy
 *
 * Usage:
 * <MetricCard
 *   primary={{ value: "148°C", label: "Current Temperature" }}
 *   secondary={[
 *     { label: "Set Point", value: "150°C" },
 *     { label: "Energy", value: "45.2 kWh" }
 *   ]}
 * />
 */

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.$variant === 'compact' ? '8px' : '16px')};
  padding: ${(props) => (props.$variant === 'compact' ? '12px' : '20px')};
  background: ${(props) =>
    props.$variant === 'compact'
      ? 'transparent'
      : 'rgba(35, 58, 84, 0.3)'};
  border-radius: ${(props) => (props.$variant === 'compact' ? '0' : '8px')};
  ${(props) =>
    props.$variant !== 'compact' &&
    `border: 1px solid rgba(255, 255, 255, 0.1);`}
`;

const PrimaryMetricContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$align === 'center' ? 'center' : 'flex-start')};
  gap: 4px;
`;

const PrimaryValue = styled.div`
  font-size: ${(props) => {
    switch (props.$size) {
      case 'large':
        return '48px';
      case 'medium':
        return '36px';
      case 'small':
        return '24px';
      default:
        return '48px';
    }
  }};
  font-weight: 700;
  color: ${(props) => props.$color || '#ffffff'};
  line-height: 1;
  letter-spacing: -0.02em;
`;

const PrimaryLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SecondaryMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$columns === 1 ? '1fr' : 'repeat(auto-fit, minmax(120px, 1fr))'};
  gap: ${(props) => (props.$compact ? '8px' : '12px')};
`;

const SecondaryMetric = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SecondaryLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SecondaryValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.$color || 'rgba(255, 255, 255, 0.9)'};
`;

export const MetricCard = ({
  primary,
  secondary = [],
  variant = 'default', // 'default' | 'compact'
  align = 'left', // 'left' | 'center'
  primarySize = 'large', // 'small' | 'medium' | 'large'
  columns,
}) => {
  return (
    <CardContainer $variant={variant}>
      {primary && (
        <PrimaryMetricContainer $align={align}>
          <PrimaryValue $size={primarySize} $color={primary.color}>
            {primary.value}
          </PrimaryValue>
          {primary.label && <PrimaryLabel>{primary.label}</PrimaryLabel>}
        </PrimaryMetricContainer>
      )}

      {secondary.length > 0 && (
        <SecondaryMetricsGrid
          $columns={columns}
          $compact={variant === 'compact'}
        >
          {secondary.map((metric, index) => (
            <SecondaryMetric key={index}>
              <SecondaryLabel>{metric.label}</SecondaryLabel>
              <SecondaryValue $color={metric.color}>
                {metric.value}
              </SecondaryValue>
            </SecondaryMetric>
          ))}
        </SecondaryMetricsGrid>
      )}
    </CardContainer>
  );
};

/**
 * Simple metric display for inline use
 */
export const InlineMetric = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-size: ${(props) => props.$size || '14px'};

  .label {
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
  }

  .value {
    color: ${(props) => props.$color || '#ffffff'};
    font-weight: 600;
  }
`;

/**
 * Grid layout for multiple metrics
 */
export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
`;

export default MetricCard;
