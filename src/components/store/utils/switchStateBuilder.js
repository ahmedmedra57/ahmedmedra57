import { reduce } from "lodash";

/**
 * Build switch state from zones data
 * This creates both nested and flat structures
 */
export const buildSwitchState = (zones, initialState, extractDataFn, isF) => {
  const nestedSwitch = reduce(
    zones,
    (result, location) => {
      if (location.specific_location) {
        return {
          ...result,
          [location.zone_id]: {
            isSpecificLocation: true,
            subLocations: location.specific_location.reduce(
              (subResult, specificLocation) => {
                subResult[specificLocation.zone_id] = {
                  devices: reduce(
                    specificLocation.devices,
                    (deviceResult, machine) => {
                      return {
                        ...deviceResult,
                        [machine.device_mac]: {
                          ...initialState,
                          address: {
                            lat: location.latitude,
                            lng: location.longitude,
                          },
                          machineName: machine.device_name,
                          locationId: location.zone_id,
                          locationName: location.zone_name,
                          locationAddress: location.zone_address || "",
                          specificLocationName:
                            specificLocation.specific_address || "",
                          isOff: machine.freeze,
                          ...extractDataFn(machine, isF),
                        },
                      };
                    },
                    {}
                  ),
                };
                return subResult;
              },
              {}
            ),
          },
        };
      }
      return {
        ...result,
        [location.zone_id]: {
          isSpecificLocation: false,
          devices: reduce(
            location.devices,
            (deviceResult, machine) => {
              return {
                ...deviceResult,
                [machine.device_mac]: {
                  ...initialState,
                  address: {
                    lat: location.latitude,
                    lng: location.longitude,
                  },
                  machineName: machine.device_name,
                  locationId: location.zone_id,
                  locationName: location.zone_name,
                  locationAddress: location.zone_address || "",
                  specificLocationName: location.specific_address || "",
                  isOff: machine.freeze,
                  ...extractDataFn(machine, isF),
                },
              };
            },
            {}
          ),
        },
      };
    },
    {}
  );

  const flatSwitch = reduce(
    zones,
    (result, value) => {
      if (value.specific_location) {
        return {
          ...result,
          ...reduce(
            value.specific_location,
            (subResult, location) => ({
              ...subResult,
              [location.zone_id]: reduce(
                location.devices,
                (deviceResult, machine) => ({
                  ...deviceResult,
                  [machine.device_mac]: {
                    ...initialState,
                    address: {
                      lat: location.latitude,
                      lng: location.longitude,
                    },
                    machineName: machine.device_name,
                    deviceStatus: machine.device_status,
                    parentLocationId: value.zone_id,
                    locationId: location.zone_id,
                    locationName: location.zone_name,
                    locationAddress: location.zone_address || "",
                    specificLocationName: location.specific_address || "",
                    isOff: machine.freeze,
                    ...extractDataFn(machine, isF),
                  },
                }),
                {}
              ),
            }),
            {}
          ),
        };
      }
      return {
        ...result,
        [value.zone_id]: reduce(
          value.devices,
          (deviceResult, machine) => ({
            ...deviceResult,
            [machine.device_mac]: {
              ...initialState,
              address: {
                lat: value.latitude,
                lng: value.longitude,
              },
              machineName: machine.device_name,
              deviceStatus: machine.device_status,
              locationId: value.zone_id,
              locationName: value.zone_name,
              locationAddress: value.zone_address || "",
              specificLocationName: value.specific_address || "",
              isOff: machine.freeze,
              ...extractDataFn(machine, isF),
            },
          }),
          {}
        ),
      };
    },
    {}
  );

  return { nestedSwitch, flatSwitch };
};

/**
 * Create switch initialization reducer
 */
export const createSwitchInitReducer = (
  switchKey,
  zonesKey,
  extractDataFn,
  legacyKeys = []
) => {
  return (state, action) => {
    // Delete legacy location keys
    legacyKeys.forEach((key) => {
      delete state[key];
    });

    const isF = action.payload.isF;
    const zones = action.payload[zonesKey];
    const initialState = action.payload.initialState || {};

    const { nestedSwitch, flatSwitch } = buildSwitchState(
      zones,
      initialState,
      extractDataFn,
      isF
    );

    state[switchKey] = nestedSwitch;
    state[`flat${switchKey.charAt(0).toUpperCase() + switchKey.slice(1)}`] =
      flatSwitch;
  };
};

/**
 * Create socket update reducer
 */
export const createSocketUpdateReducer = (flatSwitchKey, extractDataFn) => {
  return (state, action) => {
    const data = action.payload.data;
    const location = data.zoneInfo.zone_id;
    const machine = data.device_mac;
    const isF = action.payload.isF;

    if (!state[flatSwitchKey][location]) {
      state[flatSwitchKey][location] = {};
    }

    if (!state[flatSwitchKey][location][machine]) {
      state[flatSwitchKey][location][machine] = {};
    }

    state[flatSwitchKey][location][machine] = {
      ...state[flatSwitchKey][location][machine],
      ...extractDataFn(data, isF),
    };
  };
};
