import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  tgsHandleAddHeatingSchedule,
  tgsHandleAts,
  tgsHandleInstantHeat,
  // tgsHandleOptionalConstantTemp,
  tgsHandleShutOff,
  tgsHandleSnowSensor,
  tgsHandleWindFactor,
  tgsHandleFanOnly,
  selectTgsSwitch,
  tgsHandleOpenMachineController,
  tgsHandleAtsSelection,
  tgsHandleUnSelectIndividualMachine,
  tgsResetMachinesState,
  tgsSpecificLocationUnselectMachinesHandler,
} from '../store/slices/tgsSwitchSlice';

import { useMediaQuery } from 'react-responsive';

import styled from 'styled-components';
import MasterControlBySwitch from '../commonComponentsMC/MasterControlBySwitch';
import IntegratedSwitchLocations from '../commonComponentsMC/IntegratedSwitchLocations';
import {
  handleOpenMasterControl,
  handleTgsInitialState,
  selectMCIsExpanded,
} from '../store/slices/MCIsExpandedSlice';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import { handleResetAllSelectBySwitch } from '../store/slices/masterControlBySwitchSelectSlice';
import { handleResetAllSelectByLocation } from '../store/slices/masterControlSelectByLocationSlice';
import { useGetScheduleQueries, useSetZoneOpeningsState } from '../../hooks';
import {
  getCommandNumberService,
  getTgsZones,
  updateBlowersMasterControlService,
} from '../../services';
import { convertFahrenheitToCelsius, formatTime } from '../../helpers/helpers';
import { useQuery } from 'react-query';
import { handleAccessToken } from '../store/slices/userSlice';
import mainMessageBoxHandler from '../../helpers/ess-tgs-tes-mc/mainMessageBoxHandler';
import testData from '../../test_data/testData';
import EssTgsTesProvider, {
  EssTgsTesContext,
} from '../context/contextOfEssTgsTes';
import { loopMachinesHandler } from '../../helpers/ess-tgs-tes-mc';
import { useSetOpenMasterControl } from '../../hooks/ess_tgs_tes_hooks/useSetOpenMasterControl';

const TgsMain = ({ isMasterControl }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // global state
  const { tgsSwitch,flatTgsSwitch } = useSelector(selectTgsSwitch);
  const MCIsExpanded = useSelector(selectMCIsExpanded);
  const { masterControl } = MCIsExpanded.tgs;

  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;

  // useContext
  const { messageBoxHandler } = useContext(EssTgsTesContext);

  // // local state
  // const [openMessageBox, setOpenMessageBox] = useState(false);
  // const [openLocationMessageBox, setOpenLocationMessageBox] = useState(false);
  // const [message, setMessage] = useState([]);
  // const [programName, setProgramName] = useState('');
  const dispatch = useDispatch();

  useGetScheduleQueries(flatTgsSwitch, 'TGS');

  // !! replace useEffect below
  useSetOpenMasterControl('tes', isMobile);

  // useEffect(() => {
  //   isMobile
  //     ? dispatch(handleOpenMasterControl({ swtName: 'tgs', status: false }))
  //     : dispatch(handleOpenMasterControl({ swtName: 'tgs', status: true }));
  // }, []);

  // !!TEST DATA
  // const { testTgsSwitch } = testData(null, switchStatus);

  // !! END OF TEST DATA

  useSetZoneOpeningsState(
    flatTgsSwitch,
    masterControl,
    tgsHandleOpenMachineController,
    'tgs'
  );

  // useEffect(() => {
  //   if (masterControl) {
  //     const tgsLocationArr = Object.keys(switchStatus).map((location) => false);
  //     dispatch(handleTgsInitialState(tgsLocationArr));

  //     Object.keys(switchStatus).map((location) =>
  //       Object.keys(switchStatus[location]).map((machine) =>
  //         dispatch(
  //           tgsHandleOpenMachineController({ location, machine, status: false })
  //         )
  //       )
  //     );
  //   }
  // }, [masterControl]);

  // ** temporary variables
  // const isF = false;

  const { data: tgsZones } = useQuery(['tgsZones','structured'], ()=>getTgsZones({structured:true}), {
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
    // !! with testData testEssSwitch
    // loopMachinesHandler(
    //   id,
    //   state,
    //   scope,
    //   type,
    //   temp,
    //   data,
    //   isF,
    //   tgsZones,
    //   'TGS',
    //   testTgsSwitch,
    //   dispatch,
    //   tgsHandleUnSelectIndividualMachine,
    //   tgsSpecificLocationUnselectMachinesHandler,
    //   handleResetAllSelectBySwitch,
    //   handleResetAllSelectByLocation,
    //   messageBoxHandler,
    //   specificLocation
    // );
    // !! End of Test Data
    loopMachinesHandler(
      id,
      state,
      scope,
      type,
      temp,
      data,
      isF,
      tgsZones,
      'TGS',
      flatTgsSwitch,
      dispatch,
      tgsHandleUnSelectIndividualMachine,
      tgsSpecificLocationUnselectMachinesHandler,
      handleResetAllSelectBySwitch,
      handleResetAllSelectByLocation,
      messageBoxHandler,
      tgsSwitch
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
    //   case 'fanOnly':
    //     fanOnlyHandler(state, scope, type);
    //     break;
    //   default:
    //     throw new Error('unknown switch', id);
    // }
  };

  // Functions for Individual controllers
  // const fanOnlyHandler = (state, scope, type) => {
  //   if (state === 'on') {
  //     // turn on fan only
  //     let machineIds = [];
  //     if (scope === 'switch') {
  //       Object.keys(switchStatus).forEach((location) =>
  //         Object.keys(switchStatus[location]).forEach((machine) => {
  //           if (switchStatus[location][machine].isSelected) {
  //             machineIds.push(switchStatus[location][machine].deviceMac);
  //             // dispatch(tgsHandleFanOnly({ location, machine, state: true }));
  //             dispatch(
  //               tgsHandleUnSelectIndividualMachine({ location, machine })
  //             );
  //           }
  //         })
  //       );
  //       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, 'TGS', {
  //           actionType: 'MASTER_CONTROL',
  //           commandNumber: commandNumber,
  //           fan: 1,
  //         });
  //       });
  //       dispatch(handleResetAllSelectBySwitch());
  //     } else {
  //       Object.keys(switchStatus[scope]).forEach((machine) => {
  //         if (switchStatus[scope][machine].isSelected) {
  //           machineIds.push(switchStatus[scope][machine].deviceMac);

  //           dispatch(tgsHandleFanOnly({ scope, machine, state: true }));
  //           dispatch(
  //             tgsHandleUnSelectIndividualMachine({ location: scope, machine })
  //           );
  //         }
  //       });
  //       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //         (commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TGS', {
  //             commandNumber: commandNumber,
  //             actionType: 'LOCAL_MASTER_CONTROL',
  //             fan: 1,
  //           });
  //         }
  //       );
  //       dispatch(handleResetAllSelectByLocation());
  //     }
  //   } else {
  //     setProgramName('fan only');
  //     // handleMessageBox(state, scope, type);
  //     const { openMessage, openLocationMessage, newMessage, newMessageTitle } =
  //       mainMessageBoxHandler(state, scope, type, programName);
  //     setMessage(newMessage);
  //     setMessageTitle(newMessageTitle);
  //     setOpenMessageBox(openMessage);
  //     setOpenLocationMessageBox(openLocationMessage);
  //   }
  // };

  // const heatingScheduleHandler = (state, scope, data, type) => {
  //   if (state === 'off') {
  //   } else if (state === 'clear') {
  //   } else if (state === 'on') {
  //     // set new schedule
  //     let machineIds = [];
  //     if (scope === 'switch') {
  //       // Logic for access selected machine
  //       Object.keys(switchStatus).forEach((location) =>
  //         Object.keys(switchStatus[location]).forEach((machine) => {
  //           if (switchStatus[location][machine].isSelected) {
  //             machineIds.push(switchStatus[location][machine].deviceMac);
  //             dispatch(
  //               tgsHandleAddHeatingSchedule({
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
  //               tgsHandleUnSelectIndividualMachine({ location, machine })
  //             );
  //           }
  //         })
  //       );
  //       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, 'TGS', {
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
  //             tgsHandleAddHeatingSchedule({
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
  //             tgsHandleUnSelectIndividualMachine({ location: scope, machine })
  //           );
  //         }
  //       });
  //       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //         (commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TGS', {
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
  //     // message
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
  //       Object.keys(switchStatus).forEach((location) => {
  //         return Object.keys(switchStatus[location]).forEach((machine) => {
  //           if (switchStatus[location][machine].isSelected) {
  //             machineIds.push(switchStatus[location][machine].deviceMac);
  //             // dispatch(tgsHandleInstantHeat({ location, machine, isF, temp }));
  //             dispatch(
  //               tgsHandleUnSelectIndividualMachine({ location, machine })
  //             );
  //           }
  //         });
  //       });
  //       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, 'TGS', {
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
  //             tgsHandleInstantHeat({ location: scope, machine, temp, isF })
  //           );
  //           dispatch(
  //             tgsHandleUnSelectIndividualMachine({ location: scope, machine })
  //           );
  //         }
  //       });
  //       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //         (commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TGS', {
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
  //     // message
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

  //     if (scope === 'switch') {
  //       // Logic for access selected machine
  //       Object.keys(switchStatus).forEach((location) =>
  //         Object.keys(switchStatus[location]).forEach((machine) => {
  //           if (switchStatus[location][machine].isSelected) {
  //             dispatch(
  //               tgsHandleOptionalConstantTemp({
  //                 location,
  //                 machine,
  //                 isF,
  //                 temp,
  //               })
  //             );
  //           }
  //         })
  //       );
  //       dispatch(handleResetAllSelectBySwitch());
  //     } else {
  //       Object.keys(switchStatus[scope]).forEach((machine) => {
  //         if (switchStatus[scope][machine].isSelected) {
  //           dispatch(
  //             tgsHandleOptionalConstantTemp({
  //               location: scope,
  //               machine,
  //               temp,
  //               isF,
  //             })
  //           );
  //         }
  //       });
  //       dispatch(handleResetAllSelectByLocation());
  //     }
  //   } else if (state === 'off') {
  //     // turn off
  //     // dispatch(handleOptionalConstantTempOff({ location, machine }));
  //   } else {
  //     // message
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
  //             // dispatch(tgsHandleSnowSensor({ location, machine }));
  //             dispatch(
  //               tgsHandleUnSelectIndividualMachine({ location, machine })
  //             );
  //           }
  //         })
  //       );
  //       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, 'TGS', {
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
  //           dispatch(tgsHandleSnowSensor({ location: scope, machine }));
  //           dispatch(
  //             tgsHandleUnSelectIndividualMachine({ location: scope, machine })
  //           );
  //         }
  //       });
  //       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //         (commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TGS', {
  //             snow_enabled: 1,
  //             commandNumber: commandNumber,
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
  //             dispatch(tgsHandleWindFactor({ location, machine }));
  //             dispatch(
  //               tgsHandleUnSelectIndividualMachine({ location, machine })
  //             );
  //           }
  //         })
  //       );
  //       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, 'TGS', {
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
  //           dispatch(tgsHandleWindFactor({ location: scope, machine }));
  //           dispatch(
  //             tgsHandleUnSelectIndividualMachine({ location: scope, machine })
  //           );
  //         }
  //       });
  //       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //         (commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TGS', {
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
  //                 tgsHandleAtsSelection({ location, machine, selections: data })
  //               );
  //             }
  //           })
  //         );
  //         getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TGS', {
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
  //             tgsHandleAtsSelection({
  //               location: scope,
  //               machine,
  //               selections: data,
  //             });
  //           }
  //         });
  //         getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //           (commandNumber) => {
  //             updateBlowersMasterControlService(machineIds, 'TGS', {
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

  // const shutOffHandler = (state, scope, type) => {
  //   if (state === 'off') {
  //     // dispatch(handleWindFactorOff({ location, machine }));
  //   } else if (state === 'on') {
  //     // state === 'on'
  //     // let machineIds=[];
  //     // if (scope === 'switch') {
  //     //   Object.keys(switchStatus).forEach((location) =>
  //     //     Object.keys(switchStatus[location]).forEach((machine) => {
  //     //       if (switchStatus[location][machine].isSelected) {
  //     //         machineIds.push(switchStatus[location][machine].deviceMac)
  //     //         dispatch(tgsHandleShutOff({ location, machine }));
  //     //       }
  //     //     })
  //     //   );
  //     //   updateBlowersMasterControlService(machineIds, 'TGS', {
  //     //     wind: 1,
  //     //   });
  //     //   dispatch(handleResetAllSelectBySwitch());
  //     // } else {
  //     //   Object.keys(switchStatus[scope]).forEach((machine) => {
  //     //     if (switchStatus[scope][machine].isSelected) {
  //     //       dispatch(tgsHandleShutOff({ location: scope, machine }));
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
  //               tgsResetMachinesState({ location, machine, tgsZones, isF })
  //             );
  //           }
  //         })
  //       );
  //       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, 'TGS', {
  //           commandNumber: commandNumber,
  //           on_switch: 0,
  //           fan: 0,
  //           wind: 0,
  //           snow_enabled: 0,
  //           deleteCurrentSchedule: true,
  //           actionType: 'MASTER_CONTROL',
  //         });
  //       });
  //       dispatch(handleResetAllSelectBySwitch());
  //     } else {
  //       Object.keys(switchStatus[scope]).forEach((machine, index) => {
  //         if (switchStatus[scope][machine].isSelected) {
  //           machineIds.push(switchStatus[scope][machine].deviceMac);
  //           dispatch(
  //             tgsResetMachinesState({
  //               location: scope,
  //               machine,
  //               tgsZones,
  //               isF,
  //             })
  //           );
  //         }
  //       });
  //       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
  //         (commandNumber) => {
  //           updateBlowersMasterControlService(machineIds, 'TGS', {
  //             commandNumber: commandNumber,
  //             on_switch: 0,
  //             fan: 0,
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

  // const [messageTitle, setMessageTitle] = useState('');

  // const handleMessageBox = (id, scope, type) => {
  //   if (type === 'switches') {
  //     setMessageTitle('locations master control');
  //   } else {
  //     setMessageTitle('master control');
  //   }

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
  //         `please select ${type} and  a start date and end date`,
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
            swtName='tgs'
            buttonHandler={integratedButtonHandler}
            // programName={programName}
            // setOpenMessageBox={setOpenMessageBox}
            // openMessageBox={openMessageBox}
            // message={message}
            // messageTitle={messageTitle}
          />
        </Section>
      )}

      <Section>
        <IntegratedSwitchLocations
          swtName='tgs'
          buttonHandler={integratedButtonHandler}
          // programName={programName}
          // setOpenMessageBox={setOpenLocationMessageBox}
          // openMessageBox={openLocationMessageBox}
          // message={message}
          // messageTitle={messageTitle}
        />
      </Section>
    </Wrapper>
  );
};

export default TgsMain;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Section = styled.section`
  &:first-child {
    margin-bottom: 8px;
  }
`;

// =======================================

// const fanOnlyHandler = (state, scope, type) => {
//   if (state === 'on') {
//     // turn on fan only
//     let machineIds = [];
//     if (scope === 'switch') {
//       Object.keys(switchStatus).forEach((location) =>
//         Object.keys(switchStatus[location]).forEach((machine) => {
//           if (switchStatus[location][machine].isSelected) {
//             machineIds.push(switchStatus[location][machine].deviceMac);
//             // dispatch(tgsHandleFanOnly({ location, machine, state: true }));
//             dispatch(tgsHandleUnSelectIndividualMachine({ location, machine }));
//           }
//         })
//       );
//       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//         updateBlowersMasterControlService(machineIds, 'TGS', {
//           actionType: 'MASTER_CONTROL',
//           commandNumber: commandNumber,
//           fan: 1,
//         });
//       });
//       dispatch(handleResetAllSelectBySwitch());
//     } else {
//       Object.keys(switchStatus[scope]).forEach((machine) => {
//         if (switchStatus[scope][machine].isSelected) {
//           machineIds.push(switchStatus[scope][machine].deviceMac);

//           dispatch(tgsHandleFanOnly({ scope, machine, state: true }));
//           dispatch(
//             tgsHandleUnSelectIndividualMachine({ location: scope, machine })
//           );
//         }
//       });
//       getCommandNumberService('LOCAL_MASTER_CONTROL').then((commandNumber) => {
//         updateBlowersMasterControlService(machineIds, 'TGS', {
//           commandNumber: commandNumber,
//           actionType: 'LOCAL_MASTER_CONTROL',
//           fan: 1,
//         });
//       });
//       dispatch(handleResetAllSelectByLocation());
//     }
//   } else {
//     setProgramName('fan only');
//     // handleMessageBox(state, scope, type);
//     const { openMessage, openLocationMessage, newMessage, newMessageTitle } =
//       mainMessageBoxHandler(state, scope, type, programName);
//     setMessage(newMessage);
//     setMessageTitle(newMessageTitle);
//     setOpenMessageBox(openMessage);
//     setOpenLocationMessageBox(openLocationMessage);
//   }
// };

// const heatingScheduleHandler = (state, scope, data, type) => {
//   if (state === 'off') {
//   } else if (state === 'clear') {
//   } else if (state === 'on') {
//     // set new schedule
//     let machineIds = [];
//     if (scope === 'switch') {
//       // Logic for access selected machine
//       Object.keys(switchStatus).forEach((location) =>
//         Object.keys(switchStatus[location]).forEach((machine) => {
//           if (switchStatus[location][machine].isSelected) {
//             machineIds.push(switchStatus[location][machine].deviceMac);
//             dispatch(
//               tgsHandleAddHeatingSchedule({
//                 location,
//                 machine,
//                 start: data.start,
//                 end: data.end,
//                 inputTemp: data.inputTemp,
//                 isF: data.isF,
//                 index: 0,
//               })
//             );
//             dispatch(tgsHandleUnSelectIndividualMachine({ location, machine }));
//           }
//         })
//       );
//       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//         updateBlowersMasterControlService(machineIds, 'TGS', {
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
//             tgsHandleAddHeatingSchedule({
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
//             tgsHandleUnSelectIndividualMachine({ location: scope, machine })
//           );
//         }
//       });
//       getCommandNumberService('LOCAL_MASTER_CONTROL').then((commandNumber) => {
//         updateBlowersMasterControlService(machineIds, 'TGS', {
//           commandNumber: commandNumber,
//           actionType: 'LOCAL_MASTER_CONTROL',
//           schedule: {
//             startDate: formatTime(data.start),
//             endDate: formatTime(data.end),
//             threshold: data.inputTemp,
//           },
//         });
//       });
//       dispatch(handleResetAllSelectByLocation());
//     }
//   } else {
//     // message
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
//       Object.keys(switchStatus).forEach((location) => {
//         return Object.keys(switchStatus[location]).forEach((machine) => {
//           if (switchStatus[location][machine].isSelected) {
//             machineIds.push(switchStatus[location][machine].deviceMac);
//             // dispatch(tgsHandleInstantHeat({ location, machine, isF, temp }));
//             dispatch(tgsHandleUnSelectIndividualMachine({ location, machine }));
//           }
//         });
//       });
//       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//         updateBlowersMasterControlService(machineIds, 'TGS', {
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
//             tgsHandleInstantHeat({ location: scope, machine, temp, isF })
//           );
//           dispatch(
//             tgsHandleUnSelectIndividualMachine({ location: scope, machine })
//           );
//         }
//       });
//       getCommandNumberService('LOCAL_MASTER_CONTROL').then((commandNumber) => {
//         updateBlowersMasterControlService(machineIds, 'TGS', {
//           commandNumber: commandNumber,
//           instant_temp: isF ? convertFahrenheitToCelsius(temp) : temp,
//           on_switch: 1,
//           actionType: 'LOCAL_MASTER_CONTROL',
//         });
//       });
//       dispatch(handleResetAllSelectByLocation());
//     }
//   } else if (state === 'off') {
//     // turn off
//     // dispatch(handleInstantHeatOff({ location, machine }));
//   } else {
//     // message
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

//     if (scope === 'switch') {
//       // Logic for access selected machine
//       Object.keys(switchStatus).forEach((location) =>
//         Object.keys(switchStatus[location]).forEach((machine) => {
//           if (switchStatus[location][machine].isSelected) {
//             dispatch(
//               tgsHandleOptionalConstantTemp({
//                 location,
//                 machine,
//                 isF,
//                 temp,
//               })
//             );
//           }
//         })
//       );
//       dispatch(handleResetAllSelectBySwitch());
//     } else {
//       Object.keys(switchStatus[scope]).forEach((machine) => {
//         if (switchStatus[scope][machine].isSelected) {
//           dispatch(
//             tgsHandleOptionalConstantTemp({
//               location: scope,
//               machine,
//               temp,
//               isF,
//             })
//           );
//         }
//       });
//       dispatch(handleResetAllSelectByLocation());
//     }
//   } else if (state === 'off') {
//     // turn off
//     // dispatch(handleOptionalConstantTempOff({ location, machine }));
//   } else {
//     // message
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
//             // dispatch(tgsHandleSnowSensor({ location, machine }));
//             dispatch(tgsHandleUnSelectIndividualMachine({ location, machine }));
//           }
//         })
//       );
//       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//         updateBlowersMasterControlService(machineIds, 'TGS', {
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
//           dispatch(tgsHandleSnowSensor({ location: scope, machine }));
//           dispatch(
//             tgsHandleUnSelectIndividualMachine({ location: scope, machine })
//           );
//         }
//       });
//       getCommandNumberService('LOCAL_MASTER_CONTROL').then((commandNumber) => {
//         updateBlowersMasterControlService(machineIds, 'TGS', {
//           snow_enabled: 1,
//           commandNumber: commandNumber,
//           actionType: 'LOCAL_MASTER_CONTROL',
//         });
//       });
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
//             dispatch(tgsHandleWindFactor({ location, machine }));
//             dispatch(tgsHandleUnSelectIndividualMachine({ location, machine }));
//           }
//         })
//       );
//       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//         updateBlowersMasterControlService(machineIds, 'TGS', {
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
//           dispatch(tgsHandleWindFactor({ location: scope, machine }));
//           dispatch(
//             tgsHandleUnSelectIndividualMachine({ location: scope, machine })
//           );
//         }
//       });
//       getCommandNumberService('LOCAL_MASTER_CONTROL').then((commandNumber) => {
//         updateBlowersMasterControlService(machineIds, 'TGS', {
//           commandNumber: commandNumber,
//           wind: 1,
//           actionType: 'LOCAL_MASTER_CONTROL',
//         });
//       });
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
//                 tgsHandleAtsSelection({ location, machine, selections: data })
//               );
//             }
//           })
//         );
//         getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//           updateBlowersMasterControlService(machineIds, 'TGS', {
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
//             tgsHandleAtsSelection({
//               location: scope,
//               machine,
//               selections: data,
//             });
//           }
//         });
//         getCommandNumberService('LOCAL_MASTER_CONTROL').then(
//           (commandNumber) => {
//             updateBlowersMasterControlService(machineIds, 'TGS', {
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

// const shutOffHandler = (state, scope, type) => {
//   if (state === 'off') {
//     // dispatch(handleWindFactorOff({ location, machine }));
//   } else if (state === 'on') {
//     // state === 'on'
//     // let machineIds=[];
//     // if (scope === 'switch') {
//     //   Object.keys(switchStatus).forEach((location) =>
//     //     Object.keys(switchStatus[location]).forEach((machine) => {
//     //       if (switchStatus[location][machine].isSelected) {
//     //         machineIds.push(switchStatus[location][machine].deviceMac)
//     //         dispatch(tgsHandleShutOff({ location, machine }));
//     //       }
//     //     })
//     //   );
//     //   updateBlowersMasterControlService(machineIds, 'TGS', {
//     //     wind: 1,
//     //   });
//     //   dispatch(handleResetAllSelectBySwitch());
//     // } else {
//     //   Object.keys(switchStatus[scope]).forEach((machine) => {
//     //     if (switchStatus[scope][machine].isSelected) {
//     //       dispatch(tgsHandleShutOff({ location: scope, machine }));
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
//               tgsResetMachinesState({ location, machine, tgsZones, isF })
//             );
//           }
//         })
//       );
//       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//         updateBlowersMasterControlService(machineIds, 'TGS', {
//           commandNumber: commandNumber,
//           on_switch: 0,
//           fan: 0,
//           wind: 0,
//           snow_enabled: 0,
//           deleteCurrentSchedule: true,
//           actionType: 'MASTER_CONTROL',
//         });
//       });
//       dispatch(handleResetAllSelectBySwitch());
//     } else {
//       Object.keys(switchStatus[scope]).forEach((machine, index) => {
//         if (switchStatus[scope][machine].isSelected) {
//           machineIds.push(switchStatus[scope][machine].deviceMac);
//           dispatch(
//             tgsResetMachinesState({
//               location: scope,
//               machine,
//               tgsZones,
//               isF,
//             })
//           );
//         }
//       });
//       getCommandNumberService('LOCAL_MASTER_CONTROL').then((commandNumber) => {
//         updateBlowersMasterControlService(machineIds, 'TGS', {
//           commandNumber: commandNumber,
//           on_switch: 0,
//           fan: 0,
//           wind: 0,
//           snow_enabled: 0,
//           deleteCurrentSchedule: true,
//           actionType: 'LOCAL_MASTER_CONTROL',
//         });
//       });
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
