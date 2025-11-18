import { createSlice } from "@reduxjs/toolkit";
import {
  baseProgramStates,
  baseGraphData,
  createSSRState,
  extractESSMachineData,
} from "../utils/machineDataExtractors";
import { createCommonReducers } from "../utils/commonReducerBuilders";
import { createSSRReducers } from "../utils/ssrReducers";
import {
  buildSwitchState,
  createSocketUpdateReducer,
} from "../utils/switchStateBuilder";

const initialState = {
  machineType: "ess",
  deviceMac: null,
  deviceStatus: null,
  isEssSwitchActivated: false,
  displayConflictMessage: false,
  isEssSwitch: true,
  isSelected: false,

  isOff: false,
  freezeBy: null,
  isExpanded: false,

  // master control individual machine
  openMachineController: false,
  isFaults: false,
  isGp: true,
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
  heatingSystemAbbr: "",
  usageHours: 75,
  energyConsump: 300,
  reading: 30,
  address: { lat: 42.36997, lng: -71.070647 },

  ats: { isActivated: false },

  ssrState: createSSRState(),

  ...baseGraphData,
};

const essSwitchSlice = createSlice({
  name: "essSwitch",
  initialState: {
    "bet-east": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
      "05": initialState,
    },
    "bet-west": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
      "05": initialState,
    },
    "s.coast": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
      "04": initialState,
      "05": initialState,
    },
    "n-Mountain": {
      "01": initialState,
      "02": initialState,
      "03": initialState,
    },
    essSwitch: {},
    flatEssSwitch: {},
  },
  reducers: {
    // Common reducers for all switch types
    ...createCommonReducers("ess", { includeOptionalConstantTemp: true }),

    // SSR-specific reducers
    ...createSSRReducers("ess"),

    // Legacy action names for backward compatibility
    handleSelectIndividualMachine: (state, action) => {
      const { location, machine } = action.payload;
      if (state.flatEssSwitch[location]?.[machine]) {
        state.flatEssSwitch[location][machine].isSelected = true;
      }
    },

    handleUnSelectIndividualMachine: (state, action) => {
      const { location, machine } = action.payload;
      if (state.flatEssSwitch[location]?.[machine]) {
        state.flatEssSwitch[location][machine].isSelected = false;
      }
    },

    handleInstantHeatReady: (state, action) => {
      const { location, machine, isF, temp } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.instantHeat.inputTemp = temp;
        machineState.instantHeat.isF = isF;
        machineState.instantHeat.isReady = true;
      }
    },

    handleInstantHeatOff: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.instantHeat.isActivated = false;
        machineState.instantHeat.isReady = false;
      }
    },

    handleInstantHeatReset: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.instantHeat = { ...baseProgramStates.instantHeat };
      }
    },

    handleSnowSensor: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.snowSensor.isReady = true;
      }
    },

    handleSnowSensorOff: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.snowSensor.isReady = false;
      }
    },

    handleSnowSensorReset: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.snowSensor = { ...baseProgramStates.snowSensor };
      }
    },

    handleOptionalConstantTempReady: (state, action) => {
      const { location, machine, temp, isF } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.optionalConstantTemp.inputTemp = temp;
        machineState.optionalConstantTemp.isF = isF;
        machineState.optionalConstantTemp.isReady = true;
      }
    },

    handleMachineOptionalConstantTempOff: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.optionalConstantTemp.isActivated = false;
        machineState.optionalConstantTemp.isReady = false;
      }
    },

    handleOptionalConstantTempReset: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.optionalConstantTemp = {
          ...baseProgramStates.optionalConstantTemp,
        };
      }
    },

    handleWindFactor: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.windFactor.isReady = true;
      }
    },

    handleWindFactorOff: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.windFactor.isReady = false;
      }
    },

    handleWindFactorReset: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.windFactor = { ...baseProgramStates.windFactor };
      }
    },

    handleAddHeatingSchedule: (state, action) => {
      const { location, machine, index, start, end, inputTemp, isF, id } =
        action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
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

    handleReadyHeatingSchedule: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.heatingSchedule.isReady = action.payload.state;
      }
    },

    handleClearHeatingSchedule: (state, action) => {
      const { location, machine, data } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.heatingScheduleList = data;
      }
    },

    handleHeatingScheduleReset: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.heatingScheduleList = {
          ...baseProgramStates.heatingScheduleList,
        };
        machineState.heatingSchedule = {
          ...baseProgramStates.heatingSchedule,
        };
      }
    },

    handleShutOff: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.isOff = !machineState.isOff;
      }
    },

    essResetMachinesState: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        state.flatEssSwitch[location][machine] = {
          ...initialState,
          ...machineState,
        };
      }
    },

    handleSelector: (state, action) => {
      const { location, machine, id, data } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState?.ssrState?.[id]) {
        machineState.ssrState[id].select = data;
      }
    },

    handleToggleSSR: (state, action) => {
      const { location, machine, id, buttonStatus } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState?.ssrState?.[id]) {
        machineState.ssrState[id].buttonStatus = buttonStatus;
      }
    },

    handleExpandSSRDetail: (state, action) => {
      const { location, machine, status } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.isExpanded = status;
      }
    },

    handleChangeSSRDetail: (state, action) => {
      const { location, machine, id, data } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState?.ssrState?.[id]) {
        machineState.ssrState[id].specs = data;
      }
    },

    handleOpenMachineController: (state, action) => {
      const { location, machine, status } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.openMachineController = status;
      }
    },

    handleOpenSetting: (state, action) => {
      const { location, machine, id, status } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState?.ssrState?.[id]) {
        machineState.ssrState[id].isSettingOpen = status;
      }
    },

    handleOpenPasswordBox: (state, action) => {
      const { location, machine, id, status } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState?.ssrState?.[id]) {
        machineState.ssrState[id].openPasswordBox = status;
      }
    },

    handleAtsSelection: (state, action) => {
      const { location, machine, selection } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.atsSelection = selection;
      }
    },

    // for mobile
    essHandleUnselectAllProgram: (state, action) => {
      const { location, machine } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState.mobileSelectedProgram = {
          ...baseProgramStates.mobileSelectedProgram,
        };
      }
    },

    essHandleSelectProgram: (state, action) => {
      const { location, machine, program } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState?.mobileSelectedProgram) {
        machineState.mobileSelectedProgram[program] =
          !machineState.mobileSelectedProgram[program];
      }
    },

    handleEssSwitch: (state, action) => {
      delete state["bet-east"];
      delete state["bet-west"];
      delete state["n-Mountain"];
      delete state["s.coast"];

      const isF = action.payload.isF;
      const zones = action.payload.essZones;

      const { nestedSwitch, flatSwitch } = buildSwitchState(
        zones,
        initialState,
        extractESSMachineData,
        isF
      );

      state.essSwitch = nestedSwitch;
      state.flatEssSwitch = flatSwitch;
    },

    handleEssSwitchSocket: createSocketUpdateReducer(
      "flatEssSwitch",
      extractESSMachineData
    ),

    handleEssSSRState: (state, action) => {
      const { location, machine, data } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];

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

    handleEssSSRStateSocket: (state, action) => {
      const data = action.payload;
      const location = data.zoneInfo.zone_id;
      const machine = data.device_mac || data.device_id;

      if (!state.flatEssSwitch[location]) {
        state.flatEssSwitch[location] = {};
      }

      if (!state.flatEssSwitch[location][machine]) {
        state.flatEssSwitch[location][machine] = {};
      }

      if (!state.flatEssSwitch[location][machine].ssrState) {
        state.flatEssSwitch[location][machine].ssrState = {};
      }

      if (data.hasOwnProperty("specs")) {
        const ssrKey = `ssr${data.No + 1}`;
        const heaterMap =
          state.flatEssSwitch[location][machine].heaterThermocoupleMap;

        state.flatEssSwitch[location][machine].ssrState[ssrKey] = {
          ...state.flatEssSwitch[location][machine].ssrState[ssrKey],
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

        if (!state.flatEssSwitch[location][machine].ssrFault) {
          state.flatEssSwitch[location][machine].ssrFault = [];
        }
        state.flatEssSwitch[location][machine].ssrFault[data.No] = data.fault
          ? 1
          : 0;
      } else {
        data.heater_thermocouple_map?.forEach((el, index) => {
          const ssrKey = `ssr${index + 1}`;
          if (!state.flatEssSwitch[location][machine].ssrState[ssrKey]) {
            state.flatEssSwitch[location][machine].ssrState[ssrKey] = {};
          }
          state.flatEssSwitch[location][machine].ssrState[ssrKey] = {
            ...state.flatEssSwitch[location][machine].ssrState[ssrKey],
            select: `tc-${el}`,
          };
        });
      }
    },

    handleEssGraph: (state, action) => {
      const { location, machine, graphType, data } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
      if (machineState) {
        machineState[graphType] = data;
      }
    },

    handleEssGraphDate: (state, action) => {
      const { location, machine, graphType, data, unit } = action.payload;
      const machineState = state.flatEssSwitch[location]?.[machine];
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
  },
});

export default essSwitchSlice;

export const selectEssSwitch = (state) => state.essSwitch;
export const selectFlatEssSwitch = (state) => {
  return state.essSwitch;
};

export const {
  handleSelectIndividualMachine,
  essSpecificLocationSelectMachinesHandler,
  handleUnSelectIndividualMachine,
  essSpecificLocationUnselectMachinesHandler,

  handleInstantHeatOff,
  handleInstantHeatReady,
  handleInstantHeatReset,

  handleSnowSensorReset,
  handleSnowSensor,
  handleSnowSensorOff,

  handleWindFactor,
  handleWindFactorOff,
  handleWindFactorReset,

  handleOptionalConstantTempReady,
  handleMachineOptionalConstantTempOff,
  handleOptionalConstantTempReset,

  handleShutOff,
  essResetMachinesState,

  handleAddHeatingSchedule,
  handleReadyHeatingSchedule,
  handleClearHeatingSchedule,
  handleHeatingScheduleReset,

  handleSelector,
  handleToggleSSR,
  handleExpandSSRDetail,
  handleChangeSSRDetail,
  handleOpenSetting,
  handleOpenPasswordBox,

  handleOpenMachineController,
  handleAtsSelection,

  // for mobile
  essHandleUnselectAllProgram,
  essHandleSelectProgram,

  handleEssSwitch,
  handleEssSwitchSocket,
  handleEssSSRState,
  handleEssSSRStateSocket,
  handleEssGraph,
  handleEssGraphDate,
} = essSwitchSlice.actions;
