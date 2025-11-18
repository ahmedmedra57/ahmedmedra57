import { reduce } from "lodash";

/**
 * Create SSR-specific reducers for ESS/TES machines
 */
export const createSSRReducers = (sliceKey) => {
  const flatKey = `flat${
    sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
  }Switch`;

  return {
    [`${sliceKey}HandleSelector`]: (state, action) => {
      const { location, specificLocation, machine, id, data } = action.payload;
      const machineState = specificLocation
        ? state[flatKey][location]?.[specificLocation]?.[machine]
        : state[flatKey][location]?.[machine];

      if (machineState?.ssrState?.[id]) {
        machineState.ssrState[id].select = data;
      }
    },

    [`${sliceKey}HandleToggleSSR`]: (state, action) => {
      const { location, specificLocation, machine, id, buttonStatus } =
        action.payload;
      const machineState = specificLocation
        ? state[flatKey][location]?.[specificLocation]?.[machine]
        : state[flatKey][location]?.[machine];

      if (machineState?.ssrState?.[id]) {
        machineState.ssrState[id].buttonStatus = buttonStatus;
      }
    },

    [`${sliceKey}HandleExpandSSRDetail`]: (state, action) => {
      const { location, specificLocation, machine, status } = action.payload;
      const machineState = specificLocation
        ? state[flatKey][location]?.[specificLocation]?.[machine]
        : state[flatKey][location]?.[machine];

      if (machineState) {
        machineState.isExpanded = status;
      }
    },

    [`${sliceKey}HandleChangeSSRDetail`]: (state, action) => {
      const { location, specificLocation, machine, id, data } = action.payload;
      const machineState = specificLocation
        ? state[flatKey][location]?.[specificLocation]?.[machine]
        : state[flatKey][location]?.[machine];

      if (machineState?.ssrState?.[id]) {
        machineState.ssrState[id].specs = data;
      }
    },

    [`${sliceKey}HandleOpenSetting`]: (state, action) => {
      const { location, specificLocation, machine, id, status } = action.payload;
      const machineState = specificLocation
        ? state[flatKey][location]?.[specificLocation]?.[machine]
        : state[flatKey][location]?.[machine];

      if (machineState?.ssrState?.[id]) {
        machineState.ssrState[id].isSettingOpen = status;
      }
    },

    [`${sliceKey}HandleOpenPasswordBox`]: (state, action) => {
      const { location, specificLocation, machine, id, status } = action.payload;
      const machineState = specificLocation
        ? state[flatKey][location]?.[specificLocation]?.[machine]
        : state[flatKey][location]?.[machine];

      if (machineState?.ssrState?.[id]) {
        machineState.ssrState[id].openPasswordBox = status;
      }
    },

    [`handle${
      sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
    }SSRState`]: (state, action) => {
      const { location, machine, data } = action.payload;
      const machineState = state[flatKey][location]?.[machine];

      if (machineState) {
        machineState.ssrState = Object.fromEntries(
          Object.entries(
            reduce(
              data,
              (result, ssr) => {
                return {
                  ...result,
                  [`ssr${ssr.No + 1}`]: {
                    ...machineState.ssrState[`ssr${ssr.No + 1}`],
                    ...ssr,
                  },
                };
              },
              {}
            )
          ).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        );
      }
    },

    [`handle${
      sliceKey.charAt(0).toUpperCase() + sliceKey.slice(1)
    }SSRStateSocket`]: (state, action) => {
      const data = action.payload;
      const location = data.zoneInfo.zone_id;
      const machine = data.device_mac || data.device_id;

      if (!state[flatKey][location]) {
        state[flatKey][location] = {};
      }

      if (!state[flatKey][location][machine]) {
        state[flatKey][location][machine] = {};
      }

      if (!state[flatKey][location][machine].ssrState) {
        state[flatKey][location][machine].ssrState = {};
      }

      if (data.hasOwnProperty("specs")) {
        const ssrKey = `ssr${data.No + 1}`;
        const heaterMap = state[flatKey][location][machine].heaterThermocoupleMap;

        state[flatKey][location][machine].ssrState[ssrKey] = {
          ...state[flatKey][location][machine].ssrState[ssrKey],
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

        if (!state[flatKey][location][machine].ssrFault) {
          state[flatKey][location][machine].ssrFault = [];
        }
        state[flatKey][location][machine].ssrFault[data.No] = data.fault ? 1 : 0;
      } else {
        data.heater_thermocouple_map?.forEach((el, index) => {
          const ssrKey = `ssr${index + 1}`;
          if (!state[flatKey][location][machine].ssrState[ssrKey]) {
            state[flatKey][location][machine].ssrState[ssrKey] = {};
          }
          state[flatKey][location][machine].ssrState[ssrKey] = {
            ...state[flatKey][location][machine].ssrState[ssrKey],
            select: `tc-${el}`,
          };
        });
      }
    },
  };
};
