import styled from 'styled-components';

/**
 * SchedulesTab - Heating schedule management
 *
 * Shows:
 * - Active schedules list
 * - Schedule create/edit interface
 * - Quick schedule templates
 * - Schedule preview
 */
const SchedulesTab = ({ device, onScheduleChange }) => {
  // Mock schedules - replace with actual data
  const schedules = device.heatingSchedule?.schedules || [
    {
      id: 1,
      name: 'Weekday Morning',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: '06:00',
      endTime: '09:00',
      targetTemp: 150,
      enabled: true,
    },
    {
      id: 2,
      name: 'Weekend All Day',
      days: ['Sat', 'Sun'],
      startTime: '08:00',
      endTime: '20:00',
      targetTemp: 145,
      enabled: true,
    },
    {
      id: 3,
      name: 'Evening Warmup',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: '17:00',
      endTime: '22:00',
      targetTemp: 148,
      enabled: false,
    },
  ];

  const handleScheduleToggle = (scheduleId, enabled) => {
    if (onScheduleChange) {
      onScheduleChange('toggle', scheduleId, enabled);
    }
  };

  const handleScheduleEdit = (scheduleId) => {
    if (onScheduleChange) {
      onScheduleChange('edit', scheduleId);
    }
  };

  const handleScheduleDelete = (scheduleId) => {
    if (onScheduleChange) {
      onScheduleChange('delete', scheduleId);
    }
  };

  return (
    <SchedulesContainer>
      {/* Header with Add Button */}
      <SchedulesHeader>
        <HeaderInfo>
          <HeaderTitle>Heating Schedules</HeaderTitle>
          <HeaderSubtitle>
            {schedules.filter((s) => s.enabled).length} of {schedules.length} active
          </HeaderSubtitle>
        </HeaderInfo>
        <AddButton onClick={() => onScheduleChange && onScheduleChange('create')}>
          + Add Schedule
        </AddButton>
      </SchedulesHeader>

      {/* Schedules List */}
      {schedules.length > 0 ? (
        <SchedulesList>
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} enabled={schedule.enabled}>
              <ScheduleHeader>
                <ScheduleHeaderLeft>
                  <ScheduleName>{schedule.name}</ScheduleName>
                  <ScheduleStatus enabled={schedule.enabled}>
                    {schedule.enabled ? '● Active' : '○ Inactive'}
                  </ScheduleStatus>
                </ScheduleHeaderLeft>
                <ToggleSwitch
                  enabled={schedule.enabled}
                  onClick={() => handleScheduleToggle(schedule.id, !schedule.enabled)}
                >
                  <ToggleSlider enabled={schedule.enabled} />
                </ToggleSwitch>
              </ScheduleHeader>

              <ScheduleDetails>
                <DetailRow>
                  <DetailIcon>📅</DetailIcon>
                  <DetailLabel>Days:</DetailLabel>
                  <DayBadges>
                    {schedule.days.map((day, idx) => (
                      <DayBadge key={idx} active>
                        {day}
                      </DayBadge>
                    ))}
                  </DayBadges>
                </DetailRow>

                <DetailRow>
                  <DetailIcon>🕐</DetailIcon>
                  <DetailLabel>Time:</DetailLabel>
                  <DetailValue>
                    {schedule.startTime} - {schedule.endTime}
                  </DetailValue>
                </DetailRow>

                <DetailRow>
                  <DetailIcon>🌡️</DetailIcon>
                  <DetailLabel>Target:</DetailLabel>
                  <DetailValue>{schedule.targetTemp}°C</DetailValue>
                </DetailRow>
              </ScheduleDetails>

              <ScheduleActions>
                <ActionButton onClick={() => handleScheduleEdit(schedule.id)}>
                  ✏️ Edit
                </ActionButton>
                <ActionButton
                  variant="danger"
                  onClick={() => handleScheduleDelete(schedule.id)}
                >
                  🗑️ Delete
                </ActionButton>
              </ScheduleActions>
            </ScheduleCard>
          ))}
        </SchedulesList>
      ) : (
        <EmptyState>
          <EmptyIcon>📅</EmptyIcon>
          <EmptyTitle>No Schedules Yet</EmptyTitle>
          <EmptyText>Create your first heating schedule to automate device control</EmptyText>
          <AddButton onClick={() => onScheduleChange && onScheduleChange('create')}>
            + Create First Schedule
          </AddButton>
        </EmptyState>
      )}

      {/* Quick Templates */}
      <TemplatesSection>
        <SectionTitle>Quick Templates</SectionTitle>
        <SectionSubtitle>Start with a pre-configured schedule</SectionSubtitle>

        <TemplatesGrid>
          <TemplateCard onClick={() => onScheduleChange && onScheduleChange('template', 'weekday')}>
            <TemplateIcon>💼</TemplateIcon>
            <TemplateName>Weekday Business Hours</TemplateName>
            <TemplateDesc>Mon-Fri, 6am-6pm</TemplateDesc>
          </TemplateCard>

          <TemplateCard onClick={() => onScheduleChange && onScheduleChange('template', 'weekend')}>
            <TemplateIcon>🏡</TemplateIcon>
            <TemplateName>Weekend Comfort</TemplateName>
            <TemplateDesc>Sat-Sun, 8am-10pm</TemplateDesc>
          </TemplateCard>

          <TemplateCard onClick={() => onScheduleChange && onScheduleChange('template', '247')}>
            <TemplateIcon>🔄</TemplateIcon>
            <TemplateName>24/7 Continuous</TemplateName>
            <TemplateDesc>All days, all hours</TemplateDesc>
          </TemplateCard>

          <TemplateCard onClick={() => onScheduleChange && onScheduleChange('template', 'night')}>
            <TemplateIcon>🌙</TemplateIcon>
            <TemplateName>Night Only</TemplateName>
            <TemplateDesc>All days, 10pm-6am</TemplateDesc>
          </TemplateCard>
        </TemplatesGrid>
      </TemplatesSection>

      {/* Schedule Tips */}
      <TipsSection>
        <TipsIcon>💡</TipsIcon>
        <TipsContent>
          <TipsTitle>Schedule Tips:</TipsTitle>
          <TipsList>
            <Tip>• Schedules activate automatically at the specified times</Tip>
            <Tip>• Multiple schedules can overlap - the last one to start takes priority</Tip>
            <Tip>• Instant Heat and Snow Sensor override active schedules</Tip>
            <Tip>• Disabled schedules are saved but won't activate</Tip>
          </TipsList>
        </TipsContent>
      </TipsSection>
    </SchedulesContainer>
  );
};

export default SchedulesTab;

// Styled Components

const SchedulesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SchedulesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HeaderTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const HeaderSubtitle = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%);
  border: 1px solid rgba(59, 130, 246, 0.5);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.3) 100%);
    border-color: rgba(59, 130, 246, 0.7);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
  }
`;

const SchedulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ScheduleCard = styled.div`
  padding: 16px;
  background: ${({ enabled }) =>
    enabled
      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
      : 'rgba(0, 0, 0, 0.2)'};
  border: 1px solid
    ${({ enabled }) => (enabled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)')};
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ enabled }) =>
      enabled
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)'
        : 'rgba(0, 0, 0, 0.3)'};
  }
`;

const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ScheduleHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ScheduleName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const ScheduleStatus = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ enabled }) => (enabled ? '#10b981' : 'rgba(255, 255, 255, 0.5)')};
`;

const ToggleSwitch = styled.button`
  position: relative;
  width: 56px;
  height: 32px;
  background: ${({ enabled }) => (enabled ? '#10b981' : 'rgba(255, 255, 255, 0.2)')};
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    background: ${({ enabled }) => (enabled ? '#059669' : 'rgba(255, 255, 255, 0.3)')};
  }
`;

const ToggleSlider = styled.div`
  position: absolute;
  top: 4px;
  left: ${({ enabled }) => (enabled ? '28px' : '4px')};
  width: 24px;
  height: 24px;
  background: #ffffff;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ScheduleDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DetailIcon = styled.span`
  font-size: 16px;
  width: 24px;
`;

const DetailLabel = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  min-width: 60px;
`;

const DetailValue = styled.span`
  font-size: 14px;
  color: #ffffff;
  font-weight: 600;
`;

const DayBadges = styled.div`
  display: flex;
  gap: 6px;
`;

const DayBadge = styled.span`
  padding: 4px 8px;
  background: ${({ active }) => (active ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0, 0, 0, 0.2)')};
  border: 1px solid
    ${({ active }) => (active ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)')};
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ active }) => (active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)')};
`;

const ScheduleActions = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  background: ${({ variant }) =>
    variant === 'danger' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid
    ${({ variant }) =>
      variant === 'danger' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 6px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ variant }) =>
      variant === 'danger' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.15)'};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 64px 32px;
  background: rgba(0, 0, 0, 0.2);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
`;

const EmptyIcon = styled.span`
  font-size: 64px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  text-align: center;
  max-width: 400px;
`;

const TemplatesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const SectionSubtitle = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
`;

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 8px;
`;

const TemplateCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const TemplateIcon = styled.span`
  font-size: 32px;
`;

const TemplateName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
`;

const TemplateDesc = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
`;

const TipsSection = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 10px;
`;

const TipsIcon = styled.span`
  font-size: 24px;
  flex-shrink: 0;
`;

const TipsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TipsTitle = styled.h5`
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const TipsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Tip = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.5;
`;
