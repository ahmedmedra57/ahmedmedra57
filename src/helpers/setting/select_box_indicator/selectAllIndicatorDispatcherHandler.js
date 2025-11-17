import {
  handleSettingsLocationSelect,
  handleSettingsMachineSelect,
  handleSettingsSelectAll,
  handleSettingsSpecificLocationSelect,
} from '../../../components/store/slices/settings/force&CommandAndAdminSelectSlice';

export const selectAllIndicatorDispatcherHandler = (
  dispatch,
  name,
  locationList,
  specificLocationList,
  machineList
) => {
  // dispatch all
  console.log(specificLocationList, 'specificLocationListTest');
  dispatch(handleSettingsSelectAll({ switch: name, status: true }));
  // dispatch locations
  dispatch(handleSettingsLocationSelect(locationList.newLocationList));
  // dispatch specific locations
  dispatch(
    handleSettingsSpecificLocationSelect(
      specificLocationList.newSpecificLocationList
    )
  );
  // dispatch machines
  dispatch(handleSettingsMachineSelect(machineList.newMachineList));
};
