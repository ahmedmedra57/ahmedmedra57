import { createSlice } from "@reduxjs/toolkit";
import {
  baseProgramStates,
  baseGraphData,
  createSSRState,
  extractTESMachineData,
} from "../utils/machineDataExtractors";
import { createCommonReducers } from "../utils/commonReducerBuilders";
import { createSSRReducers } from "../utils/ssrReducers";
import {
  buildSwitchState,
  createSocketUpdateReducer,
} from "../utils/switchStateBuilder";

const initialState = {
  machineType: "tes",
  deviceMac: null,
  deviceStatus: null,
  isTesSwitchActivated: false,
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
  isTGSActive: false,
  isExpanded: false,

  // master control individual machine
  openMachineController: false,
  isFaults: false,
  isGp: true,
  isReactiveByTgs: false,
  isEbp: false,
  atsSelection: [],
  isWifi: false,
  thermocouple: false,
  heaterThermocoupleMap: [],

  currentTemp: null,
  setTemp: null,
  consumption: null,
  enclosureTemp: null,
  outSideTemp: null,
  hoursOfUsage: null,

  ...baseProgramStates,

  heatingSystem: "#10 Switch Turnout",

  // telemetry
  heatingSystemAbbr: "",
  usageHours: 50,
  energyConsump: 700,
  reading: 30,
  address: { lat: 42.36997, lng: -71.070647 },

  ssrState: createSSRState(),

  ...baseGraphData,
};

const tesSwitchSlice = createSlice({
  name: "tesSwitch",
  initialState: {
    "bet-north": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
    },
    "bet-south": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
    },
    "n.coast": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
    },
    tesSwitch: {},
    flatTesSwitch: {},
  },
  reducers: {
    // Common reducers for all switch types
    ...createCommonReducers("tes", {
      includeOptionalConstantTemp: true,
      includeConflict: true,
    }),

    // SSR-specific reducers
    ...createSSRReducers("tes"),

    // Legacy/specific TES reducers
    tesHandleInstantHeat: (state, action) => {
      const { location, machine, temp, isF } = action.payload;
      const machineState = state.flatTesSwitch[location]?.[machine];
      if (machineState) {
        machineState.instantHeat.inputTemp = temp;
        machineState.instantHeat.isF = isF;
        machineState.instantHeat.isReady = true;
      }
    },

    tesHandleOptionalConstantTemp: (state, action) => {
      const { location, specificLocation, machine, temp, isF } = action.payload;
      const machineState = specificLocation
        ? state.flatTesSwitch[location]?.[specificLocation]?.[machine]
        : state.flatTesSwitch[location]?.[machine];

      if (machineState) {
        machineState.optionalConstantTemp.inputTemp = temp;
        machineState.optionalConstantTemp.isF = isF;
        machineState.optionalConstantTemp.isActivated = true;
      }
    },

    tesResetMachinesState: (state, action) => {
      const { location, specificLocation, machine } = action.payload;
      const machineState = specificLocation
        ? state.flatTesSwitch[location]?.[specificLocation]?.[machine]
        : state.flatTesSwitch[location]?.[machine];

      if (machineState) {
        if (specificLocation) {
          state.flatTesSwitch[location][specificLocation][machine] = {
            ...initialState,
            ...machineState,
          };
        } else {
          state.flatTesSwitch[location][machine] = {
            ...initialState,
            ...machineState,
          };
        }
      }
    },

    handleTesSwitch: (state, action) => {
      delete state["bet-north"];
      delete state["bet-south"];
      delete state["n.coast"];

      const isF = action.payload.isF;
      const zones = action.payload.tesZones;

      const { nestedSwitch, flatSwitch } = buildSwitchState(
        zones,
        { ...initialState, machineType: "tes" },
        extractTESMachineData,
        isF
      );

      state.tesSwitch = nestedSwitch;
      state.flatTesSwitch = flatSwitch;
    },

    handleTesSwitchSocket: createSocketUpdateReducer(
      "flatTesSwitch",
      extractTESMachineData
    ),

    handleTesSSRState: (state, action) => {
      const { location, machine, data } = action.payload;
      const machineState = state.flatTesSwitch[location]?.[machine];

      if (machineState) {
        const ssrEntries = data.map((ssr) => [
          `ssr${ssr.No + 1}`,
          {
            ...machineState.ssrState[`ssr${ssr.No + 1}`],
            ...ssr,
          },
        ]);
        machineState.ssrState = Object.fromEntries(
          ssrEntries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        );
      }
    },

    handleTesSSRStateSocket: (state, action) => {
      const data = action.payload;
      const location = data.zoneInfo.zone_id;
      const machine = data.device_mac;

      if (!state.flatTesSwitch[location]) {
        state.flatTesSwitch[location] = {};
      }

      if (!state.flatTesSwitch[location][machine]) {
        state.flatTesSwitch[location][machine] = {};
      }

      if (!state.flatTesSwitch[location][machine].ssrState) {
        state.flatTesSwitch[location][machine].ssrState = {};
      }

      if (data.hasOwnProperty("specs")) {
        const ssrKey = `ssr${data.No + 1}`;
        const heaterMap =
          state.flatTesSwitch[location][machine].heaterThermocoupleMap;

        state.flatTesSwitch[location][machine].ssrState[ssrKey] = {
          ...state.flatTesSwitch[location][machine].ssrState[ssrKey],
          ...data,
          select: `tc-${heaterMap?.[data.No] || "01"}`,
          buttonStatus:
            data?.fault === true || data?.Load_exceeded === true
              ? "flt"
              : data?.active === true
              ? "on"
              : "off",
          switchName: `${data.name} ${data.size}`,
        };

        if (!state.flatTesSwitch[location][machine].ssrFault) {
          state.flatTesSwitch[location][machine].ssrFault = [];
        }
        state.flatTesSwitch[location][machine].ssrFault[data.No] = data.fault
          ? 1
          : 0;
      } else {
        data.heater_thermocouple_map?.forEach((el, index) => {
          const ssrKey = `ssr${index + 1}`;
          if (!state.flatTesSwitch[location][machine].ssrState[ssrKey]) {
            state.flatTesSwitch[location][machine].ssrState[ssrKey] = {};
          }
          state.flatTesSwitch[location][machine].ssrState[ssrKey] = {
            ...state.flatTesSwitch[location][machine].ssrState[ssrKey],
            select: `tc-${el}`,
          };
        });
      }
    },
  },
});

export default tesSwitchSlice;

export const selectTesSwitch = (state) => state.tesSwitch;

export const {
  tesHandleSelectIndividualMachine,
  tesSpecificLocationSelectMachinesHandler,
  tesHandleUnSelectIndividualMachine,
  tesSpecificLocationUnselectMachinesHandler,

  tesHandleInstantHeat,
  tesHandleInstantHeatOff,
  tesHandleInstantHeatReset,
  tesHandleInstantHeatIsReady,

  tesHandleSnowSensor,
  tesHandleSnowSensorOff,
  tesHandleSnowSensorReset,

  tesHandleWindFactor,
  tesHandleWindFactorOff,
  tesHandleWindFactorReset,

  tesHandleOptionalConstantTemp,
  tesHandleOptionalConstantTempIsReady,
  tesHandleOptionalConstantTempOff,
  tesHandleOptionalConstantTempReset,

  tesHandleShutOff,
  tesResetMachinesState,

  tesHandleAddHeatingSchedule,
  tesHandleReadyHeatingSchedule,
  tesHandleClearHeatingSchedule,
  tesHandleHeatingScheduleReset,

  tesHandleSelector,
  tesHandleToggleSSR,
  tesHandleExpandSSRDetail,
  tesHandleChangeSSRDetail,
  tesHandleOpenSetting,
  tesHandleOpenPasswordBox,

  tesHandleOpenMachineController,
  tesHandleAtsSelection,

  // for mobile
  tesHandleSelectProgram,
  tesHandleUnselectAllProgram,

  handleTesSwitch,
  handleTesSwitchSocket,
  handleTesSSRState,
  handleTesSSRStateSocket,

  tesActivateConflictMessage,
  tesDeactivateConflictMessage,
  tesSetDevicesConflicts,

  handleTesGraph,
  handleTesGraphDate,
} = tesSwitchSlice.actions;
