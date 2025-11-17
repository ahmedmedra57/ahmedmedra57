// import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useContext } from 'react';
import {
  // handleEssInitialState,
  // handleOpenMasterControl,
  selectMCIsExpanded,
  // setOpenLocationInitialStateHandler,
  // setOpenSpecificLocationInitialStateHandler,
} from '../store/slices/MCIsExpandedSlice';

import {
  // essResetMachinesState,
  essSpecificLocationUnselectMachinesHandler,
  // handleAddHeatingSchedule,
  // handleAtsSelection,
  // handleInstantHeat,
  // handleInstantHeatReady,
  handleOpenMachineController,
  // handleOptionalConstantTemp,
  // handleOptionalConstantTempReady,
  // handleShutOff,
  // handleSnowSensor,
  handleUnSelectIndividualMachine,
  // handleWindFactor,
  selectEssSwitch,
} from '../store/slices/essSwitchSlice';

import { useMediaQuery } from 'react-responsive';

import styled from 'styled-components';

import MasterControlBySwitch from '../commonComponentsMC/MasterControlBySwitch';
import IntegratedSwitchLocations from '../commonComponentsMC/IntegratedSwitchLocations';
import {
  handleResetAllSelectBySwitch,
  // handleResetSelectedOne,
} from '../store/slices/masterControlBySwitchSelectSlice';
import {
  handleResetAllSelectByLocation,
  // handleResetSelectedOneByLocation,
} from '../store/slices/masterControlSelectByLocationSlice';
import { selectUnits } from '../store/slices/settings/unitsSlice';
import {
  useGetScheduleQueries,
  useGetThermocouplesQueries,
  useSetZoneOpeningsState,
} from '../../hooks';
import {
  // getCommandNumberService,
  getEssZones,
  // updateBlowersMasterControlService,
  // updateSwitchesMasterControlService,
} from '../../services';
// import {
//   convertFahrenheitToCelsius,
//   formatTime,
//   getSpecLocationHandler,
// } from '../../helpers/helpers';
import { useQuery } from 'react-query';
import { handleAccessToken } from '../store/slices/userSlice';
import { selectUserPermissions } from "../store/slices/userSlice";

// import mainMessageBoxHandler from '../../helpers/ess-tgs-tes-mc/mainMessageBoxHandler';
// import testData from '../../test_data/testData';
import {
  // integratedButtonHandler,
  loopMachinesHandler,
} from '../../helpers/ess-tgs-tes-mc';
import { EssTgsTesContext } from '../context/contextOfEssTgsTes';
import { useSetOpenMasterControl } from '../../hooks/ess_tgs_tes_hooks/useSetOpenMasterControl';

const EssMain = ({ isMasterControl }) => {
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  // global state
  const { essSwitch,flatEssSwitch } = useSelector(selectEssSwitch);

  // const { essSwitch: switchStatus } = useSelector(selectEssSwitch);
  const MCIsExpanded = useSelector(selectMCIsExpanded);
  const { masterControl } = MCIsExpanded.ess;

  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;

  // useContext
  const { messageBoxHandler } = useContext(EssTgsTesContext);

  // local state
  // const [openMessageBox, setOpenMessageBox] = useState(false);
  // const [openLocationMessageBox, setOpenLocationMessageBox] = useState(false);
  // const [message, setMessage] = useState([]);
  // const [programName, setProgramName] = useState('');
  // const [messageTitle, setMessageTitle] = useState('');
  const dispatch = useDispatch();

  useGetScheduleQueries(flatEssSwitch, 'ESS');
  useGetThermocouplesQueries(flatEssSwitch, 'ess');

  // !! replace useEffect below
  useSetOpenMasterControl('ess', isMobile);

  // useEffect(() => {
  //   isMobile
  //     ? dispatch(handleOpenMasterControl({ swtName: 'ess', status: false }))
  //     : dispatch(handleOpenMasterControl({ swtName: 'ess', status: true }));
  // }, []);

  // !!TEST DATA
  // const { testEssSwitch } = testData(switchStatus);
  // useSetZoneOpeningsState(
  //   testEssSwitch,
  //   masterControl,
  //   handleOpenMachineController,
  //   'ess'
  // );

  // !! END OF TEST DATA

  // const getSpecLocationHandler = (swtData) => {
  //   return Object.values(swtData).filter((location) =>
  //     Object.values(location).some((el) => !el.deviceMac)
  //   );
  // };
  // !! replace useEffect below
  useSetZoneOpeningsState(
    flatEssSwitch,
    masterControl,
    handleOpenMachineController,
    'ess'
  );

  // useEffect(() => {
  //   if (masterControl) {
  //     // update MCIsExpandedSlice=>isLocationOpen
  //     const locationArr = Object.keys(switchStatus).map((location) => false);
  //     dispatch(
  //       setOpenLocationInitialStateHandler({
  //         swtSystem: 'ess',
  //         locations: locationArr,
  //       })
  //     );

  //     // !!
  //     // update MCIsExpandedSlice=>isSpecificLocationOpen
  //     const specLocationsArr = getSpecLocationHandler(testEssSwitch).map(
  //       (_) => false
  //     );
  //     dispatch(
  //       setOpenSpecificLocationInitialStateHandler({
  //         swtSystem: 'ess',
  //         specificLocations: specLocationsArr,
  //       })
  //     );

  //     Object.keys(switchStatus).map((location) =>
  //       Object.keys(switchStatus[location]).map((machine) =>
  //         dispatch(
  //           handleOpenMachineController({ location, machine, status: false })
  //         )
  //       )
  //     );
  //   }
  // }, [masterControl]);

  // ** temporary variables
  // const isF = false;

  // initialize selections
  // const handleInitializeSelections = (program, scope) => {
  //   if (scope === 'switch') {
  //     // initialize masterControlSelectBySwitchSlice
  //     dispatch(handleResetSelectedOne());
  //   } else {
  //     // initialize masterControlSelectByLocationSlice
  //     dispatch(handleResetSelectedOneByLocation());
  //   }
  // };

  // const messageBoxHandler = (state, scope, type, programName) => {
  //   setProgramName(programName);
  //   // handleMessageBox(state, scope, type);
  //   const { openMessage, openLocationMessage, newMessage, newMessageTitle } =
  //     mainMessageBoxHandler(state, scope, type, programName);
  //   setMessage(newMessage);
  //   setMessageTitle(newMessageTitle);
  //   setOpenMessageBox(openMessage);
  //   setOpenLocationMessageBox(openLocationMessage);
  // };

  // !! backend need to work on this and at essSwitchSlice=>essResetMachinesState!!
  const { data: essZones } = useQuery(
    ['essZones', 'structured'],
    () => getEssZones({ structured: true }),
    {
      enabled: !!handleAccessToken,
      staleTime: Infinity,
    }
  );
  
  const permissions = useSelector(selectUserPermissions);

  const integratedButtonHandler = (
    id,
    state,
    scope,
    temp,
    data,
    type,
    specificLocation
  ) => {
    // !! TEST DATA
    // loopMachinesHandler(
    //   id,
    //   state,
    //   scope,
    //   type,
    //   temp,
    //   data,
    //   isF,
    //   essZones,
    //   'ESS',
    //   testEssSwitch,
    //   dispatch,
    //   handleUnSelectIndividualMachine,
    //   essSpecificLocationUnselectMachinesHandler,
    //   handleResetAllSelectBySwitch,
    //   handleResetAllSelectByLocation,
    //   messageBoxHandler,
    //   specificLocation
    // );
    // !! End of Test Data
    if(permissions.WRITE){
    loopMachinesHandler(
      id,
      state,
      scope,
      type,
      temp,
      data,
      isF,
      essZones,
      'ESS',
      flatEssSwitch,
      dispatch,
      handleUnSelectIndividualMachine,
      essSpecificLocationUnselectMachinesHandler,
      handleResetAllSelectBySwitch,
      handleResetAllSelectByLocation,
      messageBoxHandler,
      essSwitch,
    );
  }
    // initialize selections
    // handleInitializeSelections(id, scope);
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

  // const backEndDispatch = (
  //   MCControlName,
  //   program,
  //   machineIds,
  //   temp,
  //   data,
  //   swt
  // ) => {
  //   const isTgs = swt === 'TGS';
  //   switch (program) {
  //     case 'instantHeat':
  //       getCommandNumberService(MCControlName).then((commandNumber) => {
  //         const updatedData = {
  //           commandNumber: commandNumber,
  //           instant_temp: isF ? convertFahrenheitToCelsius(temp) : temp,
  //           on_switch: 1,
  //           actionType: MCControlName,
  //         };
  //         if (isTgs) {
  //           updateBlowersMasterControlService(machineIds, swt, updatedData);
  //         } else {
  //           updateSwitchesMasterControlService(machineIds, swt, updatedData);
  //         }
  //       });
  //       break;
  //     case 'fanOnly':
  //       getCommandNumberService(MCControlName).then((commandNumber) => {
  //         updateBlowersMasterControlService(machineIds, swt, {
  //           actionType: MCControlName,
  //           commandNumber: commandNumber,
  //           fan: 1,
  //         });
  //       });
  //       break;
  //     case 'snowSensor':
  //       getCommandNumberService(MCControlName).then((commandNumber) => {
  //         const updatedData = {
  //           commandNumber: commandNumber,
  //           snow_enabled: 1,
  //           actionType: MCControlName,
  //         };
  //         if (isTgs) {
  //           updateBlowersMasterControlService(machineIds, swt, updatedData);
  //         } else {
  //           updateSwitchesMasterControlService(machineIds, swt, updatedData);
  //         }
  //       });
  //       break;
  //     case 'constantTemp':
  //       getCommandNumberService(MCControlName).then((commandNumber) => {
  //         updateSwitchesMasterControlService(machineIds, swt, {
  //           commandNumber: commandNumber,
  //           on_constant: 1,
  //           constant_temp: temp,
  //           actionType: MCControlName,
  //         });
  //       });
  //       break;
  //     case 'windFactor':
  //       getCommandNumberService(MCControlName).then((commandNumber) => {
  //         const updatedData = {
  //           commandNumber: commandNumber,
  //           wind: 1,
  //           actionType: MCControlName,
  //         };
  //         if (isTgs) {
  //           updateBlowersMasterControlService(machineIds, swt, updatedData);
  //         } else {
  //           updateSwitchesMasterControlService(machineIds, swt, updatedData);
  //         }
  //       });
  //       break;
  //     case 'heatingSchedule':
  //       getCommandNumberService(MCControlName).then((commandNumber) => {
  //         const updatedData = {
  //           commandNumber: commandNumber,
  //           actionType: MCControlName,
  //           schedule: {
  //             startDate: formatTime(data.start),
  //             endDate: formatTime(data.end),
  //             threshold: data.inputTemp,
  //           },
  //         };
  //         if (isTgs) {
  //           updateBlowersMasterControlService(machineIds, swt, updatedData);
  //         } else {
  //           updateSwitchesMasterControlService(machineIds, swt, updatedData);
  //         }
  //       });
  //       break;
  //     case 'ats':
  //       let EBP = data.indexOf(true);
  //       if (EBP || EBP === 0) {
  //         getCommandNumberService(MCControlName).then((commandNumber) => {
  //           const updatedData = {
  //             commandNumber: commandNumber,
  //             EBP: EBP,
  //             actionType: MCControlName,
  //           };
  //           if (isTgs) {
  //             updateBlowersMasterControlService(machineIds, swt, updatedData);
  //           } else {
  //             updateSwitchesMasterControlService(machineIds, swt, updatedData);
  //           }
  //         });
  //       }
  //       break;
  //     case 'shutOff':
  //       getCommandNumberService(MCControlName).then((commandNumber) => {
  //         if (isTgs) {
  //           updateBlowersMasterControlService(machineIds, swt, {
  //             commandNumber: commandNumber,
  //             on_switch: 0,
  //             fan: 0,
  //             wind: 0,
  //             snow_enabled: 0,
  //             deleteCurrentSchedule: true,
  //             actionType: MCControlName,
  //           });
  //         } else {
  //           updateSwitchesMasterControlService(machineIds, swt, {
  //             commandNumber: commandNumber,
  //             on_switch: 0,
  //             on_constant: 0,
  //             wind: 0,
  //             snow_enabled: 0,
  //             deleteCurrentSchedule: true,
  //             actionType: MCControlName,
  //           });
  //         }
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // const programHandler = (
  //   program,
  //   state,
  //   scope,
  //   type,
  //   temp,
  //   data,
  //   location,
  //   specificLocation,
  //   machine
  // ) => {
  //   switch (program) {
  //     case 'instantHeat':
  //       instantHeatHandler(
  //         state,
  //         scope,
  //         temp,
  //         type,
  //         location,
  //         machine,
  //         specificLocation
  //       );
  //       break;
  //     case 'snowSensor':
  //       snowSensorHandler(
  //         state,
  //         scope,
  //         type,
  //         location,
  //         machine,
  //         specificLocation
  //       );
  //       break;
  //     case 'constantTemp':
  //       constantTempHandler(
  //         state,
  //         scope,
  //         temp,
  //         type,
  //         location,
  //         machine,
  //         specificLocation
  //       );
  //       break;
  //     case 'windFactor':
  //       windFactorHandler(
  //         state,
  //         scope,
  //         type,
  //         location,
  //         machine,
  //         specificLocation
  //       );
  //       break;
  //     case 'heatingSchedule':
  //       heatingScheduleHandler(
  //         state,
  //         scope,
  //         data,
  //         type,
  //         location,
  //         machine,
  //         specificLocation
  //       );
  //       break;
  //     case 'ats':
  //       atsHandler(
  //         state,
  //         scope,
  //         data,
  //         type,
  //         location,
  //         machine,
  //         specificLocation
  //       );
  //       break;
  //     case 'shutOff':
  //       shutOffHandler(state, scope, type, location, machine, specificLocation);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // const loopMachinesHandler = (program, state, scope, type, temp, data) => {
  //   let machineIds = [];
  //   if (scope === 'switch') {
  //     Object.keys(testEssSwitch).forEach((location) =>
  //       Object.keys(testEssSwitch[location]).forEach((el) => {
  //         // no specific location
  //         if (testEssSwitch[location][el]?.deviceMac) {
  //           if (testEssSwitch[location][el].isSelected) {
  //             machineIds.push(testEssSwitch[location][el].deviceMac);
  //             // unSelect individual machine as false
  //             dispatch(
  //               handleUnSelectIndividualMachine({ location, machine: el })
  //             );
  //             programHandler(
  //               program,
  //               state,
  //               scope,
  //               type,
  //               temp,
  //               data,
  //               location,
  //               el
  //             );
  //           }
  //         } else {
  //           // with specific location
  //           Object.keys(testEssSwitch[location][el]).forEach((machine) => {
  //             if (testEssSwitch[location][el][machine].isSelected) {
  //               machineIds.push(testEssSwitch[location][el][machine].deviceMac);
  //               // unSelect individual machine as false
  //               dispatch(
  //                 essSpecificLocationUnselectMachinesHandler({
  //                   location,
  //                   specificLocation: el,
  //                   machine,
  //                 })
  //               );
  //               programHandler(
  //                 program,
  //                 state,
  //                 scope,
  //                 type,
  //                 temp,
  //                 data,
  //                 location,
  //                 machine,
  //                 el
  //               );
  //             }
  //           });
  //         }
  //       })
  //     );
  //     backEndDispatch('MASTER_CONTROL', program, machineIds, temp, data, 'ESS');
  //     dispatch(handleResetAllSelectBySwitch());
  //   } else if (state !== 'selectA') {
  //     Object.keys(testEssSwitch[scope]).forEach((el) => {
  //       // no specific location
  //       if (testEssSwitch[scope][el]?.deviceMac) {
  //         if (testEssSwitch[scope][el].isSelected) {
  //           machineIds.push(testEssSwitch[scope][el].deviceMac);
  //           // unSelect individual machine as false
  //           dispatch(
  //             handleUnSelectIndividualMachine({ location: scope, machine: el })
  //           );
  //           programHandler(program, state, scope, type, temp, data, scope, el);
  //         }
  //       } else {
  //         // with specific location
  //         Object.keys(testEssSwitch[scope][el]).forEach((machine) => {
  //           if (testEssSwitch[scope][el][machine].isSelected) {
  //             machineIds.push(testEssSwitch[scope][el][machine].deviceMac);
  //             // unSelect individual machine as false
  //             dispatch(
  //               essSpecificLocationUnselectMachinesHandler({
  //                 location: scope,
  //                 specificLocation: el,
  //                 machine,
  //               })
  //             );
  //             programHandler(
  //               program,
  //               state,
  //               scope,
  //               type,
  //               temp,
  //               data,
  //               scope,
  //               machine,
  //               el
  //             );
  //           }
  //         });
  //       }
  //     });

  //     backEndDispatch(
  //       'LOCAL_MASTER_CONTROL',
  //       program,
  //       machineIds,
  //       temp,
  //       data,
  //       'ESS'
  //     );
  //     dispatch(handleResetAllSelectByLocation());
  //   } else {
  //     messageBoxHandler(state, scope, type, program);
  //   }
  // };

  // Functions for Individual controllers
  // const heatingScheduleHandler = (
  //   state,
  //   scope,
  //   data,
  //   type,
  //   location,
  //   machine,
  //   specificLocation
  // ) => {
  //   if (state === 'on') {
  //     dispatch(
  //       handleAddHeatingSchedule({
  //         location,
  //         specificLocation,
  //         machine,
  //         start: data.start,
  //         end: data.end,
  //         inputTemp: data.inputTemp,
  //         isF: data.isF,
  //         index: 0,
  //       })
  //     );
  //   } else {
  //     messageBoxHandler(state, scope, type, 'heating schedule program');
  //   }
  // };

  // const snowSensorHandler = (
  //   state,
  //   scope,
  //   type,
  //   location,
  //   machine,
  //   specificLocation
  // ) => {
  //   if (state === 'on') {
  //     dispatch(handleSnowSensor({ location, specificLocation, machine }));
  //   } else {
  //     messageBoxHandler(state, scope, type, 'snow sensor program');
  //   }
  // };

  // const instantHeatHandler = (
  //   state,
  //   scope,
  //   temp,
  //   type,
  //   location,
  //   machine,
  //   specificLocation
  // ) => {
  //   if (state === 'on') {
  //     dispatch(
  //       handleInstantHeatReady({
  //         location,
  //         specificLocation,
  //         machine,
  //         temp,
  //         isF,
  //       })
  //     );
  //   } else {
  //     messageBoxHandler(state, scope, type, 'instant heat program');
  //   }
  // };

  // const constantTempHandler = (
  //   state,
  //   scope,
  //   temp,
  //   type,
  //   location,
  //   machine,
  //   specificLocation
  // ) => {
  //   if (state === 'on') {
  //     dispatch(
  //       handleOptionalConstantTempReady({
  //         location,
  //         specificLocation,
  //         machine,
  //         isF,
  //         temp,
  //       })
  //     );
  //   } else {
  //     messageBoxHandler(state, scope, type, 'optional constant temp');
  //   }
  // };

  // const windFactorHandler = (
  //   state,
  //   scope,
  //   type,
  //   location,
  //   machine,
  //   specificLocation
  // ) => {
  //   if (state === 'on') {
  //     dispatch(handleWindFactor({ location, specificLocation, machine }));
  //   } else {
  //     messageBoxHandler(state, scope, type, 'wind factor program');
  //   }
  // };

  // const atsHandler = (
  //   state,
  //   scope,
  //   data,
  //   type,
  //   location,
  //   machine,
  //   specificLocation
  // ) => {
  //   if (state === 'on') {
  //     let EBP = data.indexOf(true);
  //     if (EBP || EBP === 0) {
  //       dispatch(
  //         handleAtsSelection({
  //           location,
  //           specificLocation,
  //           machine,
  //           selection: data,
  //         })
  //       );
  //     }
  //   } else {
  //     messageBoxHandler(state, scope, type, 'ats');
  //   }
  // };

  // const shutOffHandler = (
  //   state,
  //   scope,
  //   type,
  //   location,
  //   machine,
  //   specificLocation
  // ) => {
  //   if (state === 'on') {
  //     dispatch(
  //       essResetMachinesState({
  //         location,
  //         specificLocation,
  //         machine,
  //         essZones,
  //         isF,
  //       })
  //     );
  //   } else {
  //     messageBoxHandler(state, scope, type, 'deactivate');
  //   }
  // };

  return (
    <Wrapper>
      {isMasterControl || (
        <Section>
          <MasterControlBySwitch
            swtName='ess'
            buttonHandler={integratedButtonHandler}
          />
        </Section>
      )}

      <Section>
        <IntegratedSwitchLocations
          swtName='ess'
          buttonHandler={integratedButtonHandler}
        />
      </Section>
    </Wrapper>
  );
};

export default EssMain;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.section`
  &:first-child {
    margin-bottom: 8px;
  }
`;

// ========= instant heat==================
// const instantHeatHandler = (state, scope, temp, type) => {
//   if (state === 'on') {
//     // turn on
//     let machineIds = [];
//     if (scope === 'switch') {
//       // Logic for access selected machine
//       Object.keys(switchStatus).forEach((location) =>
//         Object.keys(switchStatus[location]).forEach((el) => {
//           if (switchStatus[location][el]?.deviceMac) {
//             if (switchStatus[location][el].isSelected) {
//               machineIds.push(switchStatus[location][el].deviceMac);
//               // unSelect individual machine as false
//               dispatch(handleUnSelectIndividualMachine({ location, el }));
// dispatch(
//               handleInstantHeat({ location: scope, machine: el, temp, isF })
//             );
//               // dispatch(handleInstantHeat({ location, machine, isF, temp }));
//             }
//           } else {
//             Object.keys(switchStatus[location][el]).forEach((machine) => {
//               if (switchStatus[location][el][machine].isSelected) {
//                 machineIds.push(
//                   switchStatus[location][el][machine].deviceMac
//                 );
//                 // unSelect individual machine as false
//                 dispatch(
//                   essSpecificLocationUnselectMachinesHandler({
//                     location,
//                     specificLocation: el,
//                     machine,
//                   })
//                 );
//                 dispatch(
//                   handleInstantHeatReady({
//                     location,
//                     specificLocation: el,
//                     machine,
//                     temp,
//                     isF,
//                   })
//                 );
//               }
//             });
//           }
//         })
//       );
//       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//         updateSwitchesMasterControlService(machineIds, 'ESS', {
//           commandNumber: commandNumber,
//           instant_temp: isF ? convertFahrenheitToCelsius(temp) : temp,
//           on_switch: 1,
//           actionType: 'MASTER_CONTROL',
//         });
//       });
//       dispatch(handleResetAllSelectBySwitch());
//     } else {
//       Object.keys(switchStatus[scope]).forEach((el) => {
//         if (switchStatus[scope][el]?.deviceMac) {
//           if (switchStatus[scope][el].isSelected) {
//             machineIds.push(switchStatus[scope][el].deviceMac);
//             // unSelect individual machine as false
//             dispatch(
//               handleUnSelectIndividualMachine({
//                 location: scope,
//                 machine: el,
//               })
//             );
//             dispatch(
//               handleInstantHeat({ location: scope, machine: el, temp, isF })
//             );
//           }
//         } else {
//           Object.keys(switchStatus[scope][el]).forEach((machine) => {
//             if (switchStatus[scope][el][machine].isSelected) {
//               machineIds.push(switchStatus[scope][el][machine].deviceMac);
//               // unSelect individual machine as false
//               dispatch(
//                 essSpecificLocationUnselectMachinesHandler({
//                   location: scope,
//                   specificLocation: el,
//                   machine,
//                 })
//               );
//               dispatch(
//                 handleInstantHeatReady({
//                   location: scope,
//                   specificLocation: el,
//                   machine,
//                   temp,
//                   isF,
//                 })
//               );
//             }
//           });
//         }
//       });
//       // Object.keys(switchStatus[scope]).forEach((machine) => {
//       //   if (switchStatus[scope][machine].isSelected) {
//       //     machineIds.push(switchStatus[scope][machine].deviceMac);
//       //     // unSelect individual machine as false
//       //     dispatch(
//       //       handleUnSelectIndividualMachine({ location: scope, machine })
//       //     );
//       //     dispatch(
//       //       handleInstantHeat({ location: scope, machine, temp, isF })
//       //     );
//       //   }
//       // });
//       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
//         (commandNumber) => {
//           updateSwitchesMasterControlService(machineIds, 'ESS', {
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

//  =====================snow sensor=================
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
//             // unSelect individual machine as false
//             dispatch(handleUnSelectIndividualMachine({ location, machine }));
//             // dispatch(handleSnowSensor({ location, machine }));
//           }
//         })
//       );
//       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//         updateSwitchesMasterControlService(machineIds, 'ESS', {
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
//           // unSelect individual machine as false
//           dispatch(
//             handleUnSelectIndividualMachine({ location: scope, machine })
//           );
//           dispatch(handleSnowSensor({ location: scope, machine }));
//         }
//       });
//       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
//         (commandNumber) => {
//           updateSwitchesMasterControlService(machineIds, 'ESS', {
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

// ======constant temp==============
// const constantTempHandler = (state, scope, temp, type) => {
//   if (state === 'on') {
//     // turn on
//     let machineIds = [];
//     if (scope === 'switch') {
//       // Logic for access selected machine
//       Object.keys(switchStatus).forEach((location) =>
//         Object.keys(switchStatus[location]).forEach((machine) => {
//           // unSelect individual machine as false
//           dispatch(handleUnSelectIndividualMachine({ location, machine }));
//           if (switchStatus[location][machine].isSelected) {
//             machineIds.push(switchStatus[location][machine].deviceMac);
//             dispatch(
//               handleOptionalConstantTemp({ location, machine, isF, temp })
//             );
//           }
//         })
//       );
//       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//         updateSwitchesMasterControlService(machineIds, 'ESS', {
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
//           // unSelect individual machine as false
//           machineIds.push(switchStatus[scope][machine].deviceMac);
//           dispatch(
//             handleUnSelectIndividualMachine({ location: scope, machine })
//           );
//           dispatch(
//             handleOptionalConstantTemp({
//               location: scope,
//               machine,
//               temp,
//               isF,
//             })
//           );
//         }
//       });
//       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
//         (commandNumber) => {
//           updateSwitchesMasterControlService(machineIds, 'ESS', {
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

// ========= heating schedule =====================
// const heatingScheduleHandler = (
//   state,
//   scope,
//   data,
//   type,
//   location,
//   machine,
//   specificLocation
// ) => {
//   if (state === 'off') {
//   } else if (state === 'clear') {
//   } else if (state === 'on') {
//     if (specificLocation) {
//     } else {
//     }

//     // set new schedule
//     let machineIds = [];
//     if (scope === 'switch') {
//       // Logic for access selected machine
//       Object.keys(switchStatus).forEach((location) =>
//         Object.keys(switchStatus[location]).forEach((machine) => {
//           if (switchStatus[location][machine].isSelected) {
//             machineIds.push(switchStatus[location][machine].deviceMac);
//             // unSelect individual machine as false
//             dispatch(handleUnSelectIndividualMachine({ location, machine }));
//             dispatch(
//               handleAddHeatingSchedule({
//                 location,
//                 machine,
//                 start: data.start,
//                 end: data.end,
//                 inputTemp: data.inputTemp,
//                 isF: data.isF,
//                 index: 0,
//               })
//             );
//           }
//         })
//       );
//       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//         updateSwitchesMasterControlService(machineIds, 'ESS', {
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
//           // unSelect individual machine as false
//           dispatch(
//             handleUnSelectIndividualMachine({ location: scope, machine })
//           );
//           dispatch(
//             handleAddHeatingSchedule({
//               location: scope,
//               machine,
//               start: data.start,
//               end: data.end,
//               inputTemp: data.inputTemp,
//               isF: data.isF,
//               index: 0,
//             })
//           );
//         }
//       });
//       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
//         (commandNumber) => {
//           updateSwitchesMasterControlService(machineIds, 'ESS', {
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

// ======== wind factor ============
// const windFactorHandler = (
//   state,
//   scope,
//   type,
//   location,
//   machine,
//   specificLocation
// ) => {
//   if (state === 'on') {
//     dispatch(handleWindFactor({ location, specificLocation, machine }));

//     // state === 'on'
//     let machineIds = [];
//     if (scope === 'switch') {
//       Object.keys(switchStatus).forEach((location) =>
//         Object.keys(switchStatus[location]).forEach((machine) => {
//           if (switchStatus[location][machine].isSelected) {
//             machineIds.push(switchStatus[location][machine].deviceMac);
//             // unSelect individual machine as false
//             dispatch(handleUnSelectIndividualMachine({ location, machine }));
//             dispatch(handleWindFactor({ location, machine }));
//           }
//         })
//       );

//         getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//           updateSwitchesMasterControlService(machineIds, 'ESS', {
//             commandNumber: commandNumber,
//             wind: 1,
//             actionType: 'MASTER_CONTROL',
//           });
//         });

//       dispatch(handleResetAllSelectBySwitch());
//     } else {
//       Object.keys(switchStatus[scope]).forEach((machine) => {
//         if (switchStatus[scope][machine].isSelected) {
//           machineIds.push(switchStatus[scope][machine].deviceMac);
//           // unSelect individual machine as false
//           dispatch(
//             handleUnSelectIndividualMachine({ location: scope, machine })
//           );
//           dispatch(handleWindFactor({ location: scope, machine }));
//         }
//       });

//       getCommandNumberService('LOCAL_MASTER_CONTROL').then(
//         (commandNumber) => {
//           updateSwitchesMasterControlService(machineIds, 'ESS', {
//             commandNumber: commandNumber,
//             wind: 1,
//             actionType: 'LOCAL_MASTER_CONTROL',
//           });
//         }
//       );
//       dispatch(handleResetAllSelectByLocation());
//     }
//   } else {
//     messageBoxHandler(state, scope, type, 'wind factor program');
//   }
// };

// ========= ATS ==============
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
//               // unSelect individual machine as false
//               machineIds.push(switchStatus[location][machine].deviceMac);
//               dispatch(
//                 handleUnSelectIndividualMachine({ location, machine })
//               );
//               dispatch(
//                 handleAtsSelection({ location, machine, selection: data })
//               );
//             }
//           })
//         );
//         getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//           updateSwitchesMasterControlService(machineIds, 'ESS', {
//             commandNumber: commandNumber,
//             EBP: EBP,
//             actionType: 'MASTER_CONTROL',
//           });
//         });
//         dispatch(handleResetAllSelectBySwitch());
//       } else {
//         Object.keys(switchStatus[scope]).forEach((machine) => {
//           if (switchStatus[scope][machine].isSelected) {
//             // unSelect individual machine as false
//             machineIds.push(switchStatus[scope][machine].deviceMac);
//             dispatch(
//               handleUnSelectIndividualMachine({ location: scope, machine })
//             );
//             handleAtsSelection({ location: scope, machine, selection: data });
//           }
//         });
//         getCommandNumberService('LOCAL_MASTER_CONTROL').then(
//           (commandNumber) => {
//             updateSwitchesMasterControlService(machineIds, 'ESS', {
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
//     setProgramName('ats');
//     // handleMessageBox(state, scope, type);
//     const { openMessage, openLocationMessage, newMessage, newMessageTitle } =
//       mainMessageBoxHandler(state, scope, type, programName);
//     setMessage(newMessage);
//     setMessageTitle(newMessageTitle);
//     setOpenMessageBox(openMessage);
//     setOpenLocationMessageBox(openLocationMessage);
//   }
// };

// ==============shut off ======================
// const shutOffHandler = (state, scope, type) => {
//   if (state === 'off') {
//     // dispatch(handleWindFactorOff({ location, machine }));
//   } else if (state === 'on') {
//     // state === 'on'
//     // if (scope === 'switch') {
//     //   Object.keys(switchStatus).forEach((location) =>
//     //     Object.keys(switchStatus[location]).forEach((machine) => {
//     //       if (switchStatus[location][machine].isSelected) {
//     //         // unSelect individual machine as false
//     //         dispatch(handleUnSelectIndividualMachine({ location, machine }));
//     //         dispatch(handleShutOff({ location, machine }));
//     //       }
//     //     })
//     //   );
//     //   dispatch(handleResetAllSelectBySwitch());
//     // } else {
//     //   Object.keys(switchStatus[scope]).forEach((machine) => {
//     //     if (switchStatus[scope][machine].isSelected) {
//     //       // unSelect individual machine as false
//     //       dispatch(
//     //         handleUnSelectIndividualMachine({ location: scope, machine })
//     //       );
//     //       dispatch(handleShutOff({ location: scope, machine }));
//     //     }
//     //   });
//     //   dispatch(handleResetAllSelectByLocation());
//     // }
//     let machineIds = [];
//     if (scope === 'switch') {
//       Object.keys(switchStatus).forEach((location) =>
//         Object.keys(switchStatus[location]).forEach((machine) => {
//           if (switchStatus[location][machine].isSelected) {
//             // unSelect individual machine as false
//             machineIds.push(switchStatus[location][machine].deviceMac);
//             dispatch(handleUnSelectIndividualMachine({ location, machine }));
//             dispatch(
//               essResetMachinesState({ location, machine, essZones, isF })
//             );
//           }
//         })
//       );
//       getCommandNumberService('MASTER_CONTROL').then((commandNumber) => {
//         updateSwitchesMasterControlService(machineIds, 'ESS', {
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
//           // unSelect individual machine as false
//           machineIds.push(switchStatus[scope][machine].deviceMac);
//           dispatch(
//             handleUnSelectIndividualMachine({ location: scope, machine })
//           );
//           dispatch(
//             essResetMachinesState({ location: scope, machine, essZones, isF })
//           );
//           getCommandNumberService('LOCAL_MASTER_CONTROL').then(
//             (commandNumber) => {
//               updateSwitchesMasterControlService(machineIds, 'ESS', {
//                 commandNumber: commandNumber,
//                 on_switch: 0,
//                 on_constant: 0,
//                 wind: 0,
//                 snow_enabled: 0,
//                 deleteCurrentSchedule: true,
//                 actionType: 'LOCAL_MASTER_CONTROL',
//               });
//             }
//           );
//         }
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
