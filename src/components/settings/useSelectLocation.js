import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  handleSettingsLocationSelect,
  handleSettingsMachineSelect,
  handleSettingsResetAllSelect,
  handleSettingsSelectAll,
  handleSettingsSpecificLocationSelect,
} from "../store/slices/settings/force&CommandAndAdminSelectSlice";
import { getAllSpecificLocationNames } from "../../helpers/helpers";

const useSelectLocationBox = (
  openHeaders,
  handleUnSelectIndividualMachine,
  selectedOne,
  ess,
  essSpec,
  tgs,
  tgsSpec,
  tes,
  tesSpec,
  sys,
  sysSpec,
  ate,
  hp,
  isEnable1,
  isEnable2,
  isEnable3,
  isEnable4,
  isEnable5,
  isEnable6,
  isEnable7,
  isEnable8,
  isEnable9,
  isEnable10
) => {
  const dispatch = useDispatch();
  const dispatchUnSelectMachinesHandler = (
    location,
    swt,
    swtData,
    isSelectedSys,
    specificLocation
  ) => {
    if (specificLocation) {
      const machines = Object.keys(swtData[location].subLocations[specificLocation].devices);
      machines.forEach((machine) =>
        dispatch(
          handleUnSelectIndividualMachine({
            swt,
            location,
            specificLocation,
            machine,
            isSelectedSys,
          })
        )
      );
    } else {
      const machines = Object.keys(swtData[location].devices);
      console.log("dispatchUnSelectMachinesHandler",machines);
      machines.forEach((machine) =>
        dispatch(
          handleUnSelectIndividualMachine({
            swt,
            location,
            machine,
            isSelectedSys,
          })
        )
      );
    }
  };

  const handleUnSelectMachines = (location, swt, swtData, specificLocation) => {
    //   if (swt === 'ess') {
    //     dispatchUnSelectMachinesHandler(location, swt, swtData);
    //   } else if (swt === 'tes') {
    //     dispatchUnSelectMachinesHandler(location, swt, swtData);
    //   } else if (swt === 'tgs') {
    //     dispatchUnSelectMachinesHandler(location, swt, swtData);
    //   } else
    if (swt === "valveSettings") {
      dispatchUnSelectMachinesHandler(
        location,
        "tgs",
        swtData,
        "isSelectedValveSettings",
        specificLocation
      );
    } else if (swt === "gasType") {
      dispatchUnSelectMachinesHandler(
        location,
        "tgs",
        swtData,
        "isSelectedGasType",
        specificLocation
      );
    } else if (swt === "sysIdentification") {
      dispatchUnSelectMachinesHandler(
        location,
        "sys",
        swtData,
        "isSelectedSysIdentification",
        specificLocation
      );
    } else if (swt === "sysConfiguration") {
      dispatchUnSelectMachinesHandler(
        location,
        "sys",
        swtData,
        "isSelectedSysConfiguration",
        specificLocation
      );
    } else if (swt === "forceGasAndElectricSys") {
      dispatchUnSelectMachinesHandler(
        location,
        "sys",
        swtData,
        "isSelectedForceGasAndElectricSys",
        specificLocation
      );
    } else if (swt === "outsideTemp") {
      dispatchUnSelectMachinesHandler(
        location,
        "sys",
        swtData,
        "isOutsideTempSelected",
        specificLocation
      );
    } else {
      dispatchUnSelectMachinesHandler(
        location,
        swt,
        swtData,
        null,
        specificLocation
      );
    }
  };

  // const handleUnSelectMachines = (location, swt) => {
  //   if (swt === 'ess') {
  //     const machines = Object.keys(ess[location]);
  //     machines.forEach((machine) =>
  //       dispatch(handleUnSelectIndividualMachine({ swt, location, machine }))
  //     );
  //   } else if (swt === 'tes') {
  //     const machines = Object.keys(tes[location]);
  //     machines.forEach((machine) =>
  //       dispatch(handleUnSelectIndividualMachine({ swt, location, machine }))
  //     );
  //   } else if (swt === 'tgs') {
  //     const machines = Object.keys(tgs[location]);
  //     machines.forEach((machine) =>
  //       dispatch(handleUnSelectIndividualMachine({ swt, location, machine }))
  //     );
  //   } else if (swt === 'valveSettings') {
  //     const machines = Object.keys(sys[location]);
  //     machines.forEach((machine) =>
  //       dispatch(
  //         handleUnSelectIndividualMachine({
  //           swt: 'tgs',
  //           location,
  //           machine,
  //           isSelectedSys: 'isSelectedValveSettings',
  //         })
  //       )
  //     );
  //   } else if (swt === 'gasType') {
  //     const machines = Object.keys(tgs[location]);
  //     machines.forEach((machine) =>
  //       dispatch(
  //         handleUnSelectIndividualMachine({
  //           swt: 'tgs',
  //           location,
  //           machine,
  //           isSelectedSys: 'isSelectedGasType',
  //         })
  //       )
  //     );
  //   }
  //   else if (swt === 'sysIdentification') {
  //     const machines = Object.keys(sys[location]);
  //     machines.forEach((machine) =>
  //       dispatch(
  //         handleUnSelectIndividualMachine({
  //           swt: 'sys',
  //           location,
  //           machine,
  //           isSelectedSys: 'isSelectedSysIdentification',
  //         })
  //       )
  //     );
  //   } else if (swt === 'sysConfiguration') {
  //     const machines = Object.keys(sys[location]);
  //     machines.forEach((machine) =>
  //       dispatch(
  //         handleUnSelectIndividualMachine({
  //           swt: 'sys',
  //           location,
  //           machine,
  //           isSelectedSys: 'isSelectedSysConfiguration',
  //         })
  //       )
  //     );
  //   } else if (swt === 'forceGasAndElectricSys') {
  //     const machines = Object.keys(sys[location]);
  //     machines.forEach((machine) =>
  //       dispatch(
  //         handleUnSelectIndividualMachine({
  //           swt: 'sys',
  //           location,
  //           machine,
  //           isSelectedSys: 'isSelectedForceGasAndElectricSys',
  //         })
  //       )
  //     );
  //   } else if (swt === 'outsideTemp') {
  //     const machines = Object.keys(sys[location]);
  //     machines.forEach((machine) =>
  //       dispatch(
  //         handleUnSelectIndividualMachine({
  //           swt: 'sys',
  //           location,
  //           machine,
  //           isSelectedSys: 'isOutsideTempSelected',
  //         })
  //       )
  //     );
  //   }
  // };

  const loopHandler = (swt, swtData) => {
    const locations = swtData && Object.keys(swtData);
    // const filteredSpecLocationsKeys = getAllSpecificLocationNames(swtData);
    locations.forEach((location) => {
      // const isMachine = Object.keys(swtData[location].devices).some(
      //   (machine) => swtData[location].devices[machine].deviceMac
      // );
      if (!swtData[location].isSpecificLocation) {
        handleUnSelectMachines(location, swt, swtData);
      } else {
        Object.keys(swtData[location].subLocations).forEach((specificLocation) =>
          handleUnSelectMachines(location, swt, swtData, specificLocation)
        );
      }
    });
  };

  useEffect(() => {
    // this resets all switches
    //  when system is changed

    dispatch(handleSettingsResetAllSelect());
    if (openHeaders[0]) {
      loopHandler("ess", essSpec);
    } else if (openHeaders[2]) {
      loopHandler("tes", tesSpec);
    } else if (openHeaders[1]) {
      if (isEnable2) {
        loopHandler("gasType", tgsSpec);
      }
      if (isEnable1) {
        loopHandler("valveSettings", tgsSpec);
      } else {
        loopHandler("tgs", tgsSpec);
      }
    } else if (openHeaders[5]) {
      if (isEnable3) {
        loopHandler("forceGasAndElectricSys", sysSpec);
      }
      if (isEnable4) {
        loopHandler("sysIdentification", sysSpec);
      }
      if (isEnable5) {
        loopHandler("outsideTemp", sysSpec);
      }
      if (isEnable6) {
        loopHandler("burningChamber", sysSpec);
      }
      if (isEnable7) {
        loopHandler("encloseTemp", sysSpec);
      }
      if (isEnable8) {
        loopHandler("currEss", sysSpec);
      }
      if (isEnable9) {
        loopHandler("currTgs", sysSpec);
      }
      if (isEnable10) {
        loopHandler("currTes", sysSpec);
      } else {
        loopHandler("sys", sysSpec);
      }
    }
    // if (openHeaders[0]) {
    //   const locations = ess && Object.keys(ess);
    //   locations.map((location) => handleUnSelectMachines(location, 'ess'));
    // } else if (openHeaders[2]) {
    //   const locations = tes && Object.keys(tes);
    //   locations.map((location) => handleUnSelectMachines(location, 'tes'));
    // } else if (openHeaders[1]) {
    //   const locations = tgs && Object.keys(tgs);
    //   if (isEnable2) {
    //     locations.map((location) =>
    //       handleUnSelectMachines(location, 'gasType')
    //     );
    //   }
    //   if (isEnable1) {
    //     locations.map((location) =>
    //       handleUnSelectMachines(location, 'valveSettings')
    //     );
    //   } else {
    //     locations.map((location) => handleUnSelectMachines(location, 'tgs'));
    //   }
    // } else if (openHeaders[5]) {
    //   const locations = sys && Object.keys(sys);
    //   if (isEnable3) {
    //     locations.map((location) =>
    //       handleUnSelectMachines(location, 'forceGasAndElectricSys')
    //     );
    //   }
    //   if (isEnable4) {
    //     locations.map((location) =>
    //       handleUnSelectMachines(location, 'sysIdentification')
    //     );
    //   }
    //   if (isEnable5) {
    //     locations.map((location) =>
    //       handleUnSelectMachines(location, 'outsideTemp')
    //     );
    //   }
    //   if (isEnable6) {
    //     locations.map((location) =>
    //       handleUnSelectMachines(location, 'burningChamber')
    //     );
    //   }
    //   if (isEnable7) {
    //     locations.map((location) =>
    //       handleUnSelectMachines(location, 'encloseTemp')
    //     );
    //   }
    //   if (isEnable8) {
    //     locations.map((location) =>
    //       handleUnSelectMachines(location, 'currEss')
    //     );
    //   }
    //   if (isEnable9) {
    //     locations.map((location) =>
    //       handleUnSelectMachines(location, 'currTgs')
    //     );
    //   }
    //   if (isEnable10) {
    //     locations.map((location) =>
    //       handleUnSelectMachines(location, 'currTes')
    //     );
    //   } else {
    //     locations.map((location) => handleUnSelectMachines(location, 'sys'));
    //   }
    // }
  }, [openHeaders]);

  // *********** useEffect create array with false inside for selection of selected switches******************************

  const dispatchAllHandler = (program) => {
    dispatch(handleSettingsSelectAll({ switch: program, status: false }));
  };
  const dispatchLocationsHandler = (programData, program) => {
    const locations = Object.keys(programData);
    const locationsArr = locations.map((_) => false);
    dispatch(
      handleSettingsLocationSelect({ arr: locationsArr, switch: program })
    );
  };
  const dispatchSpecificLocationsHandler = (programData, program) => {
    const specificLocationName = getAllSpecificLocationNames(programData);
    const allSpecificLocationsArr = [];
    programData &&
      Object.values(programData).forEach((value) => {
        if (value?.isSpecificLocation) {
          const specLocation = Object.keys(value.subLocations).map(
            (el) => false
          );
          allSpecificLocationsArr.push(specLocation);
        }
      });
    console.log(allSpecificLocationsArr, "allSpecificLocationsArr");
    dispatch(
      handleSettingsSpecificLocationSelect({
        arr: allSpecificLocationsArr,
        switch: program,
      })
    );
    return specificLocationName;
  };
  const dispatchMachinesHandler = (
    programData,
    program,
    specificationLocationArr
  ) => {
    const specificLocationArr = [];
    const machineArr = Object.values(programData).map((location) => {
      if (location.isSpecificLocation) {
        const machinesList = Object.values(location.subLocations).map(
          (specLocation) => Object.keys(specLocation.devices).map((el) => false)
        );
        const specLocation = Object.keys(location.subLocations).map(
          (el) => false
        );
        specificLocationArr.push(specLocation);
        return machinesList;
      } else {
        return Object.values(location.devices).map((value) => {
          return false;
        });
      }
    });
    dispatch(handleSettingsMachineSelect({ arr: machineArr, switch: program }));
  };

  useEffect(() => {
    if (openHeaders[0]) {
      if (!selectedOne) {
        dispatchAllHandler("ess");
        dispatchLocationsHandler(essSpec, "ess");

        const specificationLocationArr = dispatchSpecificLocationsHandler(
          essSpec,
          "ess"
        );
        dispatchMachinesHandler(essSpec, "ess", specificationLocationArr);
      }
    } else if (openHeaders[1]) {
      if (!selectedOne) {
        if (isEnable1) {
          dispatchAllHandler("valveSettings");
          dispatchLocationsHandler(tgsSpec, "valveSettings");

          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tgsSpec,
            "valveSettings"
          );
          dispatchMachinesHandler(
            tgsSpec,
            "valveSettings",
            specificationLocationArr
          );
        }
        if (isEnable2) {
          dispatchAllHandler("gasType");
          dispatchLocationsHandler(tgsSpec, "gasType");

          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tgs,
            "gasType"
          );
          dispatchMachinesHandler(tgsSpec, "gasType", specificationLocationArr);
        }
        if (tgs) {
          dispatchAllHandler("tgs");
          dispatchLocationsHandler(tgsSpec, "tgs");

          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tgsSpec,
            "tgs"
          );
          dispatchMachinesHandler(tgsSpec, "tgs", specificationLocationArr);
        }
      }
    } else if (openHeaders[2]) {
      if (!selectedOne) {
        dispatchAllHandler("tes");
        dispatchLocationsHandler(tesSpec, "tes");

        const specificationLocationArr = dispatchSpecificLocationsHandler(
          tesSpec,
          "tes"
        );
        dispatchMachinesHandler(tesSpec, "tes", specificationLocationArr);
      }
    } else if (openHeaders[5]) {
      if (!selectedOne) {
        if (isEnable3) {
          dispatchAllHandler("forceGasAndElectricSys");
          dispatchLocationsHandler(tesSpec, "forceGasAndElectricSys");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tesSpec,
            "forceGasAndElectricSys"
          );
          dispatchMachinesHandler(
            tesSpec,
            "forceGasAndElectricSys",
            specificationLocationArr
          );
        }
        if (isEnable5) {
          dispatchAllHandler("outsideTemp");
          dispatchLocationsHandler(sysSpec, "outsideTemp");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            sysSpec,
            "outsideTemp"
          );
          dispatchMachinesHandler(sysSpec, "outsideTemp", specificationLocationArr);
        }
        if (isEnable6) {
          dispatchAllHandler("burningChamber");
          dispatchLocationsHandler(tgsSpec, "burningChamber");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tgsSpec,
            "burningChamber"
          );
          dispatchMachinesHandler(
            tgsSpec,
            "burningChamber",
            specificationLocationArr
          );
        }
        if (isEnable7) {
          dispatchAllHandler("encloseTemp");
          dispatchLocationsHandler(sysSpec, "encloseTemp");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            sysSpec,
            "encloseTemp"
          );
          dispatchMachinesHandler(sysSpec, "encloseTemp", specificationLocationArr);
        }
        if (isEnable8) {
          dispatchAllHandler("currEss");
          dispatchLocationsHandler(essSpec, "currEss");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            essSpec,
            "currEss"
          );
          dispatchMachinesHandler(essSpec, "currEss", specificationLocationArr);
        }
        if (isEnable9) {
          dispatchAllHandler("currTgs");
          dispatchLocationsHandler(tgsSpec, "currTgs");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tgsSpec,
            "currTgs"
          );
          dispatchMachinesHandler(tgsSpec, "currTgs", specificationLocationArr);
        }
        if (isEnable10) {
          dispatchAllHandler("currTes");
          dispatchLocationsHandler(tesSpec, "currTes");
          const specificationLocationArr = dispatchSpecificLocationsHandler(
            tesSpec,
            "currTes"
          );
          dispatchMachinesHandler(tesSpec, "currTes", specificationLocationArr);
        }
      }
    }
    // if (openHeaders[0]) {
    //   if (!selectedOne) {
    //     const essLocations = Object.keys(ess);
    //     dispatch(handleSettingsSelectAll({ switch: 'ess', status: false }));
    //     const locationArr = essLocations.map((location) => false);
    //     dispatch(
    //       handleSettingsLocationSelect({ arr: locationArr, switch: 'ess' })
    //     );

    //     const machineArr = Object.values(ess).map((location) =>
    //       Object.keys(location).map((machine) => false)
    //     );
    //     dispatch(
    //       handleSettingsMachineSelect({ arr: machineArr, switch: 'ess' })
    //     );
    //   }
    // } else if (openHeaders[1]) {
    //   if (!selectedOne) {
    //     if (isEnable1) {
    //       const tgsLocations = Object.keys(tgs);
    //       dispatch(
    //         handleSettingsSelectAll({ status: false, switch: 'valveSettings' })
    //       );
    //       const locationArr = tgsLocations.map((location) => false);
    //       dispatch(
    //         handleSettingsLocationSelect({
    //           arr: locationArr,
    //           switch: 'valveSettings',
    //         })
    //       );

    //       const machineArr = Object.values(tgs).map((location) =>
    //         Object.keys(location).map((machine) => false)
    //       );
    //       dispatch(
    //         handleSettingsMachineSelect({
    //           arr: machineArr,
    //           switch: 'valveSettings',
    //         })
    //       );
    //     }

    //     if (isEnable2) {
    //       const tgsLocations = Object.keys(tgs);
    //       dispatch(
    //         handleSettingsSelectAll({ status: false, switch: 'gasType' })
    //       );
    //       const locationArr = tgsLocations.map((location) => false);
    //       dispatch(
    //         handleSettingsLocationSelect({
    //           arr: locationArr,
    //           switch: 'gasType',
    //         })
    //       );

    //       const machineArr = Object.values(tgs).map((location) =>
    //         Object.keys(location).map((machine) => false)
    //       );
    //       dispatch(
    //         handleSettingsMachineSelect({ arr: machineArr, switch: 'gasType' })
    //       );
    //     }
    //     if (tgs) {
    //       const tgsLocations = Object.keys(tgs);
    //       dispatch(handleSettingsSelectAll({ status: false, switch: 'tgs' }));
    //       const locationArr = tgsLocations.map((location) => false);
    //       dispatch(
    //         handleSettingsLocationSelect({ arr: locationArr, switch: 'tgs' })
    //       );

    //       const machineArr = Object.values(tgs).map((location) =>
    //         Object.keys(location).map((machine) => false)
    //       );
    //       dispatch(
    //         handleSettingsMachineSelect({ arr: machineArr, switch: 'tgs' })
    //       );
    //     }
    //   }
    // } else if (openHeaders[2]) {
    //   if (!selectedOne) {
    //     const tesLocations = Object.keys(tes);
    //     dispatch(handleSettingsSelectAll({ status: false, switch: 'tes' }));
    //     const locationArr = tesLocations.map((location) => false);
    //     dispatch(
    //       handleSettingsLocationSelect({ arr: locationArr, switch: 'tes' })
    //     );

    //     const machineArr = Object.values(tes).map((location) =>
    //       Object.keys(location).map((machine) => false)
    //     );
    //     dispatch(
    //       handleSettingsMachineSelect({ arr: machineArr, switch: 'tes' })
    //     );
    //   }
    // } else if (openHeaders[5]) {
    //   if (!selectedOne) {
    //     if (isEnable3) {
    //       const sysLocations = Object.keys(sys);
    //       dispatch(
    //         handleSettingsSelectAll({
    //           status: false,
    //           switch: 'forceGasAndElectricSys',
    //         })
    //       );
    //       const locationArr = sysLocations.map((location) => false);
    //       dispatch(
    //         handleSettingsLocationSelect({
    //           arr: locationArr,
    //           switch: 'forceGasAndElectricSys',
    //         })
    //       );

    //       const machineArr = Object.values(sys).map((location) =>
    //         Object.keys(location).map((machine) => false)
    //       );
    //       dispatch(
    //         handleSettingsMachineSelect({
    //           arr: machineArr,
    //           switch: 'forceGasAndElectricSys',
    //         })
    //       );
    //     }
    //     // if (isEnable4) {
    //     //   const sysLocations = Object.keys(sys);
    //     //   dispatch(
    //     //     handleSettingsSelectAll({
    //     //       status: false,
    //     //       switch: 'sysIdentification',
    //     //     })
    //     //   );
    //     //   const locationArr = sysLocations.map((location) => false);
    //     //   dispatch(
    //     //     handleSettingsLocationSelect({
    //     //       arr: locationArr,
    //     //       switch: 'sysIdentification',
    //     //     })
    //     //   );

    //     //   const machineArr = Object.values(sys).map((location) =>
    //     //     Object.keys(location).map((machine) => false)
    //     //   );
    //     //   dispatch(
    //     //     handleSettingsMachineSelect({
    //     //       arr: machineArr,
    //     //       switch: 'sysIdentification',
    //     //     })
    //     //   );
    //     // }
    //     // else {
    //     //   const sysLocations = Object.keys(sys);
    //     //   dispatch(handleSettingsSelectAll({ status: false, switch: 'sys' }));
    //     //   const locationArr = sysLocations.map((location) => false);
    //     //   dispatch(
    //     //     handleSettingsLocationSelect({ arr: locationArr, switch: 'sys' })
    //     //   );

    //     //   const machineArr = Object.values(sys).map((location) =>
    //     //     Object.keys(location).map((machine) => false)
    //     //   );
    //     //   dispatch(
    //     //     handleSettingsMachineSelect({ arr: machineArr, switch: 'sys' })
    //     //   );
    //     // }

    //     if (isEnable5) {
    //       const sysLocations = Object.keys(sys);
    //       dispatch(
    //         handleSettingsSelectAll({
    //           status: false,
    //           switch: 'outsideTemp',
    //         })
    //       );
    //       const locationArr = sysLocations.map((location) => false);
    //       dispatch(
    //         handleSettingsLocationSelect({
    //           arr: locationArr,
    //           switch: 'outsideTemp',
    //         })
    //       );

    //       const machineArr = Object.values(sys).map((location) =>
    //         Object.keys(location).map((machine) => false)
    //       );
    //       dispatch(
    //         handleSettingsMachineSelect({
    //           arr: machineArr,
    //           switch: 'outsideTemp',
    //         })
    //       );
    //     }
    //     if (isEnable6) {
    //       const sysLocations = Object.keys(sys);
    //       dispatch(
    //         handleSettingsSelectAll({
    //           status: false,
    //           switch: 'burningChamber',
    //         })
    //       );
    //       const locationArr = sysLocations.map((location) => false);
    //       dispatch(
    //         handleSettingsLocationSelect({
    //           arr: locationArr,
    //           switch: 'burningChamber',
    //         })
    //       );

    //       const machineArr = Object.values(sys).map((location) =>
    //         Object.keys(location).map((machine) => false)
    //       );
    //       dispatch(
    //         handleSettingsMachineSelect({
    //           arr: machineArr,
    //           switch: 'burningChamber',
    //         })
    //       );
    //     }
    //     if (isEnable7) {
    //       const sysLocations = Object.keys(sys);
    //       dispatch(
    //         handleSettingsSelectAll({
    //           status: false,
    //           switch: 'encloseTemp',
    //         })
    //       );
    //       const locationArr = sysLocations.map((location) => false);
    //       dispatch(
    //         handleSettingsLocationSelect({
    //           arr: locationArr,
    //           switch: 'encloseTemp',
    //         })
    //       );

    //       const machineArr = Object.values(sys).map((location) =>
    //         Object.keys(location).map((machine) => false)
    //       );
    //       dispatch(
    //         handleSettingsMachineSelect({
    //           arr: machineArr,
    //           switch: 'encloseTemp',
    //         })
    //       );
    //     }
    //     if (isEnable8) {
    //       const sysLocations = Object.keys(sys);
    //       dispatch(
    //         handleSettingsSelectAll({
    //           status: false,
    //           switch: 'currEss',
    //         })
    //       );
    //       const locationArr = sysLocations.map((location) => false);
    //       dispatch(
    //         handleSettingsLocationSelect({
    //           arr: locationArr,
    //           switch: 'currEss',
    //         })
    //       );

    //       const machineArr = Object.values(sys).map((location) =>
    //         Object.keys(location).map((machine) => false)
    //       );
    //       dispatch(
    //         handleSettingsMachineSelect({
    //           arr: machineArr,
    //           switch: 'currEss',
    //         })
    //       );
    //     }
    //     if (isEnable9) {
    //       const sysLocations = Object.keys(sys);
    //       dispatch(
    //         handleSettingsSelectAll({
    //           status: false,
    //           switch: 'currTgs',
    //         })
    //       );
    //       const locationArr = sysLocations.map((location) => false);
    //       dispatch(
    //         handleSettingsLocationSelect({
    //           arr: locationArr,
    //           switch: 'currTgs',
    //         })
    //       );

    //       const machineArr = Object.values(sys).map((location) =>
    //         Object.keys(location).map((machine) => false)
    //       );
    //       dispatch(
    //         handleSettingsMachineSelect({
    //           arr: machineArr,
    //           switch: 'currTgs',
    //         })
    //       );
    //     }
    //     if (isEnable10) {
    //       const sysLocations = Object.keys(sys);
    //       dispatch(
    //         handleSettingsSelectAll({
    //           status: false,
    //           switch: 'currTes',
    //         })
    //       );
    //       const locationArr = sysLocations.map((location) => false);
    //       dispatch(
    //         handleSettingsLocationSelect({
    //           arr: locationArr,
    //           switch: 'currTes',
    //         })
    //       );

    //       const machineArr = Object.values(sys).map((location) =>
    //         Object.keys(location).map((machine) => false)
    //       );
    //       dispatch(
    //         handleSettingsMachineSelect({
    //           arr: machineArr,
    //           switch: 'currTes',
    //         })
    //       );
    //     }
    //   }
    // }
  }, [
    openHeaders,
    selectedOne,
    // ess,
    // tes,
    // tgs,
    sys,
    ate,
    hp,
    isEnable1,
    isEnable2,
    isEnable3,
    isEnable4,
    isEnable5,
    isEnable6,
    isEnable7,
    isEnable8,
    isEnable9,
    isEnable10,
  ]);

  return;
};

export default useSelectLocationBox;
