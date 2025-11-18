import { isNumber } from "lodash";
import { convertCelsiusToFahrenheit } from "../../../helpers/helpers";

/**
 * Base initial state for machine programs
 */
export const baseProgramStates = {
  instantHeat: { inputTemp: 0, isReady: false, isActivated: false, isF: null },
  snowSensor: {
    isReady: false,
    isActivated: false,
    defaultTemp: 350,
    isF: null,
  },
  optionalConstantTemp: {
    inputTemp: 0,
    apply: false,
    isActivated: false,
    isReady: false,
    isF: null,
  },
  heatingScheduleList: [
    {
      start: { date: null, time: null },
      end: { date: null, time: null },
      inputTemp: null,
      isF: null,
      id: null,
    },
  ],
  heatingSchedule: {
    isReady: false,
    isActivated: false,
    disable: false,
  },
  windFactor: { isReady: false, isActivated: false },
  mobileSelectedProgram: {
    instantHeat: false,
    snowSensor: false,
    windFactor: false,
    optionalConstantTemp: false,
    ats: false,
    shutOff: false,
    heatingSchedule: false,
  },
};

/**
 * Base graph data structure
 */
export const baseGraphData = {
  heaterGraphData: [],
  enclosureGraphData: [],
  outsideGraphData: [],
  gasGraphData: [],
  snowGraphData: [],
  windGraphData: [],
  graphDateData: {
    heaterGraphData: [],
    enclosureGraphData: [],
    outsideGraphData: [],
    gasGraphData: [],
    snowGraphData: [],
    windGraphData: [],
    energyGasConsumptionGraphData: [],
    dataConsumptionGraphData: [],
    intervalUnit: "",
  },
};

/**
 * SSR initial state for ESS/TES machines
 */
export const ssrInitialState = {
  select: "tc-01",
  buttonStatus: "on",
  switchName: null,
  description: [null, null, null],
  index: 1,
  isSettingOpen: false,
  openPasswordBox: false,
};

/**
 * Create SSR state structure
 */
export const createSSRState = () => ({
  ssr1: { ...ssrInitialState, specs: [] },
  ssr2: { ...ssrInitialState, currentCurrent: 0, specs: [], buttonStatus: "flt" },
  ssr3: { ...ssrInitialState, specs: [] },
  ssr4: { ...ssrInitialState, specs: [], currentCurrent: [10.65] },
  ssr5: { ...ssrInitialState, specs: [] },
  ssr6: { ...ssrInitialState, specs: [] },
  ssr7: { ...ssrInitialState, specs: [], buttonStatus: "off" },
  ssr8: { ...ssrInitialState, specs: [] },
});

/**
 * Extract common machine data
 */
const extractCommonMachineData = (machine, isF, isMachineActive) => ({
  ...machine,
  deviceMac: machine.device_mac,
  deviceStatus: machine.device_status,
  isWifi: isMachineActive,
  thermocouple: machine.tc_mode === 1,
  heaterThermocoupleMap: machine.heater_thermocouple_map,
  activeThermocouples: machine.active_thermocouples,
  activatedHeaters: machine.activated_heaters,
  currentRun: machine.current_run,
  switch_panels: machine.switch_panels,
  freezeBy: machine.freeze_by,
  isEbp: (machine.EBP === 1 || machine.EBP === true) && isMachineActive,
  isGp: (machine.EBP === 0 || machine.EBP === false) && isMachineActive,
  EBP_mode: machine.EBP_mode,
});

/**
 * Extract temperature data with optional conversion
 */
const extractTempData = (value, isF, isMachineActive = true) => {
  if (!isMachineActive || !isNumber(value)) return null;
  return Math.floor(value);
};

/**
 * Extract data from ESS machine
 */
export const extractESSMachineData = (machine, isF) => {
  const isMachineActive = machine.device_active === 1;

  return {
    ...extractCommonMachineData(machine, isF, isMachineActive),
    usageHours: isNumber(machine.hours_of_usage)
      ? Math.floor(machine.hours_of_usage / 3600)
      : null,
    reading: isNumber(machine.energy_reading)
      ? Math.floor(machine.energy_reading)
      : null,
    hoursOfUsage: isNumber(machine.hours_of_usage)
      ? Math.floor(machine.hours_of_usage / 3600)
      : null,
    enclosureTemp: extractTempData(machine.enclosure_temp, isF, isMachineActive),
    outSideTemp: extractTempData(machine.outside_temp, isF, isMachineActive),
    consumption:
      isMachineActive && isNumber(machine.energy_consumption)
        ? Math.round(machine.energy_consumption * 10) / 10
        : null,
    setTemp: extractTempData(machine.threshold_temp, isF, isMachineActive),
    currentTemp: extractTempData(machine.display_temp, isF, isMachineActive),
    instantHeat: {
      ...baseProgramStates.instantHeat,
      inputTemp: isNumber(machine.instant_temp)
        ? isF
          ? convertCelsiusToFahrenheit(machine.instant_temp)
          : Math.floor(machine.instant_temp)
        : null,
      isReady: isMachineActive && machine.on_switch === 1,
      isActivated:
        isMachineActive &&
        machine.on_switch === 1 &&
        machine.op_mode === "SWITCH",
    },
    optionalConstantTemp: {
      ...baseProgramStates.optionalConstantTemp,
      inputTemp: isNumber(machine.constant_temp)
        ? isF
          ? convertCelsiusToFahrenheit(machine.constant_temp)
          : Math.floor(machine.constant_temp)
        : null,
      isReady: isMachineActive && machine.on_constant === 1,
      isActivated:
        isMachineActive &&
        machine.on_constant === 1 &&
        machine.op_mode === "CONSTANT",
    },
    snowSensor: {
      ...baseProgramStates.snowSensor,
      defaultTemp: isNumber(machine.electrical_snow_threshold)
        ? Math.floor(machine.electrical_snow_threshold)
        : null,
      isReady: isMachineActive && machine.snow_enabled === 1,
      isActivated:
        isMachineActive &&
        machine.snow_enabled === 1 &&
        machine.snow_trigger === 1,
    },
    windFactor: {
      ...baseProgramStates.windFactor,
      isReady: isMachineActive && machine.wind_enabled === 1,
      isActivated:
        isMachineActive &&
        machine.wind_enabled === 1 &&
        machine.wind_trigger === 1,
    },
    heatingSchedule: {
      ...machine.heatingSchedule,
      isActivated: machine.schedule_enabled === 1,
    },
    isDisabled: !isMachineActive || machine.op_mode === "FAULT",
    machineMode: machine.op_mode,
    isFaults:
      isMachineActive &&
      ((Array.isArray(machine?.ssr_fault) && machine?.ssr_fault?.includes(1)) ||
        (Array.isArray(machine?.srr_over_current) &&
          machine.srr_over_current?.includes(1)) ||
        machine?.ground_fault === 1 ||
        (Array.isArray(machine?.thermocouple_fault) &&
          machine?.thermocouple_fault?.includes(1))),
    ssrFault: (isMachineActive && machine.ssr_fault) || [],
    srrOverCurrent: (isMachineActive && machine.srr_over_current) || [],
    groundFault: (isMachineActive && machine.ground_fault) || 0,
    thermocoupleFault: (isMachineActive && machine.thermocouple_fault) || [],
    ...(!isMachineActive && {
      heatingSchedule: {
        ...machine.heatingSchedule,
        isReady: false,
        isActivated: false,
      },
      heaterGraphData: [],
      enclosureGraphData: [],
      outsideGraphData: [],
      gasGraphData: [],
      snowGraphData: [],
      windGraphData: [],
    }),
  };
};

/**
 * Extract data from TES machine
 */
export const extractTESMachineData = (machine, isF) => {
  const isMachineActive = machine.device_active === 1;

  return {
    ...extractCommonMachineData(machine, isF, isMachineActive),
    usageHours: isNumber(machine.e_hours_of_usage)
      ? Math.floor(machine.e_hours_of_usage / 3600)
      : null,
    reading: isNumber(machine.e_energy_reading)
      ? Math.floor(machine.e_energy_reading)
      : null,
    hoursOfUsage: isNumber(machine.e_hours_of_usage)
      ? Math.floor(machine.e_hours_of_usage / 3600)
      : null,
    enclosureTemp: extractTempData(machine.e_enclosure_temp, isF, isMachineActive),
    outSideTemp: extractTempData(machine.e_outside_temp, isF, isMachineActive),
    consumption:
      isMachineActive && isNumber(machine.e_energy_consumption)
        ? Math.round(machine.e_energy_consumption * 10) / 10
        : null,
    setTemp: extractTempData(machine.e_threshold_temp, isF, isMachineActive),
    currentTemp: extractTempData(machine.e_display_temp, isF, isMachineActive),
    instantHeat: {
      ...baseProgramStates.instantHeat,
      inputTemp: isNumber(machine.e_instant_temp)
        ? isF
          ? convertCelsiusToFahrenheit(machine.e_instant_temp)
          : Math.floor(machine.e_instant_temp)
        : null,
      isReady: isMachineActive && machine.e_on_switch === 1,
      isActivated:
        isMachineActive &&
        machine.e_on_switch === 1 &&
        machine.e_op_mode === "SWITCH",
    },
    optionalConstantTemp: {
      ...baseProgramStates.optionalConstantTemp,
      inputTemp: isNumber(machine.e_constant_temp)
        ? isF
          ? convertCelsiusToFahrenheit(machine.e_constant_temp)
          : Math.floor(machine.e_constant_temp)
        : null,
      isReady: isMachineActive && machine.e_on_constant === 1,
      isActivated:
        isMachineActive &&
        machine.e_on_constant === 1 &&
        machine.e_op_mode === "CONSTANT",
    },
    snowSensor: {
      ...baseProgramStates.snowSensor,
      defaultTemp: isNumber(machine.electrical_snow_threshold)
        ? Math.floor(machine.electrical_snow_threshold)
        : null,
      isReady: isMachineActive && machine.e_snow_enabled === 1,
      isActivated:
        isMachineActive &&
        machine.e_snow_enabled === 1 &&
        machine.e_snow_trigger === 1,
    },
    windFactor: {
      ...baseProgramStates.windFactor,
      isReady: isMachineActive && machine.e_wind_enabled === 1,
      isActivated:
        isMachineActive &&
        machine.e_wind_enabled === 1 &&
        machine.e_wind_trigger === 1,
    },
    heatingSchedule: {
      ...machine.heatingSchedule,
      isActivated: machine.e_schedule_enabled === 1,
    },
    isDisabled: !isMachineActive || machine.e_op_mode === "FAULT",
    machineMode: machine.e_op_mode,
    isFaults:
      isMachineActive &&
      ((Array.isArray(machine?.e_ssr_fault) &&
        machine?.e_ssr_fault?.includes(1)) ||
        (Array.isArray(machine?.e_srr_over_current) &&
          machine.e_srr_over_current?.includes(1)) ||
        machine?.e_ground_fault === 1 ||
        (Array.isArray(machine?.e_thermocouple_fault) &&
          machine?.e_thermocouple_fault?.includes(1))),
    ssrFault: (isMachineActive && machine.e_ssr_fault) || [],
    srrOverCurrent: (isMachineActive && machine.e_srr_over_current) || [],
    groundFault: (isMachineActive && machine.e_ground_fault) || 0,
    thermocoupleFault: (isMachineActive && machine.e_thermocouple_fault) || [],
    isTGSActive: machine.TGS_enabled,
    ...(!isMachineActive && {
      heatingSchedule: {
        ...machine.heatingSchedule,
        isReady: false,
        isActivated: false,
      },
      heaterGraphData: [],
      enclosureGraphData: [],
      outsideGraphData: [],
      gasGraphData: [],
      snowGraphData: [],
      windGraphData: [],
    }),
  };
};

/**
 * Extract data from TGS machine
 */
export const extractTGSMachineData = (machine, isF) => {
  const isMachineActive = machine.device_active === 1;

  return {
    ...extractCommonMachineData(machine, isF, isMachineActive),
    usageHours: isNumber(machine.hours_of_usage)
      ? Math.floor(machine.hours_of_usage / 3600)
      : null,
    reading: isNumber(machine.gas_reading) ? Math.floor(machine.gas_reading) : null,
    hoursOfUsage: isNumber(machine.hours_of_usage)
      ? Math.floor(machine.hours_of_usage / 3600)
      : null,
    enclosureTemp: extractTempData(machine.enclosure_temp, isF, isMachineActive),
    outSideTemp: extractTempData(machine.outside_temp, isF, isMachineActive),
    consumption:
      isMachineActive && isNumber(machine.gas_consumption)
        ? Math.round(machine.gas_consumption * 10) / 10
        : null,
    setTemp: extractTempData(machine.threshold_temp, isF, isMachineActive),
    currentTemp: extractTempData(machine.display_temp, isF, isMachineActive),
    instantHeat: {
      ...baseProgramStates.instantHeat,
      inputTemp: isNumber(machine.instant_temp)
        ? isF
          ? convertCelsiusToFahrenheit(machine.instant_temp)
          : Math.floor(machine.instant_temp)
        : null,
      isReady: isMachineActive && machine.on_switch === 1,
      isActivated:
        isMachineActive &&
        machine.on_switch === 1 &&
        machine.op_mode === "SWITCH",
    },
    fanOnly: machine.fan === 1,
    snowSensor: {
      ...baseProgramStates.snowSensor,
      defaultTemp: isNumber(machine.blower_snow_threshold)
        ? Math.floor(machine.blower_snow_threshold)
        : null,
      isReady: isMachineActive && machine.snow_enabled === 1,
      isActivated:
        isMachineActive &&
        machine.snow_enabled === 1 &&
        machine.snow_trigger === 1,
    },
    windFactor: {
      ...baseProgramStates.windFactor,
      isReady: isMachineActive && machine.wind_enabled === 1,
      isActivated:
        isMachineActive &&
        machine.wind_enabled === 1 &&
        machine.wind_trigger === 1,
    },
    heatingSchedule: {
      ...machine.heatingSchedule,
      isActivated: machine.schedule_enabled === 1,
    },
    isDisabled: !isMachineActive || machine.op_mode === "FAULT",
    isFanDisabled: !isMachineActive,
    machineMode: machine.op_mode,
    isFaults:
      isMachineActive &&
      (machine?.bms_fault === 1 ||
        machine?.hplp_fault === 1 ||
        machine?.timeout_fault === 1 ||
        machine?.thermocouple_fault === 1),
    bmsFault: (isMachineActive && machine.bms_fault) || 0,
    hplpFault: (isMachineActive && machine.hplp_fault) || 0,
    timeoutFault: (isMachineActive && machine.timeout_fault) || 0,
    thermocoupleFault: (isMachineActive && machine.thermocouple_fault) || 0,
    isTESActive: machine.TES_enabled,
    ...(!isMachineActive && {
      heatingSchedule: {
        ...machine.heatingSchedule,
        isReady: false,
        isActivated: false,
      },
      heaterGraphData: [],
      enclosureGraphData: [],
      outsideGraphData: [],
      gasGraphData: [],
      snowGraphData: [],
      windGraphData: [],
    }),
  };
};
