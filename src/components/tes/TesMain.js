import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  tesHandleAddHeatingSchedule,
  tesHandleAts,
  tesHandleInstantHeat,
  tesHandleOptionalConstantTemp,
  tesHandleShutOff,
  tesHandleSnowSensor,
  tesHandleWindFactor,
  selectTesSwitch,
  tesHandleOpenMachineController,
  tesHandleAtsSelection,
  tesHandleUnSelectIndividualMachine,
  tesResetMachinesState,
  tesSpecificLocationUnselectMachinesHandler,
} from '../store/slices/tesSwitchSlice';

import {
  handleOpenMasterControl,
  handleTesInitialState,
  selectMCIsExpanded,
} from '../store/slices/MCIsExpandedSlice';

import { useMediaQuery } from 'react-responsive';

import styled from 'styled-components';

import MasterControlBySwitch from '../commonComponentsMC/MasterControlBySwitch';
import IntegratedSwitchLocations from '../commonComponentsMC/IntegratedSwitchLocations';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import { handleResetAllSelectBySwitch } from '../store/slices/masterControlBySwitchSelectSlice';
import { handleResetAllSelectByLocation } from '../store/slices/masterControlSelectByLocationSlice';
import {
  useGetScheduleQueries,
  useGetThermocouplesQueries,
  useSetZoneOpeningsState,
} from '../../hooks';
import {
  getCommandNumberService,
  getTesZones,
  updateBlowersMasterControlService,
} from '../../services';
import { convertFahrenheitToCelsius, formatTime } from '../../helpers/helpers';
import { useQuery } from 'react-query';
import { handleAccessToken } from '../store/slices/userSlice';
import mainMessageBoxHandler from '../../helpers/ess-tgs-tes-mc/mainMessageBoxHandler';
import testData from '../../test_data/testData';
import { useSetOpenMasterControl } from '../../hooks/ess_tgs_tes_hooks/useSetOpenMasterControl';
import { EssTgsTesContext } from '../context/contextOfEssTgsTes';
import { loopMachinesHandler } from '../../helpers/ess-tgs-tes-mc';

const TesMain = ({ isMasterControl }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // global state
  // !! PUT back after test below
  const { tesSwitch ,flatTesSwitch } = useSelector(selectTesSwitch);
  const MCIsExpanded = useSelector(selectMCIsExpanded);
  const { masterControl } = MCIsExpanded.tes;
  
  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;
  
  const dispatch = useDispatch();
  
  // !!TEST DATA
  // const { tesSwitch } = useSelector(selectTesSwitch);
  // const { testTesSwitch: switchStatus } = testData(null, null, null, tesSwitch);
  // useGetScheduleQueries(tesSwitch, 'TES');
  // useGetThermocouplesQueries(tesSwitch, 'tes');
  // !! END OF TEST DATA

  // useContext
  const { messageBoxHandler } = useContext(EssTgsTesContext);

  // // local state
  // const [openMessageBox, setOpenMessageBox] = useState(false);
  // const [openLocationMessageBox, setOpenLocationMessageBox] = useState(false);
  // const [messageTitle, setMessageTitle] = useState('');
  // const [message, setMessage] = useState([]);
  // const [programName, setProgramName] = useState('');
  // const dispatch = useDispatch();

  // !! PUT back after test below
  useGetScheduleQueries(flatTesSwitch, 'TES');
  useGetThermocouplesQueries(flatTesSwitch, 'tes');

  useSetOpenMasterControl('tes', isMobile);

  // useEffect(() => {
  //   isMobile
  //     ? dispatch(handleOpenMasterControl({ swtName: 'tes', status: false }))
  //     : dispatch(handleOpenMasterControl({ swtName: 'tes', status: true }));
  // }, []);

  useSetZoneOpeningsState(
    flatTesSwitch,
    masterControl,
    tesHandleOpenMachineController,
    'tes'
  );

  // useEffect(() => {
  //   if (masterControl) {
  //     const locationArr = Object.keys(switchStatus).map((location) => false);
  //     dispatch(handleTesInitialState(locationArr));

  //     Object.keys(switchStatus).map((location) =>
  //       Object.keys(switchStatus[location]).map((machine) =>
  //         dispatch(
  //           tesHandleOpenMachineController({ location, machine, status: false })
  //         )
  //       )
  //     );
  //   }
  // }, [masterControl]);

  // ** temporary variables
  // const isF = false;

  const { data: tesZones } = useQuery(['tesZones','structured'], ()=>getTesZones({structured:true}), {
    enabled: !!handleAccessToken,
    staleTime: Infinity,
  });

  const integratedButtonHandler = (
    id,
    state,
    scope,
    temp,
    data,
    type,
    specificLocation
  ) => {
    loopMachinesHandler(
      id,
      state,
      scope,
      type,
      temp,
      data,
      isF,
      tesZones,
      'TES',
      flatTesSwitch,
      dispatch,
      tesHandleUnSelectIndividualMachine,
      tesSpecificLocationUnselectMachinesHandler,
      handleResetAllSelectBySwitch,
      handleResetAllSelectByLocation,
      messageBoxHandler,
      tesSwitch,
    );

    // switch (id) {
    //   case 'instantHeat':
    //     instantHeatHandler(state, scope, temp, type);
    //     break;
    //   case 'snowSensor':
    //     snowSensorHandler(state, scope, type);
    //     break;
    //   case 'constantTemp':
    //     constantTempHandler(state, scope, temp, type);
    //     break;
    //   case 'windFactor':
    //     windFactorHandler(state, scope, type);
    //     break;
    //   case 'heatingSchedule':
    //     heatingScheduleHandler(state, scope, data, type);
    //     break;
    //   case 'ats':
    //     atsHandler(state, scope, data, type);
    //     break;
    //   case 'shutOff':
    //     shutOffHandler(state, scope, type);
    //     break;
    //   default:
    //     throw new Error('unknown switch', id);
    // }
  };

  // Functions for Individual controllers
  // const heatingScheduleHandler = (state, scope, data, type) => {
  //   if (state === 'off') {
  //   } else if (state === 'clear') {
  //   } else if (state === 'on') {
  //     // set new schedule
  //     // tes
  //     let machineIds = [];
  //     if (scope === 'switch') {
  //       // Logic for access selected machine
  //       Object.keys(switchStatus).forEach((location) =>
  //         Object.keys(switchStatus[location]).forEach((machine) => {
  //           if (switchStatus[location][machine].isSelected) {
  //             machineIds.push(switchStatus[location][machine].deviceMac);
  //             dispatch(
  //               tesHandleAddHeatingSchedule({
  //                 location,
  //                 machine,
  //                 start: data.start,
  //                 end: data.end,
  //                 inputTemp: data.inputTemp,
  //                 isF: data.isF,
  //                 index: 0,
  //               })
  //             );
  //             dispatch(
  //               tesHandleUnSelectIndividualMachine({ location, machine })
  //             );
  //           }
  //         })
  //       );
  //       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, 'TES', {
  //           commandNumber: commandNumber,
  //           actionType: 'MASTER_CONTROL',
  //           schedule: {
  //             startDate: formatTime(data.start),
  //             endDate: formatTime(data.end),
  //             threshold: data.inputTemp,
  //           },
  //         });
  //       });
  //       dispatch(handleResetAllSelectBySwitch());
  //     } else {
  //       Object.keys(switchStatus[scope]).forEach((machine) => {
  //         if (switchStatus[scope][machine].isSelected) {
  //           machineIds.push(switchStatus[scope][machine].deviceMac);
  //           dispatch(
  //             tesHandleAddHeatingSchedule({
  //               location: scope,
  //               machine,
  //               start: data.start,
  //               end: data.end,
  //               inputTemp: data.inputTemp,
  //               isF: data.isF,
  //               index: 0,
  //             })
  //           );
  //           dispatch(
  //             tesHandleUnSelectIndividualMachine({ location: scope, machine })
  //           );
  //         }
  //       });
  //       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //         (commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TES', {
  //             commandNumber: commandNumber,
  //             actionType: 'LOCAL_MASTER_CONTROL',
  //             schedule: {
  //               startDate: formatTime(data.start),
  //               endDate: formatTime(data.end),
  //               threshold: data.inputTemp,
  //             },
  //           });
  //         }
  //       );
  //       dispatch(handleResetAllSelectByLocation());
  //     }
  //   } else {
  //     setProgramName('heating schedule program');
  //     // handleMessageBox(state, scope, type);
  //     const { openMessage, openLocationMessage, newMessage, newMessageTitle } =
  //       mainMessageBoxHandler(state, scope, type, programName);
  //     setMessage(newMessage);
  //     setMessageTitle(newMessageTitle);
  //     setOpenMessageBox(openMessage);
  //     setOpenLocationMessageBox(openLocationMessage);
  //   }
  // };

  // const instantHeatHandler = (state, scope, temp, type) => {
  //   if (state === 'on') {
  //     // turn on
  //     let machineIds = [];
  //     if (scope === 'switch') {
  //       // Logic for access selected machine
  //       Object.keys(switchStatus).forEach((location) =>
  //         Object.keys(switchStatus[location]).forEach((machine) => {
  //           if (switchStatus[location][machine].isSelected) {
  //             machineIds.push(switchStatus[location][machine].deviceMac);
  //             // dispatch(tesHandleInstantHeat({ location, machine, isF, temp }));
  //             dispatch(
  //               tesHandleUnSelectIndividualMachine({ location, machine })
  //             );
  //           }
  //         })
  //       );
  //       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, 'TES', {
  //           commandNumber: commandNumber,
  //           instant_temp: isF ? convertFahrenheitToCelsius(temp) : temp,
  //           on_switch: 1,
  //           actionType: 'MASTER_CONTROL',
  //         });
  //       });
  //       dispatch(handleResetAllSelectBySwitch());
  //     } else {
  //       Object.keys(switchStatus[scope]).forEach((machine) => {
  //         if (switchStatus[scope][machine].isSelected) {
  //           machineIds.push(switchStatus[scope][machine].deviceMac);
  //           dispatch(
  //             tesHandleInstantHeat({ location: scope, machine, temp, isF })
  //           );
  //           dispatch(
  //             tesHandleUnSelectIndividualMachine({ location: scope, machine })
  //           );
  //         }
  //       });
  //       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //         (commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TES', {
  //             commandNumber: commandNumber,
  //             instant_temp: isF ? convertFahrenheitToCelsius(temp) : temp,
  //             on_switch: 1,
  //             actionType: 'LOCAL_MASTER_CONTROL',
  //           });
  //         }
  //       );
  //       dispatch(handleResetAllSelectByLocation());
  //     }
  //   } else if (state === 'off') {
  //     // turn off
  //     // dispatch(handleInstantHeatOff({ location, machine }));
  //   } else {
  //     setProgramName('instant heat program');
  //     // handleMessageBox(state, scope, type);
  //     const { openMessage, openLocationMessage, newMessage, newMessageTitle } =
  //       mainMessageBoxHandler(state, scope, type, programName);
  //     setMessage(newMessage);
  //     setMessageTitle(newMessageTitle);
  //     setOpenMessageBox(openMessage);
  //     setOpenLocationMessageBox(openLocationMessage);
  //   }
  // };
  // const constantTempHandler = (state, scope, temp, type) => {
  //   if (state === 'on') {
  //     // turn on
  //     let machineIds = [];
  //     if (scope === 'switch') {
  //       // Logic for access selected machine
  //       Object.keys(switchStatus).forEach((location) =>
  //         Object.keys(switchStatus[location]).forEach((machine) => {
  //           if (switchStatus[location][machine].isSelected) {
  //             machineIds.push(switchStatus[location][machine].deviceMac);
  //             dispatch(
  //               tesHandleOptionalConstantTemp({
  //                 location,
  //                 machine,
  //                 isF,
  //                 temp,
  //               })
  //             );
  //             dispatch(
  //               tesHandleUnSelectIndividualMachine({ location, machine })
  //             );
  //           }
  //         })
  //       );
  //       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, 'TES', {
  //           commandNumber: commandNumber,
  //           on_constant: 1,
  //           constant_temp: temp,
  //           actionType: 'MASTER_CONTROL',
  //         });
  //       });
  //       dispatch(handleResetAllSelectBySwitch());
  //     } else {
  //       Object.keys(switchStatus[scope]).forEach((machine) => {
  //         if (switchStatus[scope][machine].isSelected) {
  //           machineIds.push(switchStatus[scope][machine].deviceMac);
  //           dispatch(
  //             tesHandleOptionalConstantTemp({
  //               location: scope,
  //               machine,
  //               temp,
  //               isF,
  //             })
  //           );
  //           dispatch(
  //             tesHandleUnSelectIndividualMachine({ location: scope, machine })
  //           );
  //         }
  //       });
  //       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //         (commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TES', {
  //             commandNumber: commandNumber,
  //             on_constant: 1,
  //             constant_temp: temp,
  //             actionType: 'LOCAL_MASTER_CONTROL',
  //           });
  //         }
  //       );
  //       dispatch(handleResetAllSelectByLocation());
  //     }
  //   } else if (state === 'off') {
  //     // turn off
  //     // dispatch(handleOptionalConstantTempOff({ location, machine }));
  //   } else {
  //     setProgramName('optional constant temp.');
  //     // handleMessageBox(state, scope, type);
  //     const { openMessage, openLocationMessage, newMessage, newMessageTitle } =
  //       mainMessageBoxHandler(state, scope, type, programName);
  //     setMessage(newMessage);
  //     setMessageTitle(newMessageTitle);
  //     setOpenMessageBox(openMessage);
  //     setOpenLocationMessageBox(openLocationMessage);
  //   }
  // };

  // const snowSensorHandler = (state, scope, type) => {
  //   if (state === 'off') {
  //     // dispatch(handleSnowSensorOff({ location, machine }));
  //   } else if (state === 'on') {
  //     let machineIds = [];
  //     // state === 'on'
  //     if (scope === 'switch') {
  //       Object.keys(switchStatus).forEach((location) =>
  //         Object.keys(switchStatus[location]).forEach((machine) => {
  //           if (switchStatus[location][machine].isSelected) {
  //             machineIds.push(switchStatus[location][machine].deviceMac);
  //             // dispatch(tesHandleSnowSensor({ location, machine }));
  //             dispatch(
  //               tesHandleUnSelectIndividualMachine({ location, machine })
  //             );
  //           }
  //         })
  //       );
  //       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, 'TES', {
  //           commandNumber: commandNumber,
  //           snow_enabled: 1,
  //           actionType: 'MASTER_CONTROL',
  //         });
  //       });
  //       dispatch(handleResetAllSelectBySwitch());
  //     } else {
  //       Object.keys(switchStatus[scope]).forEach((machine) => {
  //         if (switchStatus[scope][machine].isSelected) {
  //           machineIds.push(switchStatus[scope][machine].deviceMac);
  //           dispatch(tesHandleSnowSensor({ location: scope, machine }));
  //           dispatch(
  //             tesHandleUnSelectIndividualMachine({ location: scope, machine })
  //           );
  //         }
  //       });
  //       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //         (commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TES', {
  //             commandNumber: commandNumber,
  //             snow_enabled: 1,
  //             actionType: 'LOCAL_MASTER_CONTROL',
  //           });
  //         }
  //       );
  //       dispatch(handleResetAllSelectByLocation());
  //     }
  //   } else {
  //     // message
  //     setProgramName('snow sensor program');
  //     // handleMessageBox(state, scope, type);
  //     const { openMessage, openLocationMessage, newMessage, newMessageTitle } =
  //       mainMessageBoxHandler(state, scope, type, programName);
  //     setMessage(newMessage);
  //     setMessageTitle(newMessageTitle);
  //     setOpenMessageBox(openMessage);
  //     setOpenLocationMessageBox(openLocationMessage);
  //   }
  // };

  // const windFactorHandler = (state, scope, type) => {
  //   if (state === 'off') {
  //     // dispatch(handleWindFactorOff({ location, machine }));
  //   } else if (state === 'on') {
  //     // state === 'on'
  //     let machineIds = [];
  //     if (scope === 'switch') {
  //       Object.keys(switchStatus).forEach((location) =>
  //         Object.keys(switchStatus[location]).forEach((machine) => {
  //           if (switchStatus[location][machine].isSelected) {
  //             machineIds.push(switchStatus[location][machine].deviceMac);
  //             dispatch(tesHandleWindFactor({ location, machine }));
  //             dispatch(
  //               tesHandleUnSelectIndividualMachine({ location, machine })
  //             );
  //           }
  //         })
  //       );
  //       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, 'TES', {
  //           commandNumber: commandNumber,
  //           wind: 1,
  //           actionType: 'MASTER_CONTROL',
  //         });
  //       });
  //       dispatch(handleResetAllSelectBySwitch());
  //     } else {
  //       Object.keys(switchStatus[scope]).forEach((machine) => {
  //         if (switchStatus[scope][machine].isSelected) {
  //           machineIds.push(switchStatus[scope][machine].deviceMac);
  //           dispatch(tesHandleWindFactor({ location: scope, machine }));
  //           dispatch(
  //             tesHandleUnSelectIndividualMachine({ location: scope, machine })
  //           );
  //         }
  //       });
  //       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //         (commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TES', {
  //             commandNumber: commandNumber,
  //             wind: 1,
  //             actionType: 'LOCAL_MASTER_CONTROL',
  //           });
  //         }
  //       );
  //       dispatch(handleResetAllSelectByLocation());
  //     }
  //   } else {
  //     // message
  //     setProgramName('wind factor program');
  //     // handleMessageBox(state, scope, type);
  //     const { openMessage, openLocationMessage, newMessage, newMessageTitle } =
  //       mainMessageBoxHandler(state, scope, type, programName);
  //     setMessage(newMessage);
  //     setMessageTitle(newMessageTitle);
  //     setOpenMessageBox(openMessage);
  //     setOpenLocationMessageBox(openLocationMessage);
  //   }
  // };

  // const atsHandler = (state, scope, data, type) => {
  //   if (state === 'off') {
  //     // dispatch(handleWindFactorOff({ location, machine }));
  //   } else if (state === 'on') {
  //     // state === 'on'
  //     let machineIds = [];
  //     let EBP = data.indexOf(true);
  //     if (EBP || EBP === 0) {
  //       if (scope === 'switch') {
  //         Object.keys(switchStatus).forEach((location) =>
  //           Object.keys(switchStatus[location]).forEach((machine) => {
  //             if (switchStatus[location][machine].isSelected) {
  //               machineIds.push(switchStatus[location][machine].deviceMac);
  //               dispatch(
  //                 tesHandleAtsSelection({ location, machine, selections: data })
  //               );
  //             }
  //           })
  //         );
  //         getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TES', {
  //             commandNumber: commandNumber,
  //             EBP: EBP,
  //             actionType: 'MASTER_CONTROL',
  //           });
  //         });
  //         dispatch(handleResetAllSelectBySwitch());
  //       } else {
  //         Object.keys(switchStatus[scope]).forEach((machine) => {
  //           if (switchStatus[scope][machine].isSelected) {
  //             machineIds.push(switchStatus[scope][machine].deviceMac);
  //             tesHandleAtsSelection({
  //               location: scope,
  //               machine,
  //               selections: data,
  //             });
  //           }
  //         });
  //         getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //           (commandNumber) => {
  //             updateBlowersMasterControlService(machineIds, 'TES', {
  //               commandNumber: commandNumber,
  //               EBP: EBP,
  //               actionType: 'LOCAL_MASTER_CONTROL',
  //             });
  //           }
  //         );
  //         dispatch(handleResetAllSelectByLocation());
  //       }
  //     }
  //   } else {
  //     // message
  //     setProgramName('ats program');
  //     // handleMessageBox(state, scope, type);
  //     const { openMessage, openLocationMessage, newMessage, newMessageTitle } =
  //       mainMessageBoxHandler(state, scope, type, programName);
  //     setMessage(newMessage);
  //     setMessageTitle(newMessageTitle);
  //     setOpenMessageBox(openMessage);
  //     setOpenLocationMessageBox(openLocationMessage);
  //   }
  // };

  // const { data: tesZones } = useQuery('tesZones', getTesZones, {
  //   enabled: !!handleAccessToken,
  //   staleTime: Infinity,
  // });

  // const shutOffHandler = (state, scope, type) => {
  //   if (state === 'off') {
  //     // dispatch(handleWindFactorOff({ location, machine }));
  //   } else if (state === 'on') {
  //     // state === 'on'

  //     // if (scope === 'switch') {
  //     //   Object.keys(switchStatus).forEach((location) =>
  //     //     Object.keys(switchStatus[location]).forEach((machine) => {
  //     //       if (switchStatus[location][machine].isSelected) {
  //     //         dispatch(tesHandleShutOff({ location, machine }));
  //     //       }
  //     //     })
  //     //   );
  //     //   dispatch(handleResetAllSelectBySwitch());
  //     // } else {
  //     //   Object.keys(switchStatus[scope]).forEach((machine) => {
  //     //     if (switchStatus[scope][machine].isSelected) {
  //     //       dispatch(tesHandleShutOff({ location: scope, machine }));
  //     //     }
  //     //   });
  //     //   dispatch(handleResetAllSelectByLocation());
  //     // }

  //     let machineIds = [];
  //     if (scope === 'switch') {
  //       Object.keys(switchStatus).forEach((location) =>
  //         Object.keys(switchStatus[location]).forEach((machine) => {
  //           if (switchStatus[location][machine].isSelected) {
  //             machineIds.push(switchStatus[location][machine].deviceMac);
  //             dispatch(
  //               tesResetMachinesState({ location, machine, tesZones, isF })
  //             );
  //           }
  //         })
  //       );
  //       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, 'TES', {
  //           commandNumber: commandNumber,
  //           on_switch: 0,
  //           on_constant: 0,
  //           wind: 0,
  //           snow_enabled: 0,
  //           deleteCurrentSchedule: true,
  //           actionType: 'MASTER_CONTROL',
  //         });
  //       });
  //       dispatch(handleResetAllSelectBySwitch());
  //     } else {
  //       Object.keys(switchStatus[scope]).forEach((machine) => {
  //         if (switchStatus[scope][machine].isSelected) {
  //           machineIds.push(switchStatus[scope][machine].deviceMac);
  //           dispatch(
  //             tesResetMachinesState({ location: scope, machine, tesZones, isF })
  //           );
  //         }
  //       });
  //       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //         (commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TES', {
  //             commandNumber: commandNumber,
  //             on_switch: 0,
  //             on_constant: 0,
  //             wind: 0,
  //             snow_enabled: 0,
  //             deleteCurrentSchedule: true,
  //             actionType: 'LOCAL_MASTER_CONTROL',
  //           });
  //         }
  //       );
  //       dispatch(handleResetAllSelectByLocation());
  //     }
  //   } else {
  //     // message
  //     setProgramName('deactivate');
  //     // handleMessageBox(state, scope, type);
  //     const { openMessage, openLocationMessage, newMessage, newMessageTitle } =
  //       mainMessageBoxHandler(state, scope, type, programName);
  //     setMessage(newMessage);
  //     setMessageTitle(newMessageTitle);
  //     setOpenMessageBox(openMessage);
  //     setOpenLocationMessageBox(openLocationMessage);
  //   }
  // };

  // const handleMessageBox = (id, scope, type) => {
  //   switch (id) {
  //     case 'tempA':
  //       // instantHeat, heating schedule
  //       setMessage([
  //         'wrong temperature',
  //         `in order to finalize ${programName},`,
  //         'please input your temperature first',
  //         '( the minimum temperature is 121°C - 250°F )',
  //         '( the maximum temperature is 999°C - 1830°F )',
  //       ]);

  //       break;
  //     case 'tempB':
  //       setMessage([
  //         'wrong temperature',
  //         `in order to finalize ${programName},`,
  //         'please input your temperature first',
  //         '( the minimum temperature is 25°C - 77°F )',
  //         '( the maximum temperature is 120°C - 248°F )',
  //       ]);

  //       break;
  //     case 'selectA':
  //       setMessage([`select ${type}`, `please select ${type} to continue`]);
  //       break;
  //     case 'selectB':
  //       setMessage([
  //         `select ${type} and a schedule`,
  //         `please select ${type} and a start date and end date`,
  //       ]);
  //       break;
  //     case 'selectC':
  //       setMessage([
  //         'ats-automatic transfer system',
  //         'please select ATS option before apply',
  //       ]);
  //       break;
  //     default:
  //       throw new Error('unknown error', id);
  //   }
  //   scope === 'switch'
  //     ? setOpenMessageBox(true)
  //     : setOpenLocationMessageBox(true);
  // };
  return (
    <Wrapper>
      {isMasterControl || (
        <Section>
          <MasterControlBySwitch
            swtName='tes'
            buttonHandler={integratedButtonHandler}
            // setOpenMessageBox={setOpenMessageBox}
            // openMessageBox={openMessageBox}
            // message={message}
            // programName={programName}
          />
        </Section>
      )}

      <Section>
        <IntegratedSwitchLocations
          swtName='tes'
          buttonHandler={integratedButtonHandler}
          // programName={programName}
          // setOpenMessageBox={setOpenLocationMessageBox}
          // openMessageBox={openLocationMessageBox}
          // messageTitle={messageTitle}
          // message={message}
        />
      </Section>
    </Wrapper>
  );
};

export default TesMain;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Section = styled.section`
  &:first-child {
    margin-bottom: 8px;
  }
`;
