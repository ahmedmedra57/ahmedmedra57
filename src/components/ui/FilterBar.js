import { useState } from 'react';
import styled from 'styled-components';
import { getDeviceStatus } from './StatusBadge';

/**
 * FilterBar Component
 * Provides quick filtering and sorting for device lists
 *
 * Usage:
 * <FilterBar
 *   devices={devices}
 *   onFilterChange={(filtered) => setFilteredDevices(filtered)}
 *   showQuickActions={true}
 * />
 */

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: rgba(35, 58, 84, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const QuickActionsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 10px 16px;
  background: rgba(6, 13, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 10px 16px;
  background: rgba(6, 13, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  option {
    background: #233a54;
    color: #ffffff;
  }
`;

const QuickActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${(props) => {
    if (props.$active) {
      switch (props.$variant) {
        case 'critical':
          return 'rgba(239, 68, 68, 0.2)';
        case 'warning':
          return 'rgba(245, 158, 11, 0.2)';
        case 'normal':
          return 'rgba(16, 185, 129, 0.2)';
        default:
          return 'rgba(59, 130, 246, 0.2)';
      }
    }
    return 'rgba(107, 114, 128, 0.1)';
  }};
  border: 1px solid ${(props) => {
    if (props.$active) {
      switch (props.$variant) {
        case 'critical':
          return '#ef4444';
        case 'warning':
          return '#f59e0b';
        case 'normal':
          return '#10b981';
        default:
          return '#3b82f6';
      }
    }
    return 'rgba(255, 255, 255, 0.2)';
  }};
  border-radius: 6px;
  color: ${(props) => {
    if (props.$active) {
      switch (props.$variant) {
        case 'critical':
          return '#ef4444';
        case 'warning':
          return '#f59e0b';
        case 'normal':
          return '#10b981';
        default:
          return '#3b82f6';
      }
    }
    return 'rgba(255, 255, 255, 0.7)';
  }};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;

  &:hover {
    background: ${(props) => {
      switch (props.$variant) {
        case 'critical':
          return 'rgba(239, 68, 68, 0.3)';
        case 'warning':
          return 'rgba(245, 158, 11, 0.3)';
        case 'normal':
          return 'rgba(16, 185, 129, 0.3)';
        default:
          return 'rgba(59, 130, 246, 0.3)';
      }
    }};
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background: ${(props) => {
      switch (props.$variant) {
        case 'critical':
          return '#ef4444';
        case 'warning':
          return '#f59e0b';
        case 'normal':
          return '#10b981';
        default:
          return '#3b82f6';
      }
    }};
    border-radius: 10px;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
  }
`;

const ResultsInfo = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  padding: 8px 0;
`;

export const FilterBar = ({
  devices = [],
  onFilterChange,
  showQuickActions = true,
  showSearch = true,
  showSort = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [activeFilter, setActiveFilter] = useState('all');

  // Calculate counts for quick actions
  const counts = {
    all: devices.length,
    faulted: devices.filter((d) => d.isFaults).length,
    offline: devices.filter(
      (d) => !d.deviceStatus || d.deviceStatus === 'OFFLINE'
    ).length,
    warning: devices.filter((d) => {
      const status = getDeviceStatus(d);
      return status.color === 'warning';
    }).length,
    active: devices.filter(
      (d) => d.instantHeat?.isActivated || d.snowSensor?.isActivated
    ).length,
  };

  // Filter devices
  const getFilteredDevices = () => {
    let filtered = [...devices];

    // Apply active filter
    switch (activeFilter) {
      case 'faulted':
        filtered = filtered.filter((d) => d.isFaults);
        break;
      case 'offline':
        filtered = filtered.filter(
          (d) => !d.deviceStatus || d.deviceStatus === 'OFFLINE'
        );
        break;
      case 'warning':
        filtered = filtered.filter((d) => {
          const status = getDeviceStatus(d);
          return status.color === 'warning';
        });
        break;
      case 'active':
        filtered = filtered.filter(
          (d) => d.instantHeat?.isActivated || d.snowSensor?.isActivated
        );
        break;
      default:
        // 'all' - no filter
        break;
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.machineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.deviceMac?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.locationName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.machineName || '').localeCompare(b.machineName || '');
        case 'energy':
          return (b.consumption || 0) - (a.consumption || 0);
        case 'temp':
          return (b.currentTemp || 0) - (a.currentTemp || 0);
        case 'status':
          const statusA = getDeviceStatus(a).label;
          const statusB = getDeviceStatus(b).label;
          return statusA.localeCompare(statusB);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Update parent when filters change
  const filtered = getFilteredDevices();
  if (onFilterChange) {
    onFilterChange(filtered);
  }

  const handleQuickAction = (filter) => {
    setActiveFilter(activeFilter === filter ? 'all' : filter);
  };

  return (
    <FilterContainer>
      <TopRow>
        {showSearch && (
          <SearchInput
            type="text"
            placeholder="🔍 Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        {showSort && (
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="energy">Sort by Energy</option>
            <option value="temp">Sort by Temperature</option>
            <option value="status">Sort by Status</option>
          </Select>
        )}
      </TopRow>

      {showQuickActions && (
        <QuickActionsRow>
          <QuickActionButton
            $variant="primary"
            $active={activeFilter === 'all'}
            onClick={() => handleQuickAction('all')}
          >
            All Devices
            <span className="badge">{counts.all}</span>
          </QuickActionButton>

          <QuickActionButton
            $variant="critical"
            $active={activeFilter === 'faulted'}
            onClick={() => handleQuickAction('faulted')}
            disabled={counts.faulted === 0}
          >
            Faulted
            <span className="badge">{counts.faulted}</span>
          </QuickActionButton>

          <QuickActionButton
            $variant="critical"
            $active={activeFilter === 'offline'}
            onClick={() => handleQuickAction('offline')}
            disabled={counts.offline === 0}
          >
            Offline
            <span className="badge">{counts.offline}</span>
          </QuickActionButton>

          <QuickActionButton
            $variant="warning"
            $active={activeFilter === 'warning'}
            onClick={() => handleQuickAction('warning')}
            disabled={counts.warning === 0}
          >
            High Temp
            <span className="badge">{counts.warning}</span>
          </QuickActionButton>

          <QuickActionButton
            $variant="normal"
            $active={activeFilter === 'active'}
            onClick={() => handleQuickAction('active')}
          >
            Active
            <span className="badge">{counts.active}</span>
          </QuickActionButton>
        </QuickActionsRow>
      )}

      <ResultsInfo>
        Showing {filtered.length} of {devices.length} devices
        {activeFilter !== 'all' && ` (${activeFilter})`}
        {searchTerm && ` matching "${searchTerm}"`}
      </ResultsInfo>
    </FilterContainer>
  );
};

export default FilterBar;
