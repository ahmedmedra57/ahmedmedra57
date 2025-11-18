import { createSlice } from "@reduxjs/toolkit";
import {
  baseProgramStates,
  baseGraphData,
  extractTGSMachineData,
} from "../utils/machineDataExtractors";
import { createCommonReducers } from "../utils/commonReducerBuilders";
import {
  buildSwitchState,
  createSocketUpdateReducer,
} from "../utils/switchStateBuilder";

const initialState = {
  machineType: "tgs",
  deviceMac: null,
  deviceStatus: null,
  isTgsSwitchActivated: false,
  displayConflictMessage: false,
  isEssSwitch: true,
  isSelected: false,

  devicesConflicts: {
    systemTarget: "",
    currentSwitch: "",
    DesiredSwitch: "",
    commandTarget: "",
    extraData: null,
  },

  isOff: false,
  freezeBy: null,
  isTESActive: false,

  isExpanded: false,
  // master control individual machine
  openMachineController: false,

  isFaults: false,
  isGp: true,
  isEbp: false,
  atsSelection: [],
  isWifi: false,
  thermocouple: false,

  currentTemp: null,
  setTemp: null,
  consumption: null,
  enclosureTemp: null,
  outSideTemp: null,
  hoursOfUsage: null,

  // telemetry
  heatingSystemAbbr: "",
  usageHours: 650,
  energyConsump: 1200,
  reading: 30,
  address: { lat: 42.36997, lng: -71.070647 },

  ...baseProgramStates,
  fanOnly: false,
  mobileSelectedProgram: {
    ...baseProgramStates.mobileSelectedProgram,
    fanOnly: false,
  },

  ...baseGraphData,
};

const tgsSwitchSlice = createSlice({
  name: "tgsSwitch",
  initialState: {
    "mtl-east": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
      "05": initialState,
    },
    "mtl-west": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
      "05": initialState,
    },
    "mtl-south": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
      "05": initialState,
    },
    tgsSwitch: {},
    flatTgsSwitch: {},
  },
  reducers: {
    // Common reducers for all switch types (TGS doesn't have SSR or optional constant temp)
    ...createCommonReducers("tgs", { includeConflict: true }),

    // TGS-specific reducers
    tgsHandleInstantHeat: (state, action) => {
      const { location, machine, temp, isF } = action.payload;
      const machineState = state.flatTgsSwitch[location]?.[machine];
      if (machineState) {
        machineState.instantHeat.inputTemp = temp;
        machineState.instantHeat.isF = isF;
        machineState.instantHeat.isReady = true;
      }
    },

    tgsResetMachinesState: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatTgsSwitch[location]?.[machine];
      if (machineState) {
        state.flatTgsSwitch[location][machine] = {
          ...initialState,
          ...machineState,
        };
      }
    },

    tgsHandleFanOnly: (state, action) => {
      const { location, specificLocation, machine, scope, state: fanState } =
        action.payload;

      const actualLocation = scope || location;
      const machineState = specificLocation
        ? state.flatTgsSwitch[actualLocation]?.[specificLocation]?.[machine]
        : state.flatTgsSwitch[actualLocation]?.[machine];

      if (machineState) {
        machineState.fanOnly = fanState;
      }
    },

    handleTgsSwitch: (state, action) => {
      delete state["mtl-east"];
      delete state["mtl-west"];
      delete state["mtl-south"];

      const isF = action.payload.isF;
      const zones = action.payload.tgsZones;

      const { nestedSwitch, flatSwitch } = buildSwitchState(
        zones,
        initialState,
        extractTGSMachineData,
        isF
      );

      state.tgsSwitch = nestedSwitch;
      state.flatTgsSwitch = flatSwitch;
    },

    handleTgsSwitchSocket: createSocketUpdateReducer(
      "flatTgsSwitch",
      extractTGSMachineData
    ),
  },
});

export default tgsSwitchSlice;

export const selectTgsSwitch = (state) => state.tgsSwitch;
export const selectFlatTgsSwitch = (state) => {
  return state.tgsSwitch;
};

export const {
  tgsHandleSelectIndividualMachine,
  tgsSpecificLocationSelectMachinesHandler,
  tgsHandleUnSelectIndividualMachine,
  tgsSpecificLocationUnselectMachinesHandler,

  tgsHandleInstantHeat,
  tgsHandleInstantHeatIsReady,
  tgsHandleInstantHeatOff,
  tgsHandleInstantHeatReset,

  tgsHandleSnowSensor,
  tgsHandleSnowSensorOff,
  tgsHandleSnowSensorReset,

  tgsHandleWindFactor,
  tgsHandleWindFactorOff,
  tgsHandleWindFactorReset,

  tgsHandleShutOff,
  tgsResetMachinesState,

  tgsHandleFanOnly,

  tgsHandleAddHeatingSchedule,
  tgsHandleReadyHeatingSchedule,
  tgsHandleClearHeatingSchedule,
  tgsHandleHeatingScheduleReset,

  tgsHandleOpenMachineController,
  tgsHandleAtsSelection,

  // for mobile
  tgsHandleUnselectAllProgram,
  tgsHandleSelectProgram,

  handleTgsSwitch,
  handleTgsSwitchSocket,

  tgsActivateConflictMessage,
  tgsDeactivateConflictMessage,
  tgsSetDevicesConflicts,

  handleTgsGraph,
  handleTgsGraphDate,
} = tgsSwitchSlice.actions;
