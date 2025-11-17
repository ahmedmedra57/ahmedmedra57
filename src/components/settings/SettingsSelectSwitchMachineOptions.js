import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import {
  handleSettingsAddLocations,
  handleSettingsAddMachines,
  handleSettingsLocationSelect,
  handleSettingsMachineSelect,
  handleSettingsMachineSelectAlt,
  handleSettingsSelectAll,
  handleSettingsSelectedOne,
  selectForceCommandAndAdminSelect,
} from '../store/slices/settings/force&CommandAndAdminSelectSlice';
import {
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerBDark,
  scrollbarY,
} from '../styles/commonStyles';
import SelectIndividualOptions from '../telemetry/theSelections/SelectIndividualOptions';
import ClearApplyButton from './ForceAndCommand/selectArts/ClearApplyButton';
import { useMediaQuery } from 'react-responsive';
import { useSelectBoxArrowsState } from '../../hooks/useSelectBoxArrowsState';
import { mainSelectIndicatorHandler } from '../../helpers/setting/select_box_indicator';
import { useGetSpecificLocationList } from '../../hooks';
import { buttonsHandler } from '../../helpers/setting/select_box_buttons_dispatchers';
import { useEffect } from 'react';

const SettingsSelectSwitchMachineOptions = ({
  handleClose,
  data,
  sysIndex,
  system,
  setSelectSearchMethod,
  isValueSettings,
  // handleSelectIndividualMachine,
  // handleUnSelectIndividualMachine,
  isMobileTC,
  isMobileGasType,
  isMobileSelectTC,
  isMobileValveSettings,
  program,
}) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  console.log(data,"SettingsSelectSwitchMachineOptions")
  const locations = Object.keys(data);
  const buttons = ['clear', 'select'];

  const { trackArrowState, trackSpecLocationArrowState, specificLocations } =
    useSelectBoxArrowsState(data);

  const [isArrowDown, setIsArrowDown] = useState(trackArrowState);
  const [isSpecLocationArrowDown, setIsSpecLocationArrowDown] = useState(
    trackSpecLocationArrowState
  );

  const specificLocationsNameList = useGetSpecificLocationList(data);

  const FCAndAdminSelectState = useSelector(selectForceCommandAndAdminSelect);
  const {
    ess,
    tgs,
    tes,
    sys,
    gasType,
    forceGasAndElectricSys,
    valveSettings,
    outsideTemp,
    burningChamber,
    encloseTemp,
    currEss,
    currTgs,
    currTes,
  } = FCAndAdminSelectState;

  const swt =
    sysIndex === 0
      ? 'ess'
      : sysIndex === 1
      ? 'tgs'
      : sysIndex === 2
      ? 'tes'
      : sysIndex === 5
      ? 'sys'
      : sysIndex;
  // const swt =
  //   sysIndex === 0
  //     ? 'ess'
  //     : sysIndex === 1
  //     ? 'tgs'
  //     : sysIndex === 2
  //     ? 'tes'
  //     : sysIndex === 5
  //     ? 'sys'
  //     : sysIndex === 'gasType'
  //     ? 'gasType'
  //     : sysIndex === 'forceGasAndElectricSys'
  //     ? 'forceGasAndElectricSys'
  //     : sysIndex === 'outsideTemp'
  //     ? 'outsideTemp'
  //     : sysIndex === 'burningChamber'
  //     ? 'burningChamber'
  //     : sysIndex === 'encloseTemp'
  //     ? 'encloseTemp'
  //     : sysIndex === 'currEss'
  //     ? 'currEss'
  //     : sysIndex === 'currTgs'
  //     ? 'currTgs'
  //     : sysIndex === 'currTes' && 'currTes';
  const isSelectedSys =
    sysIndex === 'outsideTemp'
      ? 'isOutsideTempSelected'
      : sysIndex === 'burningChamber'
      ? 'isBurningChamberSelected'
      : sysIndex === 'encloseTemp'
      ? 'isEncloseTempSelected'
      : sysIndex === 'currEss'
      ? 'isCurrEssSelected'
      : sysIndex === 'currTgs'
      ? 'isCurrTgsSelected'
      : sysIndex === 'currTes'
      ? 'isCurrTesSelected'
      : sysIndex === 'valveSettings'
      ? 'isSelectedValveSettings'
      : sysIndex === 'gasType'
      ? 'isSelectedGasType'
      : null;
  console.log(isSelectedSys, "sysIndex")

  const {
    // for styling indicator
    isAllSelected,
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    // for dispatch
    selectedLocations,
    selectedSpecificLocations,
    selectedMachines,
  } =
    sysIndex === 0
      ? ess
      : sysIndex === 1
      ? tgs
      : sysIndex === 2
      ? tes
      : sysIndex === 5
      ? sys
      : sysIndex === 'gasType'
      ? gasType
      : sysIndex === 'forceGasAndElectricSys'
      ? forceGasAndElectricSys
      : sysIndex === 'outsideTemp'
      ? outsideTemp
      : sysIndex === 'burningChamber'
      ? burningChamber
      : sysIndex === 'encloseTemp'
      ? encloseTemp
      : sysIndex === 'currEss'
      ? currEss
      : sysIndex === 'currTgs'
      ? currTgs
      : sysIndex === 'currTes'
      ? currTes
      : sysIndex === 'valveSettings' && valveSettings;
  // const {
  //   // for styling
  //   isAllSelected,
  //   isLocationSelected,
  //   isMachineSelected,
  //   // for dispatch
  //   selectedMachines,
  //   selectedLocations,
  // } =
  //   sysIndex === 0
  //     ? ess
  //     : sysIndex === 1
  //     ? tgs
  //     : sysIndex === 2
  //     ? tes
  //     : sysIndex === 5
  //     ? sys
  //     : sysIndex === 'gasType'
  //     ? gasType
  //     : sysIndex === 'forceGasAndElectricSys'
  //     ? forceGasAndElectricSys
  //     : sysIndex === 'outsideTemp'
  //     ? outsideTemp
  //     : sysIndex === 'burningChamber'
  //     ? burningChamber
  //     : sysIndex === 'encloseTemp'
  //     ? encloseTemp
  //     : sysIndex === 'currEss'
  //     ? currEss
  //     : sysIndex === 'currTgs'
  //     ? currTgs
  //     : sysIndex === 'currTes' && currTes;

  const [isSelected, setIsSelected] = useState(false);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   handleOnClick(null, null, null, 'clear');
  // }, [displaySelectBox === true]);

  // // Clear and Apply Button handler
  // const handleOnClick = (_, button, event) => {
  //   event.stopPropagation();
  //   if (button === 1) {
  //     if (isAllSelected) {
  //       // 1. selected All
  //       // dispatch

  //       dispatch(
  //         handleSettingsSelectedOne({
  //           switch: swt,
  //           selectedOne: 'all',
  //         })
  //       );
  //       locations.map((location) => handleSelectLocation(location, true));
  //     } else if (isLocationSelected.indexOf(true) !== -1) {
  //       // 2. selected locations
  //       selectedLocations.map((location) =>
  //         handleSelectLocation(location, true)
  //       );

  //       let selectedSwtNumber = 0;
  //       isMachineSelected.forEach((location) =>
  //         location.forEach((machine) => {
  //           if (machine) {
  //             selectedSwtNumber += 1;
  //           }
  //         })
  //       );
  //       dispatch(
  //         handleSettingsSelectedOne({
  //           switch: swt,
  //           selectedOne: `${selectedSwtNumber} switches`,
  //         })
  //       );
  //     } else if (selectedMachines.length > 0) {
  //       let selectedSwtNumber = 0;
  //       isMachineSelected.forEach((location) =>
  //         location.forEach((machine) => {
  //           if (machine) {
  //             selectedSwtNumber += 1;
  //           }
  //         })
  //       );
  //       dispatch(
  //         handleSettingsSelectedOne({
  //           switch: swt,
  //           selectedOne: `${selectedSwtNumber} switches`,
  //         })
  //       );

  //       // 3. selected individual machines

  //       if (swt === 'ess') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               swt,
  //               location: machine[0],
  //               machine: machine[1],
  //             })
  //           )
  //         );
  //       } else if (swt === 'tes') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               swt,
  //               location: machine[0],
  //               machine: machine[1],
  //             })
  //           )
  //         );
  //       } else if (swt === 'tgs') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               swt,
  //               location: machine[0],
  //               machine: machine[1],
  //             })
  //           )
  //         );
  //       } else if (swt === 'gasType') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               swt: 'tgs',
  //               location: machine[0],
  //               machine: machine[1],
  //               isSelectedSys: 'isSelectedGasType',
  //             })
  //           )
  //         );
  //       } else if (swt === 'sys') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               swt,
  //               location: machine[0],
  //               machine: machine[1],
  //             })
  //           )
  //         );
  //       } else if (swt === 'forceGasAndElectricSys') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               swt: 'sys',
  //               location: machine[0],
  //               machine: machine[1],
  //               isSelectedSys: 'isSelectedForceGasAndElectricSys',
  //             })
  //           )
  //         );
  //       } else if (swt === 'outsideTemp') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               swt: 'sys',
  //               location: machine[0],
  //               machine: machine[1],
  //               isSelectedSys: 'isOutsideTempSelected',
  //             })
  //           )
  //         );
  //       } else if (swt === 'burningChamber') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               swt: 'sys',
  //               location: machine[0],
  //               machine: machine[1],
  //               isSelectedSys: 'isBurningChamberSelected',
  //             })
  //           )
  //         );
  //       } else if (swt === 'encloseTemp') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               swt: 'sys',
  //               location: machine[0],
  //               machine: machine[1],
  //               isSelectedSys: 'isEncloseTempSelected',
  //             })
  //           )
  //         );
  //       } else if (swt === 'currEss') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               swt: 'sys',
  //               location: machine[0],
  //               machine: machine[1],
  //               isSelectedSys: 'isCurrEssSelected',
  //             })
  //           )
  //         );
  //       } else if (swt === 'currTgs') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               swt: 'sys',
  //               location: machine[0],
  //               machine: machine[1],
  //               isSelectedSys: 'isCurrTgsSelected',
  //             })
  //           )
  //         );
  //       } else if (swt === 'currTes') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               swt: 'sys',
  //               location: machine[0],
  //               machine: machine[1],
  //               isSelectedSys: 'isCurrTesSelected',
  //             })
  //           )
  //         );
  //       }

  //       // dispatch(
  //       //   handleSettingsSelectedOne({
  //       //     switch: swt,
  //       //     selectedOne: 'selected switches',
  //       //   })
  //       // );
  //     } else if (!isSelected) {
  //       dispatch(
  //         handleSettingsSelectedOne({
  //           switch: swt,
  //           selectedOne: null,
  //         })
  //       );
  //     }
  //     handleClose();
  //   } else {
  //     // reset all selections
  //     // 1.reset all local states
  //     dispatch(
  //       handleSettingsSelectAll({
  //         switch: swt,
  //         status: false,
  //       })
  //     );
  //     dispatch(
  //       handleSettingsSelectedOne({
  //         switch: swt,
  //         selectedOne: null,
  //       })
  //     );

  //     // reset state for dispatch
  //     dispatch(
  //       handleSettingsAddLocations({
  //         switch: swt,
  //         arr: [],
  //       })
  //     );
  //     dispatch(
  //       handleSettingsAddMachines({
  //         switch: swt,
  //         arr: [],
  //       })
  //     );

  //     // 2. reset location
  //     const arr = locations.map((location) => false);
  //     dispatch(
  //       handleSettingsLocationSelect({
  //         switch: swt,
  //         arr,
  //       })
  //     );

  //     // reset selected machines
  //     const individualArr = Object.values(data).map((location) =>
  //       Object.keys(location).map((machine) => false)
  //     );
  //     dispatch(
  //       handleSettingsMachineSelect({
  //         switch: swt,
  //         arr: individualArr,
  //       })
  //     );

  //     // dispatch
  //     locations.map((location) => handleSelectLocation(location));
  //   }
  // };

  // const handleSelectLocation = (option, select) => {
  //   const machines = Object.keys(data[option]);

  //   if (swt === 'ess') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleSelectIndividualMachine({ swt, location: option, machine })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleUnSelectIndividualMachine({
  //             swt,
  //             location: option,
  //             machine,
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'tes') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleSelectIndividualMachine({ swt, location: option, machine })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleUnSelectIndividualMachine({
  //             swt,
  //             location: option,
  //             machine,
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'tgs') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleSelectIndividualMachine({ swt, location: option, machine })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleUnSelectIndividualMachine({
  //             swt,
  //             location: option,
  //             machine,
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'gasType') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleSelectIndividualMachine({
  //             swt: 'tgs',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isSelectedGasType',
  //           })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleUnSelectIndividualMachine({
  //             swt: 'tgs',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isSelectedGasType',
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'sys') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleSelectIndividualMachine({
  //             swt,
  //             location: option,
  //             machine,
  //           })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleUnSelectIndividualMachine({
  //             swt,
  //             location: option,
  //             machine,
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'forceGasAndElectricSys') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isSelectedForceGasAndElectricSys',
  //           })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleUnSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isSelectedForceGasAndElectricSys',
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'outsideTemp') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isOutsideTempSelected',
  //           })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleUnSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isOutsideTempSelected',
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'burningChamber') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isBurningChamberSelected',
  //           })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleUnSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isBurningChamberSelected',
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'encloseTemp') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isEncloseTempSelected',
  //           })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleUnSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isEncloseTempSelected',
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'currEss') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isCurrEssSelected',
  //           })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleUnSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isCurrEssSelected',
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'currTgs') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isCurrTgsSelected',
  //           })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleUnSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isCurrTgsSelected',
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'currTes') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isCurrTesSelected',
  //           })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleUnSelectIndividualMachine({
  //             swt: 'sys',
  //             location: option,
  //             machine,
  //             isSelectedSys: 'isCurrTesSelected',
  //           })
  //         )
  //       );
  //     }
  //   }
  // };

  // Clear and Apply Button handler
  const handleOnClick = (...props) => {
    const propsObj = {
      button: props[1],
      isAllSelected,
      isLocationSelected,
      isSpecificLocationSelected,
      isMachineSelected,
      selectedLocations,
      selectedSpecificLocations,
      selectedMachines,
      swtName: swt,
      dispatch,
      data,
      locations,
      handleClose,
      isSelected,
      isSelectedSys,
      system,
      program,
    };
    buttonsHandler(propsObj,setSelectSearchMethod,isValueSettings);
  };
  // console.log('burning chamber:', burningChamber);
  // console.log('data:', data);
  // console.log('isMachineSelected:', isMachineSelected);
  // console.log('sysIndex:', sysIndex);
  // console.log('location-arr:', isLocationSelected);
  // Select handler for the indicator
  const handleSelect = (option, machine, extraOption, machineIndex) => {
    setIsSelected(true);
    const propObj = {
      dispatch,
      data,
      locations,
      swtName: swt,
      specificLocations,
      isLocationSelected,
      isSpecificLocationSelected,
      isMachineSelected,
      selectedLocations,
      selectedSpecificLocations,
      selectedMachines,
      option,
      machine,
      extraOption,
      machineIndex,
    };
    mainSelectIndicatorHandler(propObj);
  };

  // // Select handler for the indicator
  // const handleSelect = (option, machine) => {
  //   setIsSelected(true);

  //   if (option === 'all') {
  //     // 1. select all
  //     dispatch(
  //       handleSettingsSelectAll({
  //         switch: swt,
  //         status: true,
  //       })
  //     );

  //     // update all locations
  //     const locationArr = isLocationSelected.map((location) => true);

  //     dispatch(
  //       handleSettingsLocationSelect({
  //         switch: swt,
  //         arr: locationArr,
  //       })
  //     );

  //     // update all machines global and local
  //     const individualArr = Object.values(data).map((location) =>
  //       Object.keys(location).map((machine) => true)
  //     );
  //     dispatch(
  //       handleSettingsMachineSelect({
  //         switch: swt,
  //         arr: individualArr,
  //       })
  //     );
  //   } else if (option !== 'all' && machine === undefined) {
  //     // 2. select location
  //     // 2-1 find index and make it true
  //     // update the location
  //     const index = locations.indexOf(option);
  //     const arr = [...isLocationSelected];
  //     arr[index] = true;
  //     dispatch(
  //       handleSettingsLocationSelect({
  //         switch: swt,
  //         arr,
  //       })
  //     );

  //     // update machines in the location
  //     const machineNewArr = isMachineSelected[index]?.map((machine) => true);
  //     const copyArr = [...isMachineSelected];
  //     copyArr[index] = machineNewArr;
  //     dispatch(
  //       handleSettingsMachineSelect({
  //         switch: swt,
  //         arr: copyArr,
  //       })
  //     );

  //     // for dispatch selected locations
  //     const newSelect = [...selectedLocations];
  //     newSelect.push(option);
  //     dispatch(
  //       handleSettingsAddLocations({
  //         switch: swt,
  //         arr: newSelect,
  //       })
  //     );
  //   } else {
  //     // 3. select individually
  //     const locationIdx = Object.keys(data).indexOf(option);
  //     const machineIdx = Object.keys(data[option]).indexOf(machine);

  //     dispatch(
  //       handleSettingsMachineSelectAlt({
  //         switch: swt,
  //         locationIdx,
  //         machineIdx,
  //       })
  //     );

  //     // for dispatch selected machines
  //     const newSelectedMachineArr = [...selectedMachines];
  //     newSelectedMachineArr.push([option, machine]);
  //     dispatch(
  //       handleSettingsAddMachines({
  //         switch: swt,
  //         arr: newSelectedMachineArr,
  //       })
  //     );
  //   }
  // };

  return (
    <>
      {swt && (
        <Wrapper>
          <ScrollBarWrapper
            isMobile={isMobile}
            isForceGasElectric={sysIndex === 'forceGasAndElectricSys'}
          >
            <SectionOptions
              isMobile={isMobile}
              isMobileTC={isMobileTC}
              isForceGasElectric={sysIndex === 'forceGasAndElectricSys'}
            >
              <SelectIndividualOptions
                option='all'
                handleSelect={handleSelect}
                isSelected={isAllSelected}
                isMobileTC={isMobileTC}
                isMobileGasType={isMobileGasType}
                isFirst={true}
                isMobileSelectTC={isMobileSelectTC}
                isMobileValveSettings={isMobileValveSettings}
              />

              {locations.map((location, index) => (
                <SelectIndividualOptions
                key={index}
                index={index}
                option={location}
                data={data[location]}
                handleSelect={handleSelect}
                isSelected={isLocationSelected[index]}
                isMachineSelected={
                  isMachineSelected[index] && isMachineSelected[index]
                }
                isSpecificLocationSelected={
                  isSpecificLocationSelected 
                }
                isSpecLocationArrowDown={isSpecLocationArrowDown}
                setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                isArrowDown={isArrowDown}
                setIsArrowDown={setIsArrowDown}
                allSpecificLocationsName={
                  specificLocationsNameList
                }
                  isMobileTC={isMobileTC}
                  isMobileGasType={isMobileGasType}
                  isMobileSelectTC={isMobileSelectTC}
                  isMobileValveSettings={isMobileValveSettings}
                />
              ))}
            </SectionOptions>
          </ScrollBarWrapper>
          <SectionButtons isMobile={isMobile}>
            {buttons.map((button, index) => (
              <div key={index}>
                <ClearApplyButton
                  name={button}
                  handleClick={handleOnClick}
                  index={index}
                  isMobile={isMobile}
                />
              </div>
            ))}
          </SectionButtons>
        </Wrapper>
      )}
    </>
  );
};

export default SettingsSelectSwitchMachineOptions;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${flexBoxCenter}
  flex-direction: column;
`;

const ScrollBarWrapper = styled.div`
  ${({ isMobile, isForceGasElectric }) =>
    isMobile
      ? css`
          width: 98%;
          height: 100%;
          ${flexBoxCenter}
        `
      : css`
          width: 98%;
          min-height: 118px;
          max-height: 184px;
          padding: 4px;
          margin-bottom: 4px;
          border-radius: 14px 8px 8px 14px;
          ${layerA}
          ${justifyContentFlexStart}
        `}

  ${({ isForceGasElectric }) =>
    isForceGasElectric &&
    css`
      max-height: 133px;
    `}
`;

const SectionOptions = styled.div`
  /* custom scrollbar */
  ${scrollbarY}
  /* ${layerA} */

  border-radius: 14px 8px 8px 14px;

  ${({ isMobile }) =>
    isMobile
      ? css`
          height: 184px;
          width: 100%;
          padding: 2px;
          margin-bottom: 4px;
          ::-webkit-scrollbar {
            display: none;
          }
          ${({ isMobileTC }) =>
            isMobileTC &&
            css`
              width: 96%;
              /* ${layerA} */
            `}
          ${layerA}
          ${flexBoxCenter}
          justify-content: flex-start;
        `
      : css`
          min-height: 110px;
          max-height: 176px;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
        `};

  ${({ isForceGasElectric }) =>
    isForceGasElectric &&
    css`
      max-height: 124px;
    `}

  flex-direction: column;
`;

const SectionButtons = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 98%;
          height: 52px;
          margin-bottom: 4px;
          margin-top: 4px;

          ${flexBoxCenter}
        `
      : css`
          width: 98%;
          margin-bottom: 2px;
          ${justifyContentFlexEnd};
          gap: 8px;

          /* width: 98%;
          height: 45px;
          margin-bottom: 6px;

          ${justifyContentFlexEnd} */
        `}
`;
