import { baseProgramStates } from "./machineDataExtractors";

/**
 * Helper to get machine state based on specificLocation
 */
const getMachineState = (state, location, specificLocation, machine) => {
  if (specificLocation) {
    return state[location][specificLocation][machine];
  }
  return state[location][machine];
};

/**
 * Create selection reducers for a switch slice
 */
export const createSelectionReducers = (sliceKey) => ({
  [`${sliceKey}HandleSelectIndividualMachine`]: (state, action) => {
    const { location, specificLocation, machine } = action.payload;
    const machineState = getMachineState(
      state[`flat${sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)}Switch`],
      location,
      specificLocation,
      machine
    );
    if (machineState) {
      machineState.isSelected = true;
    }
  },

  [`${sliceKey}SpecificLocationSelectMachinesHandler`]: (state, action) => {
    const flatState =
      state[`flat${sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)}Switch`];
    if (
      flatState[action.payload.specificLocation] &&
      flatState[action.payload.specificLocation][action.payload.machine]
    ) {
      flatState[action.payload.specificLocation][
        action.payload.machine
      ].isSelected = true;
    }
  },

  [`${sliceKey}HandleUnSelectIndividualMachine`]: (state, action) => {
    const { location, specificLocation, machine } = action.payload;
    const machineState = getMachineState(
      state[`flat${sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)}Switch`],
      location,
      specificLocation,
      machine
    );
    if (machineState) {
      machineState.isSelected = false;
    }
  },

  [`${sliceKey}SpecificLocationUnselectMachinesHandler`]: (state, action) => {
    const { location, specificLocation, machine } = action.payload;
    const flatState =
      state[`flat${sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)}Switch`];
    if (specificLocation) {
      if (
        flatState[location] &&
        flatState[location][specificLocation] &&
        flatState[location][specificLocation][machine]
      ) {
        flatState[location][specificLocation][machine].isSelected = false;
      }
    } else {
      if (flatState[specificLocation] && flatState[specificLocation][machine]) {
        flatState[specificLocation][machine].isSelected = false;
      }
    }
  },
});

/**
 * Create instant heat reducers
 */
export const createInstantHeatReducers = (sliceKey) => {
  const flatKey = `flat${
    sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
  }Switch`;

  return {
    [`${sliceKey}HandleInstantHeatIsReady`]: (state, action) => {
      const { location, specificLocation, machine, temp, isF } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.instantHeat.inputTemp = temp;
        machineState.instantHeat.isF = isF;
        machineState.instantHeat.isReady = true;
      }
    },

    [`${sliceKey}HandleInstantHeatOff`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.instantHeat.isActivated = false;
        machineState.instantHeat.isReady = false;
      }
    },

    [`${sliceKey}HandleInstantHeatReset`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.instantHeat = { ...baseProgramStates.instantHeat };
      }
    },
  };
};

/**
 * Create snow sensor reducers
 */
export const createSnowSensorReducers = (sliceKey) => {
  const flatKey = `flat${
    sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
  }Switch`;

  return {
    [`${sliceKey}HandleSnowSensor`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.snowSensor.isReady = true;
      }
    },

    [`${sliceKey}HandleSnowSensorOff`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.snowSensor.isReady = false;
      }
    },

    [`${sliceKey}HandleSnowSensorReset`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.snowSensor = { ...baseProgramStates.snowSensor };
      }
    },
  };
};

/**
 * Create wind factor reducers
 */
export const createWindFactorReducers = (sliceKey) => {
  const flatKey = `flat${
    sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
  }Switch`;

  return {
    [`${sliceKey}HandleWindFactor`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.windFactor.isReady = true;
      }
    },

    [`${sliceKey}HandleWindFactorOff`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.windFactor.isReady = false;
      }
    },

    [`${sliceKey}HandleWindFactorReset`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.windFactor = { ...baseProgramStates.windFactor };
      }
    },
  };
};

/**
 * Create optional constant temp reducers (for ESS/TES)
 */
export const createOptionalConstantTempReducers = (sliceKey) => {
  const flatKey = `flat${
    sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
  }Switch`;

  return {
    [`${sliceKey}HandleOptionalConstantTempIsReady`]: (state, action) => {
      const { location, specificLocation, machine, temp, isF } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.optionalConstantTemp.inputTemp = temp;
        machineState.optionalConstantTemp.isF = isF;
        machineState.optionalConstantTemp.isReady = true;
      }
    },

    [`${sliceKey}HandleOptionalConstantTempOff`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.optionalConstantTemp.isActivated = false;
        machineState.optionalConstantTemp.isReady = false;
      }
    },

    [`${sliceKey}HandleOptionalConstantTempReset`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.optionalConstantTemp = {
          ...baseProgramStates.optionalConstantTemp,
        };
      }
    },
  };
};

/**
 * Create heating schedule reducers
 */
export const createHeatingScheduleReducers = (sliceKey) => {
  const flatKey = `flat${
    sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
  }Switch`;

  return {
    [`${sliceKey}HandleAddHeatingSchedule`]: (state, action) => {
      const { location, specificLocation, machine, index, start, end, inputTemp, isF, id } =
        action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.heatingScheduleList[index] = {
          start,
          end,
          inputTemp,
          isF,
          id,
        };
        machineState.heatingScheduleList[index + 1] = {
          start: { date: null, time: null },
          end: { date: null, time: null },
          inputTemp: null,
          isF: null,
          id: null,
        };
      }
    },

    [`${sliceKey}HandleReadyHeatingSchedule`]: (state, action) => {
      const { location, specificLocation, machine, state: scheduleState } =
        action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.heatingSchedule.isReady = scheduleState;
      }
    },

    [`${sliceKey}HandleClearHeatingSchedule`]: (state, action) => {
      const { location, specificLocation, machine, data } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.heatingScheduleList = data;
      }
    },

    [`${sliceKey}HandleHeatingScheduleReset`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.heatingScheduleList = {
          ...baseProgramStates.heatingScheduleList,
        };
        machineState.heatingSchedule = {
          ...baseProgramStates.heatingSchedule,
        };
      }
    },
  };
};

/**
 * Create shut off reducer
 */
export const createShutOffReducer = (sliceKey) => {
  const flatKey = `flat${
    sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
  }Switch`;

  return {
    [`${sliceKey}HandleShutOff`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.isOff = !machineState.isOff;
      }
    },
  };
};

/**
 * Create machine controller reducers
 */
export const createMachineControllerReducers = (sliceKey) => {
  const flatKey = `flat${
    sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
  }Switch`;

  return {
    [`${sliceKey}HandleOpenMachineController`]: (state, action) => {
      const { location, specificLocation, machine, status } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.openMachineController = status;
      }
    },

    [`${sliceKey}HandleAtsSelection`]: (state, action) => {
      const { location, specificLocation, machine, selection } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.atsSelection = selection;
      }
    },
  };
};

/**
 * Create mobile program selection reducers
 */
export const createMobileProgramReducers = (sliceKey) => {
  const flatKey = `flat${
    sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
  }Switch`;

  return {
    [`${sliceKey}HandleUnselectAllProgram`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.mobileSelectedProgram = {
          ...baseProgramStates.mobileSelectedProgram,
        };
      }
    },

    [`${sliceKey}HandleSelectProgram`]: (state, action) => {
      const { location, specificLocation, machine, program } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState && machineState.mobileSelectedProgram) {
        machineState.mobileSelectedProgram[program] =
          !machineState.mobileSelectedProgram[program];
      }
    },
  };
};

/**
 * Create graph data reducers
 */
export const createGraphReducers = (sliceKey) => {
  const flatKey = `flat${
    sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
  }Switch`;

  return {
    [`handle${sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)}Graph`]: (
      state,
      action
    ) => {
      const { location, specificLocation, machine, graphType, data } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState[graphType] = data;
      }
    },

    [`handle${sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)}GraphDate`]: (
      state,
      action
    ) => {
      const { location, specificLocation, machine, graphType, data, unit } =
        action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.graphDateData = {
          ...machineState.graphDateData,
          [graphType]: data,
        };
        if (graphType !== "dataConsumptionGraphData") {
          machineState.graphDateData.intervalUnit = unit;
        }
      }
    },
  };
};

/**
 * Create conflict message reducers (for TES/TGS)
 */
export const createConflictReducers = (sliceKey) => {
  const flatKey = `flat${
    sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
  }Switch`;

  return {
    [`${sliceKey}ActivateConflictMessage`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.displayConflictMessage = true;
      }
    },

    [`${sliceKey}DeactivateConflictMessage`]: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.displayConflictMessage = false;
      }
    },

    [`${sliceKey}SetDevicesConflicts`]: (state, action) => {
      const {
        location,
        specificLocation,
        machine,
        currentSwitch,
        DesiredSwitch,
        systemTarget,
        commandTarget,
        extraData,
      } = action.payload;
      const machineState = getMachineState(
        state[flatKey],
        location,
        specificLocation,
        machine
      );
      if (machineState) {
        machineState.devicesConflicts = {
          currentSwitch,
          desiredSwitch: DesiredSwitch,
          systemTarget,
          commandTarget,
          extraData,
        };
      }
    },
  };
};

/**
 * Combine all common reducers
 */
export const createCommonReducers = (sliceKey, options = {}) => {
  const {
    includeOptionalConstantTemp = false,
    includeSSR = false,
    includeConflict = false,
  } = options;

  const reducers = {
    ...createSelectionReducers(sliceKey),
    ...createInstantHeatReducers(sliceKey),
    ...createSnowSensorReducers(sliceKey),
    ...createWindFactorReducers(sliceKey),
    ...createHeatingScheduleReducers(sliceKey),
    ...createShutOffReducer(sliceKey),
    ...createMachineControllerReducers(sliceKey),
    ...createMobileProgramReducers(sliceKey),
    ...createGraphReducers(sliceKey),
  };

  if (includeOptionalConstantTemp) {
    Object.assign(reducers, createOptionalConstantTempReducers(sliceKey));
  }

  if (includeConflict) {
    Object.assign(reducers, createConflictReducers(sliceKey));
  }

  return reducers;
};
