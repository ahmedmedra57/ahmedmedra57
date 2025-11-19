# 📊 Data Flow Analysis

**Date:** November 19, 2025
**Branch:** `claude/understand-codebase-01RuxLo6DzpRHGY5WyEN7oTM`
**Purpose:** Comprehensive analysis of how data flows through the UMB-360 heating control application

---

## 🎯 **Overview**

This React application manages heating systems (Electric, Thermal, Gas) across multiple locations with real-time control and monitoring. Data flows through **4 primary layers**:

1. **API Layer** - REST API calls via Axios
2. **WebSocket Layer** - Real-time updates via Socket.io
3. **Redux State Layer** - Centralized state management (40 slices)
4. **Component Layer** - UI rendering and user interactions

---

## 📐 **High-Level Data Flow Architecture**

```
┌──────────────────────────────────────────────────────────────────┐
│                     USER INTERFACE LAYER                          │
│                                                                   │
│  React Components                                                 │
│  ├─ Display current state                                         │
│  ├─ Handle user interactions                                      │
│  └─ Subscribe to Redux state changes                              │
│                                                                   │
│  Custom Hooks                                                     │
│  ├─ useSocket() - WebSocket connection                            │
│  ├─ useSelectSwitchesDispatches() - Device selection              │
│  └─ useGetGraphQueries() - Data fetching                          │
│                                                                   │
└───────────────────────┬───────────────────────────────────────────┘
                        │
                        │ dispatch(action) / useSelector(state)
                        │
┌───────────────────────▼───────────────────────────────────────────┐
│                    REDUX STATE LAYER                              │
│                                                                   │
│  Redux Store (redux-persist)                                     │
│  ├─ Device State (essSwitch, tesSwitch, tgsSwitch)               │
│  ├─ Location Management (locations)                              │
│  ├─ User & Auth (userInfo, permissions)                          │
│  ├─ Settings (units, windFactor, snowSensor)                     │
│  ├─ Data Consumption (essDataConsumption, etc.)                  │
│  └─ UI State (messageBoxes, selectedMachines)                    │
│                                                                   │
│  40 Total Slices                                                 │
│                                                                   │
└───────┬───────────────────────────────┬──────────────────────────┘
        │                               │
        │                               │
┌───────▼────────────┐       ┌──────────▼────────────┐
│   API LAYER        │       │  WEBSOCKET LAYER      │
│   (Axios HTTP)     │       │  (Socket.io)          │
│                    │       │                       │
│  Services:         │       │  Real-time Events:    │
│  ├─ auth           │       │  ├─ switchAudit       │
│  ├─ sendCommand    │       │  ├─ blowerAudit       │
│  ├─ masterControl  │       │  ├─ ssrUpdate         │
│  ├─ zones          │       │  ├─ scheduleList      │
│  ├─ telemetry      │       │  ├─ thermocoupleUpdate│
│  ├─ graphs         │       │  └─ graph events (9)  │
│  └─ 10+ more       │       │                       │
│                    │       │  Server:              │
│  Interceptors:     │       │  api.dev.umb-360.com  │
│  ├─ Add JWT token  │       │                       │
│  └─ Handle 401     │       │  Room-based filtering │
│                    │       │  by zone_id           │
└────────┬───────────┘       └──────────┬────────────┘
         │                              │
         └──────────┬───────────────────┘
                    │
┌───────────────────▼──────────────────────────────────────────────┐
│                    BACKEND SERVICES                               │
│                                                                   │
│  REST API Server                                                 │
│  ├─ Authentication & Authorization                                │
│  ├─ Device Control Commands                                       │
│  ├─ Data Persistence                                              │
│  └─ Business Logic                                                │
│                                                                   │
│  WebSocket Server (Socket.io)                                    │
│  ├─ Real-time event broadcasting                                  │
│  ├─ Room management (by zone_id)                                  │
│  └─ Device state updates                                          │
│                                                                   │
│  Database                                                         │
│  ├─ Users & Permissions                                           │
│  ├─ Locations & Devices                                           │
│  ├─ Historical Data                                               │
│  └─ Configuration                                                 │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Core Data Flow Patterns**

### **Pattern 1: User Command → API → Real-time Update**

**Use Case:** User sets temperature for a heating device

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: User Interaction                                        │
└─────────────────────────────────────────────────────────────────┘

Component: InstantHeatControl.js
User clicks "Set Temperature" button with value: 25°C
    ↓
Handler: handleTempChange(location, machine, temp)
    ↓
Dispatch Redux Action:
dispatch(handleInstantHeatReady({
  location: "bet-east",
  machine: "AA:BB:CC:DD:EE:FF",
  temp: 25,
  isF: false
}))

┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Redux State Update (Optimistic)                        │
└─────────────────────────────────────────────────────────────────┘

File: src/components/store/slices/essSwitchSlice.js (line 252)

Reducer: handleInstantHeatReady
    ↓
State Update:
state.flatEssSwitch[location][machine] = {
  ...state.flatEssSwitch[location][machine],
  instantHeat: {
    inputTemp: 25,
    isF: false,
    isReady: true,      // UI shows "Ready to apply"
    isActivated: false
  }
}
    ↓
Component re-renders with new state
Button changes to "Apply" state

┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: API Call                                               │
└─────────────────────────────────────────────────────────────────┘

File: src/services/sendCommand.service.js (line 3)

User clicks "Apply"
    ↓
Call: postEssCommand(deviceMac, "instantHeat", 25)
    ↓
HTTP Request:
POST https://api.dev.umb-360.com/switches/send-command
Headers: {
  Authorization: "Bearer <jwt_token>"
}
Body: {
  "mac": "AA:BB:CC:DD:EE:FF",
  "instantHeat": 25
}
    ↓
Response: { status: "success", data: { ... } }

┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Server Processing                                      │
└─────────────────────────────────────────────────────────────────┘

Backend:
1. Validates user permissions
2. Sends command to physical device
3. Updates database
4. Broadcasts event via Socket.io to all connected clients in room

┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Real-time Update via WebSocket                         │
└─────────────────────────────────────────────────────────────────┘

File: src/hooks/useSocket.js (line 55)

Socket.io Event Received:
Event: 'switchAudit'
Data: {
  device_mac: "AA:BB:CC:DD:EE:FF",
  zoneInfo: { zone_id: "bet-east" },
  eventDeviceType: "ESS",
  instantHeat: 25,
  currentTemp: 22,
  setTemp: 25,
  deviceStatus: "ACTIVE"
}
    ↓
Handler: newSocket.on('switchAudit', (data) => {
  dispatch(handleEssSwitchSocket({ data, isF }));
  dispatch(handleEssSSRStateSocket(data));
})

┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: Redux State Update (Confirmed)                         │
└─────────────────────────────────────────────────────────────────┘

Reducer: handleEssSwitchSocket
    ↓
State Update:
state.flatEssSwitch[location][machine] = {
  ...state.flatEssSwitch[location][machine],
  instantHeat: {
    inputTemp: 25,
    isF: false,
    isReady: false,
    isActivated: true    // Confirmed active
  },
  currentTemp: 22,
  setTemp: 25,
  deviceStatus: "ACTIVE"
}
    ↓
Component re-renders
UI shows "Activated" state with current temperature

┌─────────────────────────────────────────────────────────────────┐
│ RESULT: All clients receive update                             │
└─────────────────────────────────────────────────────────────────┘

All users viewing this device see:
✓ Temperature set to 25°C
✓ Instant heat activated
✓ Real-time current temperature updates
```

**Key Points:**
- **Optimistic Update**: Redux state updates immediately for better UX
- **API Confirmation**: Server validates and persists the change
- **Real-time Sync**: All connected clients receive the update via WebSocket
- **Bidirectional Flow**: Changes propagate to all users viewing the same device

---

### **Pattern 2: Initial App Load & State Hydration**

**Use Case:** User opens the application

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Application Bootstrap                                  │
└─────────────────────────────────────────────────────────────────┘

index.js → App.js renders
    ↓
Redux Persist Rehydrates State from localStorage
    ↓
Check for access_token in localStorage

IF token exists:
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Fetch User Profile                                     │
└─────────────────────────────────────────────────────────────────┘

File: src/services/userProfile.service.js (line 13)

Dispatch: dispatch(getUserProfileDataService())
    ↓
API Call (AsyncThunk):
GET https://api.dev.umb-360.com/me
Headers: { Authorization: "Bearer <token>" }
    ↓
Response: {
  user_id: "USER_001",
  firstname: "John",
  lastname: "Doe",
  email: "john@example.com",
  user_role: "ADMINISTRATOR",
  temperature_unit: "c",
  permissions: {
    ESS_CONTROL: true,
    TES_CONTROL: true,
    TGS_CONTROL: true,
    SETTINGS_ACCESS: true,
    ADMIN_ACCESS: true
  }
}
    ↓
Redux extraReducers:
state.userInfo = {
  ...response,
  isAuthenticated: true,
  accessToken: localStorage.getItem('access_token')
}

┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Fetch Locations & Devices                              │
└─────────────────────────────────────────────────────────────────┘

File: src/services/zones.service.js

Parallel API Calls:
1. getEssZones() → GET /get-zones/switches
2. getTgsZones() → GET /get-zones/blowers?deviceType=TGS
3. getTesZones() → GET /get-zones/blowers?deviceType=TES

Response (ESS Example):
{
  "bet-east": {
    zone_id: "bet-east",
    zone_name: "Boston East",
    zone_address: "123 Main St",
    latitude: 42.36997,
    longitude: -71.070647,
    devices: [
      {
        device_mac: "AA:BB:CC:DD:EE:FF",
        device_name: "ESS Unit 1",
        currentTemp: 22,
        setTemp: 25,
        deviceStatus: "ACTIVE",
        instantHeat: { isActivated: true, inputTemp: 25 },
        ssrState: { ssr1: {...}, ssr2: {...}, ... },
        ...
      },
      ...
    ],
    site_maps_ESS: ["https://s3.../map.jpg"],
    weather: [
      { dt_txt: "2025-11-19 12:00", temp_min: -5, temp_max: 2 }
    ]
  },
  "bet-west": { ... }
}

┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Redux State Hydration                                  │
└─────────────────────────────────────────────────────────────────┘

File: src/components/store/slices/locationsSlice.js (line 18)

Dispatch: dispatch(handleEssLocation(essZonesResponse))
    ↓
Reducer transforms flat API response into nested structure:

state.locations = {
  ess: {
    "bet-east": {
      zone_id: "bet-east",
      locationName: "Boston East",
      address: { lat: 42.36997, lng: -71.070647 },
      devices: {
        "AA:BB:CC:DD:EE:FF": {
          machineName: "ESS Unit 1",
          machineMac: "AA:BB:CC:DD:EE:FF",
          locationId: "bet-east"
        }
      },
      weather: [...],
      site_maps_ESS: [...]
    }
  },
  tgs: { ... },
  tes: { ... },
  all: { /* Combined */ },
  specific: { /* Sub-locations */ }
}

SIMULTANEOUSLY:
Dispatch: dispatch(handleSysEssLocation(essZonesResponse))
    ↓
File: src/components/store/slices/essSwitchSlice.js

State structure created:
state.essSwitch = {
  flatEssSwitch: {
    "bet-east": {
      "AA:BB:CC:DD:EE:FF": {
        machineType: "ess",
        deviceMac: "AA:BB:CC:DD:EE:FF",
        deviceStatus: "ACTIVE",
        currentTemp: 22,
        setTemp: 25,
        instantHeat: { inputTemp: 25, isActivated: true, ... },
        snowSensor: { isActivated: false, ... },
        windFactor: { isActivated: false },
        heatingScheduleList: [],
        ssrState: {
          ssr1: { select: "tc-01", buttonStatus: "on", ... },
          ssr2: { ... },
          ...
          ssr8: { ... }
        },
        heaterGraphData: [],
        enclosureGraphData: [],
        outsideGraphData: [],
        ...
      }
    }
  }
}

┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Establish WebSocket Connection                         │
└─────────────────────────────────────────────────────────────────┘

File: src/hooks/useSocket.js (line 43)

useSocket(room, accessToken) hook initializes
    ↓
const newSocket = io('https://api.dev.umb-360.com', {
  query: { room: user.user_id }  // Room filtering
});
    ↓
Connection established
    ↓
Listeners registered for:
- switchAudit (ESS updates)
- blowerAudit (TGS/TES updates)
- ssrUpdate (Heater state changes)
- scheduleList (Schedule updates)
- thermocoupleUpdate (Fault data)
- 9 graph events (heater_graph, enclosure_graph, etc.)

┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: Component Rendering                                    │
└─────────────────────────────────────────────────────────────────┘

Components use useSelector() to read state:

const locations = useSelector(selectLocations);
const essSwitch = useSelector(state => state.essSwitch);
const userInfo = useSelector(state => state.userInfo);
const { isF } = useSelector(selectUnits);

    ↓
Components render:
- Location cards with device lists
- Real-time temperature displays
- Control panels (only if user has permissions)
- Graphs with historical data
- Status indicators

┌─────────────────────────────────────────────────────────────────┐
│ RESULT: Fully Hydrated Application                             │
└─────────────────────────────────────────────────────────────────┘

✓ User authenticated with permissions
✓ All locations and devices loaded
✓ Redux state fully populated
✓ WebSocket connected for real-time updates
✓ UI rendered with current data
✓ Ready for user interactions
```

**Key Points:**
- **AsyncThunk Pattern**: User profile uses createAsyncThunk for async operations
- **Parallel Loading**: Multiple API calls happen simultaneously
- **State Normalization**: Flat API responses transformed into nested Redux structure
- **Redux Persist**: State saved to localStorage, rehydrated on reload
- **Permission-Based Rendering**: UI adapts based on user role and permissions

---

### **Pattern 3: Master Control (Batch Operations)**

**Use Case:** User wants to apply same setting to multiple devices

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Device Selection Phase                                 │
└─────────────────────────────────────────────────────────────────┘

Component: MasterControl.js
User opens location dropdown
    ↓
Displays all locations from state.locations.ess
    ↓
User selects "Boston East" location
    ↓
Hook: useSelectSwitchesDispatches()
File: src/hooks/useSelectSwitchesDispatches.js

Handler: selectLocationsHandler(location, 'ess', true)
    ↓
Loops through all machines in location:
machines.forEach((machine) => {
  dispatch(handleSelectIndividualMachine({
    location: "bet-east",
    machine: "AA:BB:CC:DD:EE:FF"
  }))
})
    ↓
Redux Update (for each machine):
state.essSwitch.flatEssSwitch[location][machine].isSelected = true

SIMULTANEOUSLY:
dispatch(handleSelectLocationMasterControl({
  location: "bet-east",
  deviceType: "ess",
  machines: ["AA:BB:CC:DD:EE:FF", "BB:CC:DD:EE:FF:00", ...]
}))
    ↓
state.masterControlSelect = {
  ess: {
    "bet-east": {
      isSelected: true,
      machines: ["AA:BB:CC:DD:EE:FF", "BB:CC:DD:EE:FF:00", ...]
    }
  }
}

┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Configure Setting                                      │
└─────────────────────────────────────────────────────────────────┘

User configures setting (e.g., Instant Heat: 30°C)
    ↓
Component state holds pending configuration:
masterControlData = {
  instantHeat: 30,
  isF: false
}

UI shows:
✓ 5 devices selected
✓ Instant Heat: 30°C
✓ "Apply to All" button enabled

┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Apply Master Control                                   │
└─────────────────────────────────────────────────────────────────┘

User clicks "Apply to All"
    ↓
Gather selected devices:
const selectedDevices = useSelector(state => {
  const devices = [];
  Object.keys(state.essSwitch.flatEssSwitch).forEach(location => {
    Object.keys(state.essSwitch.flatEssSwitch[location]).forEach(machine => {
      if (state.essSwitch.flatEssSwitch[location][machine].isSelected) {
        devices.push(machine); // device MAC
      }
    });
  });
  return devices;
});

Result: ["AA:BB:CC:DD:EE:FF", "BB:CC:DD:EE:FF:00", "CC:DD:EE:FF:00:11", ...]
    ↓
File: src/services/masterControl.service.js

API Call:
updateSwitchesMasterControlService(
  selectedDevices,
  'ESS',
  { instantHeat: 30 }
)
    ↓
HTTP Request:
POST https://api.dev.umb-360.com/switches/master-control
Headers: { Authorization: "Bearer <token>" }
Body: {
  "deviceIds": [
    "AA:BB:CC:DD:EE:FF",
    "BB:CC:DD:EE:FF:00",
    "CC:DD:EE:FF:00:11"
  ],
  "deviceType": "ESS",
  "instantHeat": 30
}

┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Backend Batch Processing                               │
└─────────────────────────────────────────────────────────────────┘

Backend receives request:
    ↓
FOR EACH device in deviceIds:
  1. Validate user has control permission for device
  2. Send command to physical device
  3. Update database
  4. Broadcast Socket.io event

Broadcasts 3 'switchAudit' events (one per device):
Event: 'switchAudit'
Data: {
  device_mac: "AA:BB:CC:DD:EE:FF",
  zoneInfo: { zone_id: "bet-east" },
  eventDeviceType: "ESS",
  instantHeat: 30,
  ...
}

┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Real-time Updates (Per Device)                         │
└─────────────────────────────────────────────────────────────────┘

File: src/hooks/useSocket.js

FOR EACH 'switchAudit' event received:
    ↓
dispatch(handleEssSwitchSocket({ data, isF }))
    ↓
Redux updates each device individually:
state.essSwitch.flatEssSwitch["bet-east"]["AA:BB:CC:DD:EE:FF"].instantHeat = {
  inputTemp: 30,
  isActivated: true,
  isReady: false,
  isF: false
}

(Repeated for BB:CC:DD:EE:FF:00, CC:DD:EE:FF:00:11)

┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: UI Update & Deselection                                │
└─────────────────────────────────────────────────────────────────┘

All selected devices now show:
✓ Instant Heat: 30°C (Activated)
    ↓
Optionally dispatch deselection:
dispatch(handleUnselectAllMachines('ess'))
    ↓
state.essSwitch.flatEssSwitch[location][machine].isSelected = false
(for all machines)
    ↓
UI returns to normal state

┌─────────────────────────────────────────────────────────────────┐
│ RESULT: Batch Operation Complete                               │
└─────────────────────────────────────────────────────────────────┘

✓ 3 devices updated with single API call
✓ All users see real-time updates
✓ Audit trail created for each device
✓ UI reflects new state
```

**Key Points:**
- **Selection State**: Separate slice tracks selected devices
- **Batch API**: Single API call handles multiple devices
- **Individual Events**: Server broadcasts separate event per device
- **Scalable Pattern**: Works for 1 device or 100 devices
- **Audit Trail**: Each device gets individual audit entry

---

## 🗄️ **Redux State Structure Deep Dive**

### **State Tree Overview**

```javascript
{
  // === DEVICE STATE (Main Controllers) ===
  essSwitch: {
    flatEssSwitch: {
      [locationId]: {
        [deviceMac]: {
          // Device Identity
          machineType: "ess",
          deviceMac: "AA:BB:CC:DD:EE:FF",
          deviceStatus: "ACTIVE" | "OFFLINE" | "ERROR",
          isSelected: boolean,

          // Temperature Monitoring
          currentTemp: 22,        // °C or °F
          setTemp: 25,
          enclosureTemp: 20,
          outSideTemp: -5,

          // Control Features
          instantHeat: {
            inputTemp: 25,
            isActivated: true,
            isReady: false,
            isF: false
          },

          snowSensor: {
            isActivated: false,
            defaultTemp: 350,
            isReady: false,
            isF: false
          },

          windFactor: {
            isActivated: false,
            isReady: false
          },

          optionalConstantTemp: {
            inputTemp: 0,
            isActivated: false,
            isReady: false,
            apply: false,
            isF: false
          },

          heatingScheduleList: [
            {
              start: { date: "2025-11-19", time: "08:00" },
              end: { date: "2025-11-19", time: "16:00" },
              inputTemp: 25,
              isF: false,
              id: "SCHED_001"
            }
          ],

          heatingSchedule: {
            isActivated: false,
            isReady: false,
            disable: false
          },

          // SSR (Solid State Relay) State
          ssrState: {
            ssr1: {
              select: "tc-01",            // Thermocouple selection
              buttonStatus: "on" | "off" | "flt",
              switchName: null,
              currentCurrent: 15.2,       // Amperage
              specs: [
                {
                  partNumber: "HTR-001",
                  voltage: 480,
                  amperage: 20
                }
              ]
            },
            ssr2: { ... },
            // ... ssr3 through ssr8
          },

          // Graph Data
          heaterGraphData: [
            { timestamp: 1700000000, value: 22 },
            { timestamp: 1700003600, value: 23 },
            ...
          ],
          enclosureGraphData: [ ... ],
          outsideGraphData: [ ... ],

          // Energy Consumption
          consumption: 150.5,    // kWh
          hoursOfUsage: 72,

          // Thermocouple Mapping
          thermocouple: true,
          heaterThermocoupleMap: [
            { ssr: "ssr1", tc: "tc-01" },
            { ssr: "ssr2", tc: "tc-02" }
          ],

          // Location Reference
          locationId: "bet-east",
          locationName: "Boston East",
          address: { lat: 42.36997, lng: -71.070647 },

          // UI State
          isExpanded: false,
          openMachineController: false,
          isFaults: false,
          displayConflictMessage: false
        }
      }
    }
  },

  // Same structure for TES and TGS
  tesSwitch: { flatTesSwitch: { ... } },
  tgsSwitch: { flatTgsSwitch: { ... } },

  // === LOCATION MANAGEMENT ===
  locations: {
    ess: {
      [locationId]: {
        zone_id: "bet-east",
        locationName: "Boston East",
        locationAddress: "123 Main St, Boston, MA",
        address: { lat: 42.36997, lng: -71.070647 },
        devices: {
          [deviceMac]: {
            machineName: "ESS Unit 1",
            machineMac: "AA:BB:CC:DD:EE:FF",
            locationId: "bet-east"
          }
        },
        weather: [
          {
            dt_txt: "2025-11-19 12:00:00",
            weather: [{ icon: "01d" }],
            main: { temp_min: -5, temp_max: 2 }
          }
        ],
        site_maps_ESS: ["https://s3.../map.jpg"],
        assign_users: ["john@example.com"]
      }
    },
    tgs: { ... },
    tes: { ... },
    all: { /* Combined all device types */ },
    specific: { /* Sub-locations */ }
  },

  // === DATA CONSUMPTION TRACKING ===
  essDataConsumption: {
    [locationId]: {
      [deviceMac]: {
        consumption: 150.5,     // kWh
        hoursOfUsage: 72,
        usageHours: 75,
        energyConsump: 300,
        isSelected: false
      }
    }
  },

  tesDataConsumption: { ... },
  tgsDataConsumption: { ... },

  // === USER & AUTHENTICATION ===
  userInfo: {
    user: {
      user_id: "USER_001",
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      company_name: "ABC Corp",
      user_role: "ADMINISTRATOR",
      temperature_unit: "c",
      avatar: "https://s3.../avatar.jpg"
    },
    permissions: {
      ESS_CONTROL: true,
      TES_CONTROL: true,
      TGS_CONTROL: true,
      HP_CONTROL: true,
      SETTINGS_ACCESS: true,
      ADMIN_ACCESS: true
    },
    isAuthenticated: true,
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    loading: false,
    error: null
  },

  // === SETTINGS ===
  units: {
    isF: false    // false = Celsius, true = Fahrenheit
  },

  windFactor: {
    isActivated: false,
    windSpeed: 0
  },

  snowSensor: {
    isActivated: false,
    defaultTemp: 350
  },

  interfaceMode: {
    mode: "standard" | "advanced"
  },

  // === MASTER CONTROL SELECTION ===
  masterControlSelect: {
    ess: {
      [locationId]: {
        isSelected: true,
        machines: ["AA:BB:CC:DD:EE:FF", "BB:CC:DD:EE:FF:00"]
      }
    },
    tes: { ... },
    tgs: { ... }
  },

  masterControlSelectByLocation: {
    selectedLocations: ["bet-east", "bet-west"],
    deviceType: "ess"
  },

  masterControlBySwitchSelect: {
    selectedSwitches: ["AA:BB:CC:DD:EE:FF"]
  },

  selectedMachines: {
    ess: ["AA:BB:CC:DD:EE:FF"],
    tes: [],
    tgs: []
  },

  // === REPORTING & MONITORING ===
  telemetryChartData: {
    chartData: [
      {
        date: "2025-11-19",
        consumption: 150.5,
        hoursOfUsage: 24
      }
    ],
    dateRange: { start: "2025-11-01", end: "2025-11-30" }
  },

  reportStatus: {
    heaterStatus: "ACTIVE",
    switchStatus: "ON",
    activeDevices: 15,
    totalDevices: 20
  },

  FaultsState: {
    faults: [
      {
        device_mac: "AA:BB:CC:DD:EE:FF",
        faultType: "THERMOCOUPLE_ERROR",
        message: "TC-01 disconnected",
        timestamp: 1700000000,
        severity: "HIGH"
      }
    ]
  },

  // === UI STATE ===
  messageBoxes: {
    showError: false,
    showSuccess: false,
    message: null
  },

  globalOverview: {
    activeDevices: 15,
    totalConsumption: 2500.5,
    alerts: 3
  },

  isExpanded: {
    sidePanel: false,
    deviceCard: {}
  }
}
```

---

## 🔌 **API Service Layer**

### **Service Organization**

**Location:** `/home/user/ahmedmedra57/src/services/`

#### **1. Authentication Service**
**File:** `auth.service.js`

```javascript
// Login
export const loginService = async (email, password) => {
  const response = await axios.post("/login", { email, password });
  // Returns: { access_token, user: {...} }
  return response.data;
};

// Logout
export const logoutService = async () => {
  await axios.post("/logout");
  localStorage.removeItem('access_token');
};

// Password Reset
export const resetPasswordService = async (email) => {
  await axios.post("/api/forget-password", { email });
};

// Contact Us
export const contactUsService = async (formData) => {
  await axios.post("/api/contact-us", formData);
};
```

#### **2. Device Command Service**
**File:** `sendCommand.service.js`

```javascript
// ESS Command
export const postEssCommand = async (deviceMac, command, value) => {
  const response = await axios.post("/switches/send-command", {
    "mac": deviceMac,
    [command]: value    // e.g., instantHeat: 25
  });
  return response.data.data;
};

// TGS Command
export const postTgsCommand = async (deviceMac, command, value) => {
  const response = await axios.post("/blowers/send-command", {
    "mac": deviceMac,
    "deviceType": "TGS",
    [command]: value
  });
  return response.data.data;
};

// TES Command
export const postTesCommand = async (deviceMac, command, value) => {
  const response = await axios.post("/blowers/send-command", {
    "mac": deviceMac,
    "deviceType": "TES",
    [command]: value
  });
  return response.data.data;
};
```

#### **3. Master Control Service**
**File:** `masterControl.service.js`

```javascript
// Batch Update Switches
export const updateSwitchesMasterControlService = async (
  deviceIds,
  deviceType,
  data
) => {
  const response = await axios.post("/switches/master-control", {
    deviceIds,      // Array of device MACs
    deviceType,     // "ESS", "TES", "TGS"
    ...data         // { instantHeat: 25, isF: false, ... }
  });
  return response.data;
};

// Batch Update Blowers
export const updateBlowersMasterControlService = async (
  deviceIds,
  deviceType,
  data
) => {
  const response = await axios.post("/blowers/master-control", {
    deviceIds,
    deviceType,
    ...data
  });
  return response.data;
};
```

#### **4. Zones Service**
**File:** `zones.service.js`

```javascript
// Get ESS Zones
export const getEssZones = async (params) => {
  const response = await axios.get('/get-zones/switches', { params });
  return response.data;
  // Returns: { [zoneId]: { zone_id, zone_name, devices: [...] } }
};

// Get TGS Zones
export const getTgsZones = async (params) => {
  const response = await axios.get('/get-zones/blowers', {
    params: { ...params, deviceType: 'TGS' }
  });
  return response.data;
};

// Get TES Zones
export const getTesZones = async (params) => {
  const response = await axios.get('/get-zones/blowers', {
    params: { ...params, deviceType: 'TES' }
  });
  return response.data;
};

// Upload Site Map
export const uploadSiteMapService = async (zoneId, file, deviceType) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('deviceType', deviceType);

  const response = await axios.post(`/zones/${zoneId}/site-map`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
```

#### **5. Telemetry & Graphs Service**
**File:** `telemetry.service.js` & `graphs.service.js`

```javascript
// Get Telemetry Data
export const getTelemetryService = async (params) => {
  // params: { deviceType, startDate, endDate, devices: [...] }
  const response = await axios.get('/reports/telemetry', { params });
  return response.data;
};

// Get Data Consumption
export const getDataConsumptionService = async (params) => {
  const response = await axios.get('/reports/data-consumption', { params });
  return response.data;
};

// Get Graph Data
export const getGraphService = async (deviceMac, graphType) => {
  // graphType: 'heater', 'enclosure', 'outside', 'snow', 'wind', etc.
  const response = await axios.get('/live-graph', {
    params: { device_mac: deviceMac, graph_type: graphType }
  });
  return response.data;
  // Returns: { points: [{ timestamp, value }, ...] }
};
```

#### **6. User Profile Service (AsyncThunk)**
**File:** `userProfile.service.js`

```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';

// Get User Profile (AsyncThunk for Redux integration)
export const getUserProfileDataService = createAsyncThunk(
  "userInfo/getUserProfileDataService",
  async () => {
    const response = await axios.get('/me');
    return response.data.data;
    // Redux automatically handles pending/fulfilled/rejected states
  }
);

// Update User Profile
export const updateUserProfileService = async (userData) => {
  const response = await axios.put('/update-user', userData);
  return response.data;
};
```

### **Axios Configuration**

**File:** `axiosConfig.js`

```javascript
import axios from 'axios';

// Base URL from environment variables
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
// Example: https://api.dev.umb-360.com

// Request Interceptor: Add JWT Token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    // Don't add token to S3 uploads
    if (!config.url.includes(process.env.REACT_APP_AMAZON_S3_URL) && token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('loginTime');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🔄 **WebSocket Integration**

### **Socket.io Connection**

**File:** `src/hooks/useSocket.js`

```javascript
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

export const useSocket = (room, accessToken) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const { isF } = useSelector(selectUnits);

  useEffect(() => {
    if (accessToken) {
      // Establish connection
      const newSocket = io('https://api.dev.umb-360.com', {
        query: { room }    // Room = user_id for filtering
      });

      // Connection established
      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      // Connection error
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      // === EVENT LISTENERS ===

      // 1. ESS Device Updates
      newSocket.on('switchAudit', (data) => {
        dispatch(handleEssSwitchSocket({ data, isF }));
        dispatch(handleEssSSRStateSocket(data));
      });

      // 2. TGS/TES Device Updates
      newSocket.on('blowerAudit', (data) => {
        if (data.eventDeviceType === 'TGS') {
          dispatch(handleTgsSwitchSocket({ data, isF }));
        } else if (data.eventDeviceType === 'TES') {
          dispatch(handleTesSwitchSocket({ data, isF }));
          dispatch(handleTesSSRStateSocket(data));
        }
      });

      // 3. SSR (Heater) State Updates
      newSocket.on('ssrUpdate', (data) => {
        // Enrich with heater specifications
        const specs = elementsOptions.filter((element) =>
          data.Heaters.includes(element?.partNumber)
        );
        const enrichedData = {
          ...data,
          specs: specs.length !== 0 ? specs : [{}]
        };

        if (data.eventDeviceType === 'ESS') {
          dispatch(handleEssSSRStateSocket(enrichedData));
        } else if (data.eventDeviceType === 'TES') {
          dispatch(handleTesSSRStateSocket(enrichedData));
        }
      });

      // 4. Heating Schedule Updates
      newSocket.on('scheduleList', (data) => {
        const location = data.zoneInfo.zone_id;
        const machine = data.device_mac;

        // Determine device type and corresponding action
        const addSchedule =
          data.eventDeviceType === 'ESS' ? handleAddHeatingSchedule :
          data.eventDeviceType === 'TES' ? tesHandleAddHeatingSchedule :
          tgsHandleAddHeatingSchedule;

        const clearSchedule =
          data.eventDeviceType === 'ESS' ? handleClearHeatingSchedule :
          data.eventDeviceType === 'TES' ? tesHandleClearHeatingSchedule :
          tgsHandleClearHeatingSchedule;

        if (data.hasOwnProperty('threshold')) {
          // Add new schedule
          const { threshold, startDate, endDate, id } = data;
          dispatch(addSchedule({
            location,
            machine,
            start: readableTime(startDate),
            end: readableTime(endDate),
            index: 0,
            inputTemp: isF ? convertCelsiusToFahrenheit(+threshold) : +threshold,
            isF,
            id
          }));
        } else {
          // Clear schedule
          dispatch(clearSchedule({
            location,
            machine,
            data: [{
              start: { date: null, time: null },
              end: { date: null, time: null },
              inputTemp: null,
              isF: null,
              id: null
            }]
          }));
        }
      });

      // 5. Thermocouple/Fault Updates
      newSocket.on('thermocoupleUpdate', (data) => {
        const swtName = data.eventDeviceType.toLowerCase();
        dispatch(handleReceivedThermocoupleSetting({
          swtName,
          location: data.zoneInfo?.zone_id,
          machine: data.device_id,
          data: { ...data, deviceType: swtName }
        }));
      });

      // 6. Graph Data Events (9 types)
      const handleGraph = (data, graphType) => {
        const graphData = {
          location: data.zoneInfo?.zone_id,
          machine: data.device_mac,
          graphType: getGraphTypeKey(graphType),
          data: data.points    // [{ timestamp, value }, ...]
        };

        if (data.eventDeviceType === 'ESS') {
          dispatch(handleEssGraph(graphData));
        } else if (data.eventDeviceType === 'TGS') {
          dispatch(handleTgsGraph(graphData));
        } else if (data.eventDeviceType === 'TES') {
          dispatch(handleTesGraph(graphData));
        }
      };

      // Register graph listeners
      newSocket.on('heater_graph', (data) => handleGraph(data, 'heater'));
      newSocket.on('enclosure_graph', (data) => handleGraph(data, 'enclosure'));
      newSocket.on('outside_graph', (data) => handleGraph(data, 'outside'));
      newSocket.on('gas_enclosure_graph', (data) => handleGraph(data, 'gas_enclosure'));
      newSocket.on('gas_graph', (data) => handleGraph(data, 'gas'));
      newSocket.on('snow_graph', (data) => handleGraph(data, 'snow'));
      newSocket.on('wind_graph', (data) => handleGraph(data, 'wind'));
      newSocket.on('gas_snow_graph', (data) => handleGraph(data, 'gas_snow'));
      newSocket.on('gas_wind_graph', (data) => handleGraph(data, 'gas_wind'));

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [room, accessToken, dispatch, isF]);

  return socket;
};
```

### **WebSocket Event Types**

| Event | Payload | Purpose | Redux Action |
|-------|---------|---------|--------------|
| **switchAudit** | Device state for ESS | Real-time ESS updates | `handleEssSwitchSocket()` |
| **blowerAudit** | Device state for TGS/TES | Real-time TGS/TES updates | `handleTgsSwitchSocket()` / `handleTesSwitchSocket()` |
| **ssrUpdate** | SSR state & heater specs | Heater element updates | `handleEssSSRStateSocket()` / `handleTesSSRStateSocket()` |
| **scheduleList** | Schedule data or clear signal | Schedule updates | `handleAddHeatingSchedule()` / `handleClearHeatingSchedule()` |
| **thermocoupleUpdate** | Fault/thermocouple data | Fault notifications | `handleReceivedThermocoupleSetting()` |
| **heater_graph** | Historical graph points | Heater temperature graph | `handleEssGraph()` |
| **enclosure_graph** | Historical graph points | Enclosure temp graph | `handleEssGraph()` |
| **outside_graph** | Historical graph points | Outside temp graph | `handleEssGraph()` |
| **gas_enclosure_graph** | Historical graph points | Gas enclosure graph | `handleTgsGraph()` |
| **gas_graph** | Historical graph points | Gas system graph | `handleTgsGraph()` |
| **snow_graph** | Historical graph points | Snow sensor graph | `handleEssGraph()` |
| **wind_graph** | Historical graph points | Wind sensor graph | `handleEssGraph()` |
| **gas_snow_graph** | Historical graph points | Gas snow graph | `handleTgsGraph()` |
| **gas_wind_graph** | Historical graph points | Gas wind graph | `handleTgsGraph()` |

---

## 🎛️ **Component Data Flow Examples**

### **Example 1: Temperature Control Component**

```javascript
// Component: InstantHeatControl.js
import { useSelector, useDispatch } from 'react-redux';
import { handleInstantHeatReady } from '../store/slices/essSwitchSlice';
import { postEssCommand } from '../services/sendCommand.service';

const InstantHeatControl = ({ location, machine }) => {
  const dispatch = useDispatch();

  // Read from Redux
  const deviceData = useSelector(
    state => state.essSwitch.flatEssSwitch[location][machine]
  );
  const { isF } = useSelector(selectUnits);

  const { instantHeat, currentTemp } = deviceData;

  // Handle temperature input
  const handleTempChange = (temp) => {
    dispatch(handleInstantHeatReady({
      location,
      machine,
      temp,
      isF
    }));
  };

  // Apply temperature
  const handleApply = async () => {
    try {
      await postEssCommand(machine, 'instantHeat', instantHeat.inputTemp);
      // WebSocket will update Redux with confirmation
    } catch (error) {
      console.error('Failed to set temperature:', error);
    }
  };

  return (
    <div>
      <h3>Instant Heat Control</h3>
      <p>Current Temperature: {currentTemp}°{isF ? 'F' : 'C'}</p>

      <input
        type="number"
        value={instantHeat.inputTemp}
        onChange={(e) => handleTempChange(e.target.value)}
      />

      {instantHeat.isReady && (
        <button onClick={handleApply}>Apply</button>
      )}

      {instantHeat.isActivated && (
        <span>✓ Activated</span>
      )}
    </div>
  );
};
```

**Data Flow:**
1. Component reads `deviceData` from Redux
2. User types temperature → `handleTempChange` → Redux update
3. User clicks Apply → `postEssCommand` → API call
4. Server processes → broadcasts WebSocket event
5. `useSocket` receives event → Redux update
6. Component re-renders with new state

---

### **Example 2: Location Selection Component**

```javascript
// Component: LocationSelector.js
import { useSelector, useDispatch } from 'react-redux';
import { useSelectSwitchesDispatches } from '../hooks/useSelectSwitchesDispatches';

const LocationSelector = ({ deviceType }) => {
  const dispatch = useDispatch();
  const locations = useSelector(state => state.locations[deviceType]);
  const selectedLocations = useSelector(
    state => state.masterControlSelect[deviceType]
  );

  const { selectLocationsHandler } = useSelectSwitchesDispatches();

  const handleLocationSelect = (locationId) => {
    const machines = Object.keys(locations[locationId].devices);
    selectLocationsHandler(
      locationId,
      deviceType,
      true,    // isSelected
      machines,
      dispatch
    );
  };

  return (
    <div>
      <h3>Select Location</h3>
      {Object.keys(locations).map((locationId) => (
        <div key={locationId}>
          <input
            type="checkbox"
            checked={selectedLocations[locationId]?.isSelected}
            onChange={() => handleLocationSelect(locationId)}
          />
          <label>{locations[locationId].locationName}</label>
          <span>{locations[locationId].devices.length} devices</span>
        </div>
      ))}
    </div>
  );
};
```

**Data Flow:**
1. Component reads `locations` and `selectedLocations` from Redux
2. User clicks checkbox → `handleLocationSelect` → `selectLocationsHandler`
3. Hook loops through all devices and dispatches selection actions
4. Redux updates: `state.essSwitch[location][machine].isSelected = true`
5. Redux updates: `state.masterControlSelect[deviceType][location] = { isSelected: true, machines: [...] }`
6. Component re-renders showing selected state

---

## 📈 **Data Transformation Patterns**

### **API Response → Redux State**

**Transformation in locationsSlice.js**

```javascript
// API Response (flat structure):
{
  "bet-east": {
    zone_id: "bet-east",
    zone_name: "Boston East",
    devices: [
      { device_mac: "AA:BB:CC:DD:EE:FF", device_name: "ESS 1", ... },
      { device_mac: "BB:CC:DD:EE:FF:00", device_name: "ESS 2", ... }
    ]
  }
}

// Redux State (nested structure):
state.locations.ess = {
  "bet-east": {
    zone_id: "bet-east",
    locationName: "Boston East",
    devices: {
      "AA:BB:CC:DD:EE:FF": {
        machineName: "ESS 1",
        machineMac: "AA:BB:CC:DD:EE:FF",
        locationId: "bet-east"
      },
      "BB:CC:DD:EE:FF:00": {
        machineName: "ESS 2",
        machineMac: "BB:CC:DD:EE:FF:00",
        locationId: "bet-east"
      }
    }
  }
}

// Transformation Code:
const handleEssLocation = (state, action) => {
  const zones = action.payload;

  Object.keys(zones).forEach((zoneId) => {
    const zone = zones[zoneId];

    state.ess[zoneId] = {
      zone_id: zoneId,
      locationName: zone.zone_name,
      locationAddress: zone.zone_address,
      address: { lat: zone.latitude, lng: zone.longitude },
      devices: {},
      weather: zone.daily || [],
      site_maps_ESS: zone.site_maps_ESS || []
    };

    // Transform devices array → object keyed by MAC
    zone.devices.forEach((device) => {
      state.ess[zoneId].devices[device.device_mac] = {
        machineName: device.device_name,
        machineMac: device.device_mac,
        locationId: zoneId
      };
    });
  });
};
```

---

## 🔐 **Permission-Based Data Access**

### **Permission Check Pattern**

```javascript
// Hook: useCheckControlPermission.js
export const useCheckControlPermission = (deviceType) => {
  const { permissions } = useSelector(state => state.userInfo);

  const permissionMap = {
    'ess': 'ESS_CONTROL',
    'tes': 'TES_CONTROL',
    'tgs': 'TGS_CONTROL',
    'hp': 'HP_CONTROL'
  };

  const hasPermission = permissions[permissionMap[deviceType]] || false;

  return hasPermission;
};

// Usage in Component:
const DeviceControl = ({ deviceType }) => {
  const hasControl = useCheckControlPermission(deviceType);

  if (!hasControl) {
    return <div>You don't have permission to control this device</div>;
  }

  return <ControlPanel />;
};
```

---

## 🎯 **Summary: Key Takeaways**

### **Data Flow Principles**

1. **Single Source of Truth**: Redux store is the canonical state
2. **Unidirectional Flow**: Actions → Reducers → State → Components
3. **Optimistic Updates**: UI updates immediately, confirmed by WebSocket
4. **Real-time Sync**: All clients stay synchronized via Socket.io
5. **Persistent State**: redux-persist saves state to localStorage
6. **Permission-Based**: Data access controlled by user permissions

### **Critical Files**

| File | Purpose |
|------|---------|
| `src/components/store/store.js` | Redux store configuration |
| `src/components/store/slices/essSwitchSlice.js` | Main ESS device state |
| `src/services/sendCommand.service.js` | Device command API calls |
| `src/services/zones.service.js` | Location/device data fetching |
| `src/hooks/useSocket.js` | WebSocket event handling |
| `src/services/axiosConfig.js` | HTTP interceptors & authentication |

### **Data Flow Complexity**

- **40 Redux Slices** managing different aspects of state
- **16 Service Files** handling API communication
- **9 Graph Event Types** for real-time data visualization
- **4 Device Types** (ESS, TES, TGS, HP) with similar patterns
- **3 Layers** (API, WebSocket, Redux) working in concert

### **Performance Optimizations**

1. **Redux Persist**: Faster app startup with cached state
2. **Normalized State**: O(1) lookups with nested structure
3. **Selective Rehydration**: Only rehydrate necessary slices
4. **Room-based WebSocket**: Only receive relevant device updates
5. **Axios Interceptors**: Automatic token refresh and error handling

---

**End of Data Flow Analysis**

For implementation examples or specific flow questions, refer to the relevant section above or examine the source files directly.
