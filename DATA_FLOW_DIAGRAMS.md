# 🗺️ Data Flow Visual Diagrams

**Date:** November 19, 2025
**Companion to:** DATA_FLOW_ANALYSIS.md
**Purpose:** Visual diagrams showing how data flows through the UMB-360 application

---

## 📊 **Complete System Architecture**

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React SPA)                          │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                         Component Layer                              │ │
│  │                                                                      │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │ │
│  │  │  Location  │  │   Device   │  │  Master    │  │  Telemetry   │  │ │
│  │  │  Selector  │  │  Controls  │  │  Control   │  │  Dashboard   │  │ │
│  │  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └──────┬───────┘  │ │
│  │         │                │                │                │          │ │
│  │         └────────────────┴────────────────┴────────────────┘          │ │
│  │                                  │                                    │ │
│  │                    useSelector() │ useDispatch()                      │ │
│  └──────────────────────────────────┼────────────────────────────────────┘ │
│                                     │                                      │
│  ┌──────────────────────────────────┼────────────────────────────────────┐ │
│  │                         Redux Store Layer                            │ │
│  │                                                                      │ │
│  │  ┌────────────────────────────────────────────────────────────────┐ │ │
│  │  │                     40 Redux Slices                            │ │ │
│  │  │                                                                │ │ │
│  │  │  Device State:                                                 │ │ │
│  │  │  ├─ essSwitch        (ESS devices & controls)                  │ │ │
│  │  │  ├─ tesSwitch        (TES devices & controls)                  │ │ │
│  │  │  └─ tgsSwitch        (TGS devices & controls)                  │ │ │
│  │  │                                                                │ │ │
│  │  │  Location Management:                                          │ │ │
│  │  │  └─ locations        (Zones, addresses, weather)              │ │ │
│  │  │                                                                │ │ │
│  │  │  Data Tracking:                                                │ │ │
│  │  │  ├─ essDataConsumption                                         │ │ │
│  │  │  ├─ telemetryChartData                                         │ │ │
│  │  │  └─ reportStatus                                               │ │ │
│  │  │                                                                │ │ │
│  │  │  User & Auth:                                                  │ │ │
│  │  │  └─ userInfo         (Profile, permissions, token)            │ │ │
│  │  │                                                                │ │ │
│  │  │  Settings:                                                     │ │ │
│  │  │  ├─ units            (Celsius/Fahrenheit)                     │ │ │
│  │  │  ├─ windFactor       (Wind speed settings)                    │ │ │
│  │  │  └─ snowSensor       (Snow detection)                         │ │ │
│  │  │                                                                │ │ │
│  │  │  Selection State:                                              │ │ │
│  │  │  ├─ masterControlSelect                                        │ │ │
│  │  │  └─ selectedMachines                                           │ │ │
│  │  │                                                                │ │ │
│  │  │  UI State:                                                     │ │ │
│  │  │  ├─ messageBoxes                                               │ │ │
│  │  │  └─ globalOverview                                             │ │ │
│  │  └────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                      │ │
│  │  Redux Persist: ↓ localStorage                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                     │                                      │
│  ┌──────────────────────────────────┼────────────────────────────────────┐ │
│  │                      Custom Hooks Layer                              │ │
│  │                                                                      │ │
│  │  ┌──────────────┐  ┌─────────────────┐  ┌──────────────────────┐   │ │
│  │  │  useSocket() │  │ useSelectSwitches│  │  useGetGraphQueries()│   │ │
│  │  │              │  │  Dispatches()    │  │                      │   │ │
│  │  │ WebSocket    │  │                  │  │  React Query for     │   │ │
│  │  │ connection   │  │  Device selection│  │  graph data fetching │   │ │
│  │  └──────┬───────┘  └────────┬─────────┘  └──────────┬───────────┘   │ │
│  └─────────┼────────────────────┼────────────────────────┼───────────────┘ │
│            │                    │                        │                 │
└────────────┼────────────────────┼────────────────────────┼─────────────────┘
             │                    │                        │
             │                    │                        │
┌────────────┼────────────────────┼────────────────────────┼─────────────────┐
│            │                    │                        │                 │
│  ┌─────────▼──────┐  ┌──────────▼──────────┐  ┌─────────▼──────────┐     │
│  │  Socket.io     │  │    Axios HTTP       │  │   Axios HTTP       │     │
│  │  Connection    │  │    (API Services)   │  │   (Graph Service)  │     │
│  │                │  │                     │  │                    │     │
│  │  Server:       │  │  Services:          │  │  Endpoints:        │     │
│  │  api.dev.umb   │  │  ├─ auth.service    │  │  /live-graph       │     │
│  │  -360.com      │  │  ├─ sendCommand     │  │  /reports/*        │     │
│  │                │  │  ├─ masterControl   │  │                    │     │
│  │  Events:       │  │  ├─ zones           │  │  Query Caching     │     │
│  │  ├─switchAudit │  │  ├─ telemetry       │  │  with React Query  │     │
│  │  ├─blowerAudit │  │  └─ 11+ more        │  │                    │     │
│  │  ├─ssrUpdate   │  │                     │  │                    │     │
│  │  ├─scheduleList│  │  Interceptors:      │  │                    │     │
│  │  └─9 graph evt │  │  ├─ Add JWT token   │  │                    │     │
│  └────────┬───────┘  │  └─ Handle 401      │  └────────────────────┘     │
│           │          └──────────┬──────────┘                             │
│           │                     │                                         │
│           └─────────────────────┼─────────────────────────────────────────│
│                                 │                                         │
│                        BACKEND SERVICES                                   │
└─────────────────────────────────┼─────────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼─────────────────────────────────────────┐
│                       REST API Server + WebSocket Server                  │
│                                                                            │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐ │
│  │  Authentication      │  │  Device Control      │  │  Data Services  │ │
│  │  ├─ Login/Logout     │  │  ├─ Command Router   │  │  ├─ Telemetry   │ │
│  │  ├─ Token Validation │  │  ├─ Master Control   │  │  ├─ Consumption │ │
│  │  └─ Permissions      │  │  └─ Settings Update  │  │  └─ Reports     │ │
│  └──────────────────────┘  └──────────────────────┘  └─────────────────┘ │
│                                                                            │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐ │
│  │  Socket.io Server    │  │  Database Layer      │  │  External APIs  │ │
│  │  ├─ Room Management  │  │  ├─ Users & Zones    │  │  ├─ Weather     │ │
│  │  ├─ Event Broadcasting│  │  ├─ Devices         │  │  └─ AWS S3      │ │
│  │  └─ Connection Pool  │  │  └─ Historical Data  │  │                 │ │
│  └──────────────────────┘  └──────────────────────┘  └─────────────────┘ │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                    Physical Device Communication                      │ │
│  │  Sends commands to actual heating devices (ESS, TES, TGS units)      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **User Action Flow Diagram**

### **Scenario: Setting Device Temperature**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           USER INTERACTION                                │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │
                                ▼
                     User enters temperature: 25°C
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Component: InstantHeatControl.js                                        │
│                                                                         │
│  handleTempChange(25)                                                   │
│  │                                                                      │
│  ├─► dispatch(handleInstantHeatReady({                                 │
│  │      location: "bet-east",                                          │
│  │      machine: "AA:BB:CC:DD:EE:FF",                                  │
│  │      temp: 25,                                                      │
│  │      isF: false                                                     │
│  │   }))                                                               │
│  │                                                                      │
│  └─► UI shows: "Ready to Apply" button                                 │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Redux Store: essSwitchSlice.js                                          │
│                                                                         │
│  Reducer: handleInstantHeatReady                                        │
│  │                                                                      │
│  ├─► state.flatEssSwitch["bet-east"]["AA:BB:CC:DD:EE:FF"] = {          │
│  │      ...existing,                                                   │
│  │      instantHeat: {                                                 │
│  │        inputTemp: 25,                                               │
│  │        isReady: true,     ◄── UI can now show "Apply" button        │
│  │        isActivated: false,                                          │
│  │        isF: false                                                   │
│  │      }                                                              │
│  │   }                                                                 │
│  │                                                                      │
│  └─► Component re-renders (optimistic update)                          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
                     User clicks "Apply" button
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Component: InstantHeatControl.js                                        │
│                                                                         │
│  handleApply()                                                          │
│  │                                                                      │
│  └─► await postEssCommand(                                             │
│         "AA:BB:CC:DD:EE:FF",                                            │
│         "instantHeat",                                                  │
│         25                                                              │
│      )                                                                  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Service: sendCommand.service.js                                         │
│                                                                         │
│  axios.post("/switches/send-command", {                                │
│    "mac": "AA:BB:CC:DD:EE:FF",                                          │
│    "instantHeat": 25                                                    │
│  })                                                                     │
│  │                                                                      │
│  └─► Headers: { Authorization: "Bearer <JWT>" }  ◄── Added by interceptor
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼ HTTP POST
┌─────────────────────────────────────────────────────────────────────────┐
│ Backend API Server                                                      │
│                                                                         │
│  POST /switches/send-command                                            │
│  │                                                                      │
│  ├─► 1. Validate JWT token                                             │
│  ├─► 2. Check user permissions (ESS_CONTROL)                           │
│  ├─► 3. Send command to physical device                                │
│  ├─► 4. Update database record                                         │
│  ├─► 5. Broadcast Socket.io event to all clients in room               │
│  │                                                                      │
│  └─► HTTP Response: { status: "success" }                              │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ├─► Socket.io Broadcast
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ All Connected Clients (including originating client)                   │
│                                                                         │
│  Socket Event: 'switchAudit'                                            │
│  Payload: {                                                             │
│    device_mac: "AA:BB:CC:DD:EE:FF",                                     │
│    zoneInfo: { zone_id: "bet-east" },                                  │
│    eventDeviceType: "ESS",                                              │
│    instantHeat: 25,           ◄── Confirmed value from device          │
│    currentTemp: 22,           ◄── Real-time sensor reading             │
│    setTemp: 25,                                                         │
│    deviceStatus: "ACTIVE"                                               │
│  }                                                                      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Hook: useSocket.js                                                      │
│                                                                         │
│  newSocket.on('switchAudit', (data) => {                               │
│    dispatch(handleEssSwitchSocket({ data, isF }));                     │
│    dispatch(handleEssSSRStateSocket(data));                            │
│  })                                                                     │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Redux Store: essSwitchSlice.js                                          │
│                                                                         │
│  Reducer: handleEssSwitchSocket                                         │
│  │                                                                      │
│  ├─► state.flatEssSwitch["bet-east"]["AA:BB:CC:DD:EE:FF"] = {          │
│  │      ...existing,                                                   │
│  │      instantHeat: {                                                 │
│  │        inputTemp: 25,                                               │
│  │        isReady: false,    ◄── No longer ready, now activated        │
│  │        isActivated: true, ◄── Confirmed by device                   │
│  │        isF: false                                                   │
│  │      },                                                             │
│  │      currentTemp: 22,     ◄── Real-time update from sensor          │
│  │      setTemp: 25,         ◄── Set point confirmed                   │
│  │      deviceStatus: "ACTIVE"                                         │
│  │   }                                                                 │
│  │                                                                      │
│  └─► All subscribed components re-render                               │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Component: InstantHeatControl.js (re-render)                            │
│                                                                         │
│  UI now shows:                                                          │
│  ├─ Current Temperature: 22°C                                           │
│  ├─ Set Temperature: 25°C                                               │
│  └─ Status: ✓ Instant Heat Activated                                   │
│                                                                         │
│  "Apply" button hidden, "Deactivate" button shown                       │
└─────────────────────────────────────────────────────────────────────────┘

RESULT:
✓ User's change applied to physical device
✓ All connected clients see the update in real-time
✓ Redux state synchronized across all clients
✓ UI reflects confirmed device state
```

---

## 🚀 **App Initialization Flow**

### **From Browser Load to Fully Hydrated State**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         USER OPENS BROWSER                                │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │
                                ▼
                        Navigate to app URL
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ index.html loads                                                        │
│ React app mounts                                                        │
│ Redux store initializes                                                 │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Redux Persist: Rehydrate State                                          │
│                                                                         │
│  Read from localStorage:                                                │
│  ├─ persist:root                                                        │
│  │  ├─ userInfo (if exists)                                            │
│  │  ├─ locations (cached)                                              │
│  │  ├─ essSwitch (cached)                                              │
│  │  └─ units, settings, etc.                                           │
│  │                                                                      │
│  └─► Populate Redux store with cached data                             │
│                                                                         │
│  Result: App shows cached data immediately (fast startup)              │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
                    Check for access_token in localStorage
                                │
                       ┌────────┴────────┐
                       │                 │
                 Token exists      Token missing
                       │                 │
                       ▼                 ▼
            ┌──────────────────┐  ┌──────────────┐
            │  Continue auth   │  │  Redirect to │
            │  flow            │  │  /login page │
            └────────┬─────────┘  └──────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Step 1: Fetch User Profile                                             │
│                                                                         │
│  dispatch(getUserProfileDataService())                                  │
│  │                                                                      │
│  └─► GET /me                                                            │
│       Headers: { Authorization: "Bearer <token>" }                      │
│                                                                         │
│  Response: {                                                            │
│    user_id: "USER_001",                                                 │
│    firstname: "John",                                                   │
│    email: "john@example.com",                                           │
│    user_role: "ADMINISTRATOR",                                          │
│    temperature_unit: "c",                                               │
│    permissions: { ESS_CONTROL: true, ... }                              │
│  }                                                                      │
│  │                                                                      │
│  └─► Redux Update:                                                      │
│       state.userInfo = {                                                │
│         user: { ...response },                                          │
│         permissions: { ...response.permissions },                       │
│         isAuthenticated: true,                                          │
│         accessToken: <token>                                            │
│       }                                                                 │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Step 2: Fetch Locations & Devices (Parallel)                           │
│                                                                         │
│  Promise.all([                                                          │
│    getEssZones(),  ◄─── GET /get-zones/switches                        │
│    getTgsZones(),  ◄─── GET /get-zones/blowers?deviceType=TGS          │
│    getTesZones()   ◄─── GET /get-zones/blowers?deviceType=TES          │
│  ])                                                                     │
│  │                                                                      │
│  │ Response (ESS example):                                             │
│  │ {                                                                   │
│  │   "bet-east": {                                                     │
│  │     zone_id: "bet-east",                                            │
│  │     zone_name: "Boston East",                                       │
│  │     zone_address: "123 Main St",                                    │
│  │     latitude: 42.36997,                                             │
│  │     longitude: -71.070647,                                          │
│  │     devices: [                                                      │
│  │       {                                                             │
│  │         device_mac: "AA:BB:CC:DD:EE:FF",                            │
│  │         device_name: "ESS Unit 1",                                  │
│  │         currentTemp: 22,                                            │
│  │         setTemp: 25,                                                │
│  │         deviceStatus: "ACTIVE",                                     │
│  │         instantHeat: { isActivated: true, inputTemp: 25 },          │
│  │         ssrState: { ssr1: {...}, ssr2: {...}, ... },                │
│  │         heaterGraphData: [...],                                     │
│  │         ...                                                         │
│  │       },                                                            │
│  │       { /* Device 2 */ },                                           │
│  │       { /* Device 3 */ }                                            │
│  │     ],                                                              │
│  │     site_maps_ESS: ["https://s3.../map.jpg"],                       │
│  │     daily: [/* weather data */]                                     │
│  │   },                                                                │
│  │   "bet-west": { /* ... */ }                                         │
│  │ }                                                                   │
│  │                                                                      │
│  └─► Dispatch to Redux:                                                │
│       dispatch(handleEssLocation(essZones))                             │
│       dispatch(handleTgsLocation(tgsZones))                             │
│       dispatch(handleTesLocation(tesZones))                             │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Step 3: Transform & Store in Redux                                     │
│                                                                         │
│  Reducer: handleEssLocation (locationsSlice.js)                         │
│  │                                                                      │
│  ├─► Create nested structure:                                          │
│  │    state.locations.ess = {                                          │
│  │      "bet-east": {                                                  │
│  │        zone_id: "bet-east",                                         │
│  │        locationName: "Boston East",                                 │
│  │        address: { lat, lng },                                       │
│  │        devices: {                                                   │
│  │          "AA:BB:CC:DD:EE:FF": {                                     │
│  │            machineName: "ESS Unit 1",                               │
│  │            machineMac: "AA:BB:CC:DD:EE:FF",                         │
│  │            locationId: "bet-east"                                   │
│  │          }                                                          │
│  │        },                                                           │
│  │        weather: [...],                                              │
│  │        site_maps_ESS: [...]                                         │
│  │      }                                                              │
│  │    }                                                                │
│  │                                                                      │
│  └─► state.locations.all = { /* Combined all device types */ }         │
│                                                                         │
│  Reducer: handleSysEssLocation (essSwitchSlice.js)                      │
│  │                                                                      │
│  └─► Create device control structure:                                  │
│       state.essSwitch.flatEssSwitch = {                                │
│         "bet-east": {                                                  │
│           "AA:BB:CC:DD:EE:FF": {                                       │
│             machineType: "ess",                                        │
│             deviceMac: "AA:BB:CC:DD:EE:FF",                            │
│             deviceStatus: "ACTIVE",                                    │
│             currentTemp: 22,                                           │
│             setTemp: 25,                                               │
│             instantHeat: { ... },                                      │
│             snowSensor: { ... },                                       │
│             windFactor: { ... },                                       │
│             heatingScheduleList: [],                                   │
│             ssrState: { ssr1: {...}, ..., ssr8: {...} },               │
│             heaterGraphData: [],                                       │
│             ...                                                        │
│           }                                                            │
│         }                                                              │
│       }                                                                │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Step 4: Establish WebSocket Connection                                 │
│                                                                         │
│  useSocket(user.user_id, accessToken)                                  │
│  │                                                                      │
│  └─► const newSocket = io('https://api.dev.umb-360.com', {            │
│         query: { room: user.user_id }                                  │
│       });                                                              │
│                                                                         │
│  Connection Status:                                                     │
│  ┌─────────────────────────────────────────────────┐                   │
│  │ ● Connected to WebSocket Server                 │                   │
│  │ Room: USER_001                                  │                   │
│  │ Status: ACTIVE                                  │                   │
│  └─────────────────────────────────────────────────┘                   │
│                                                                         │
│  Event Listeners Registered:                                           │
│  ├─ switchAudit        (ESS updates)                                   │
│  ├─ blowerAudit        (TGS/TES updates)                               │
│  ├─ ssrUpdate          (Heater state changes)                          │
│  ├─ scheduleList       (Schedule updates)                              │
│  ├─ thermocoupleUpdate (Fault notifications)                           │
│  ├─ heater_graph       (Temperature graphs)                            │
│  ├─ enclosure_graph    (Enclosure temp graphs)                         │
│  ├─ outside_graph      (Outside temp graphs)                           │
│  └─ 6 more graph events                                                │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Step 5: Render UI Components                                           │
│                                                                         │
│  Components use useSelector() to read from Redux:                      │
│                                                                         │
│  ┌────────────────────────────────────────────────────────┐            │
│  │ const locations = useSelector(selectLocations);        │            │
│  │ const essDevices = useSelector(state =>                │            │
│  │   state.essSwitch.flatEssSwitch                        │            │
│  │ );                                                     │            │
│  │ const userInfo = useSelector(state =>                  │            │
│  │   state.userInfo                                       │            │
│  │ );                                                     │            │
│  │ const { isF } = useSelector(selectUnits);              │            │
│  └────────────────────────────────────────────────────────┘            │
│                                                                         │
│  UI Renders:                                                            │
│  ├─ Navigation bar with user info                                      │
│  ├─ Location cards (bet-east, bet-west)                                │
│  ├─ Device lists with real-time status                                 │
│  ├─ Temperature displays (22°C / 25°C)                                 │
│  ├─ Control panels (Instant Heat, Snow Sensor, etc.)                   │
│  ├─ Graphs showing historical data                                     │
│  └─ Master control interface (if permissions allow)                    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Step 6: Real-time Updates Begin                                        │
│                                                                         │
│  As devices change state, WebSocket events are received:               │
│                                                                         │
│  Event: 'switchAudit'                                                  │
│  ├─► dispatch(handleEssSwitchSocket(data))                             │
│  └─► Component re-renders with new data                                │
│                                                                         │
│  Event: 'heater_graph'                                                 │
│  ├─► dispatch(handleEssGraph(graphData))                               │
│  └─► Graph component updates with new points                           │
│                                                                         │
│  All updates happen automatically in real-time!                         │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                       APP FULLY INITIALIZED                               │
│                                                                          │
│  ✓ User authenticated with permissions                                  │
│  ✓ All locations and devices loaded                                     │
│  ✓ Redux state fully hydrated                                           │
│  ✓ WebSocket connected for real-time updates                            │
│  ✓ UI rendered with current device states                               │
│  ✓ Ready for user interactions                                          │
│                                                                          │
│  Total Time: ~2-3 seconds (with cached data: <1 second)                 │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🎛️ **Master Control Flow Diagram**

### **Batch Operation: Apply Setting to Multiple Devices**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    USER: Select Multiple Devices                          │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │
                                ▼
                     Opens location dropdown
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Component: LocationSelector                                            │
│                                                                         │
│  Displays:                                                              │
│  □ Boston East (5 devices)                                              │
│  □ Boston West (3 devices)                                              │
│  □ New York Site (8 devices)                                            │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
                    User checks "Boston East"
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Hook: useSelectSwitchesDispatches()                                     │
│                                                                         │
│  selectLocationsHandler("bet-east", "ess", true)                        │
│  │                                                                      │
│  └─► Get all devices in location:                                      │
│       machines = ["AA:BB:CC:DD:EE:FF", "BB:CC:DD:EE:FF:00", ...]       │
│       (5 devices)                                                       │
│                                                                         │
│       Loop through each machine:                                        │
│       ┌──────────────────────────────────────────────┐                 │
│       │ FOR EACH machine IN machines:               │                 │
│       │   dispatch(handleSelectIndividualMachine({  │                 │
│       │     location: "bet-east",                   │                 │
│       │     machine: machine                        │                 │
│       │   }))                                       │                 │
│       └──────────────────────────────────────────────┘                 │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Redux Updates (5 times, once per device)                               │
│                                                                         │
│  state.essSwitch.flatEssSwitch["bet-east"]["AA:BB:CC:DD:EE:FF"]        │
│    .isSelected = true                                                   │
│                                                                         │
│  state.essSwitch.flatEssSwitch["bet-east"]["BB:CC:DD:EE:FF:00"]        │
│    .isSelected = true                                                   │
│                                                                         │
│  ... (3 more devices)                                                  │
│                                                                         │
│  state.masterControlSelect.ess["bet-east"] = {                          │
│    isSelected: true,                                                    │
│    machines: [                                                          │
│      "AA:BB:CC:DD:EE:FF",                                               │
│      "BB:CC:DD:EE:FF:00",                                               │
│      "CC:DD:EE:FF:00:11",                                               │
│      "DD:EE:FF:00:11:22",                                               │
│      "EE:FF:00:11:22:33"                                                │
│    ]                                                                    │
│  }                                                                      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ UI Update                                                               │
│                                                                         │
│  ✓ Boston East (5 devices selected)                                    │
│  □ Boston West (3 devices)                                              │
│  □ New York Site (8 devices)                                            │
│                                                                         │
│  Master Control Panel shows:                                           │
│  ┌────────────────────────────────────────────┐                        │
│  │ 5 devices selected                         │                        │
│  │                                            │                        │
│  │ Configure setting:                         │                        │
│  │ Instant Heat: [30] °C                      │                        │
│  │                                            │                        │
│  │ [Apply to All]  [Cancel]                   │                        │
│  └────────────────────────────────────────────┘                        │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
              User configures: Instant Heat = 30°C
                                │
                                ▼
                    User clicks "Apply to All"
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Component: MasterControl.js                                             │
│                                                                         │
│  Collect selected devices:                                              │
│  │                                                                      │
│  └─► selectedDevices = [                                               │
│         "AA:BB:CC:DD:EE:FF",                                            │
│         "BB:CC:DD:EE:FF:00",                                            │
│         "CC:DD:EE:FF:00:11",                                            │
│         "DD:EE:FF:00:11:22",                                            │
│         "EE:FF:00:11:22:33"                                             │
│       ]                                                                │
│                                                                         │
│  Call API:                                                              │
│  await updateSwitchesMasterControlService(                              │
│    selectedDevices,                                                     │
│    'ESS',                                                               │
│    { instantHeat: 30 }                                                  │
│  )                                                                      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Service: masterControl.service.js                                       │
│                                                                         │
│  axios.post("/switches/master-control", {                              │
│    "deviceIds": [                                                       │
│      "AA:BB:CC:DD:EE:FF",                                               │
│      "BB:CC:DD:EE:FF:00",                                               │
│      "CC:DD:EE:FF:00:11",                                               │
│      "DD:EE:FF:00:11:22",                                               │
│      "EE:FF:00:11:22:33"                                                │
│    ],                                                                   │
│    "deviceType": "ESS",                                                 │
│    "instantHeat": 30                                                    │
│  })                                                                     │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼ Single HTTP POST
┌─────────────────────────────────────────────────────────────────────────┐
│ Backend API Server                                                      │
│                                                                         │
│  POST /switches/master-control                                          │
│  │                                                                      │
│  └─► Batch Processing Loop:                                            │
│       ┌──────────────────────────────────────────────────┐             │
│       │ FOR EACH deviceId IN deviceIds:                 │             │
│       │                                                  │             │
│       │   1. Validate user permission for device        │             │
│       │   2. Send command to physical device            │             │
│       │   3. Update database record                     │             │
│       │   4. Broadcast Socket.io event                  │             │
│       │      (separate event per device)                │             │
│       │                                                  │             │
│       └──────────────────────────────────────────────────┘             │
│                                                                         │
│  HTTP Response: { status: "success", updated: 5 }                      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ├─► Socket.io Broadcasts (5 events)
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ WebSocket Events (One per device)                                      │
│                                                                         │
│  Event 1: 'switchAudit'                                                │
│  { device_mac: "AA:BB:CC:DD:EE:FF", instantHeat: 30, ... }             │
│                                                                         │
│  Event 2: 'switchAudit'                                                │
│  { device_mac: "BB:CC:DD:EE:FF:00", instantHeat: 30, ... }             │
│                                                                         │
│  Event 3: 'switchAudit'                                                │
│  { device_mac: "CC:DD:EE:FF:00:11", instantHeat: 30, ... }             │
│                                                                         │
│  Event 4: 'switchAudit'                                                │
│  { device_mac: "DD:EE:FF:00:11:22", instantHeat: 30, ... }             │
│                                                                         │
│  Event 5: 'switchAudit'                                                │
│  { device_mac: "EE:FF:00:11:22:33", instantHeat: 30, ... }             │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Hook: useSocket.js (Processes each event)                              │
│                                                                         │
│  FOR EACH 'switchAudit' event:                                          │
│    dispatch(handleEssSwitchSocket({ data, isF }))                      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Redux Updates (5 times)                                                │
│                                                                         │
│  state.essSwitch.flatEssSwitch["bet-east"]["AA:BB:CC:DD:EE:FF"]        │
│    .instantHeat = { inputTemp: 30, isActivated: true, ... }            │
│                                                                         │
│  state.essSwitch.flatEssSwitch["bet-east"]["BB:CC:DD:EE:FF:00"]        │
│    .instantHeat = { inputTemp: 30, isActivated: true, ... }            │
│                                                                         │
│  ... (3 more devices updated)                                          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ UI Update (All selected devices)                                       │
│                                                                         │
│  Device Cards show:                                                     │
│  ┌────────────────────────────────────────────────────────┐            │
│  │ ESS Unit 1 (AA:BB:CC:DD:EE:FF)                         │            │
│  │ ✓ Instant Heat: 30°C (Activated)                       │            │
│  └────────────────────────────────────────────────────────┘            │
│                                                                         │
│  ┌────────────────────────────────────────────────────────┐            │
│  │ ESS Unit 2 (BB:CC:DD:EE:FF:00)                         │            │
│  │ ✓ Instant Heat: 30°C (Activated)                       │            │
│  └────────────────────────────────────────────────────────┘            │
│                                                                         │
│  ... (3 more devices)                                                  │
│                                                                         │
│  Optionally: Deselect all devices                                      │
│  dispatch(handleUnselectAllMachines('ess'))                             │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                       BATCH OPERATION COMPLETE                            │
│                                                                          │
│  ✓ 5 devices updated with single API call                               │
│  ✓ All connected users see updates in real-time                         │
│  ✓ Each device has individual audit trail entry                         │
│  ✓ Redux state synchronized across all clients                          │
│                                                                          │
│  Efficiency: 1 HTTP request vs 5 individual requests                    │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 **Redux State Tree Visual**

```
Redux Store
│
├─ essSwitch ───────────────────────────────────────────┐
│  └─ flatEssSwitch                                    │
│     ├─ [locationId]                                  │ ESS Device
│     │  └─ [deviceMac]                                │ State
│     │     ├─ machineType: "ess"                      │
│     │     ├─ deviceMac                               │
│     │     ├─ deviceStatus                            │
│     │     ├─ isSelected: boolean                     │
│     │     ├─ currentTemp: number                     │
│     │     ├─ setTemp: number                         │
│     │     ├─ instantHeat: {inputTemp, isActivated...}│
│     │     ├─ snowSensor: {...}                       │
│     │     ├─ windFactor: {...}                       │
│     │     ├─ heatingScheduleList: [...]              │
│     │     ├─ ssrState: {ssr1, ssr2, ..., ssr8}       │
│     │     ├─ heaterGraphData: [...]                  │
│     │     ├─ enclosureGraphData: [...]               │
│     │     └─ ...25+ more properties                  │
│     └─ ...more locations                             │
├────────────────────────────────────────────────────────┘
│
├─ tesSwitch ───────────────────────────────────────────┐
│  └─ flatTesSwitch (similar structure to ESS)         │ TES Device
├────────────────────────────────────────────────────────┤ State
│                                                        │
├─ tgsSwitch ───────────────────────────────────────────┤
│  └─ flatTgsSwitch (similar structure to ESS)         │ TGS Device
├────────────────────────────────────────────────────────┘ State
│
├─ locations ───────────────────────────────────────────┐
│  ├─ ess                                               │
│  │  └─ [locationId]                                  │
│  │     ├─ zone_id                                    │
│  │     ├─ locationName                               │ Location &
│  │     ├─ address: {lat, lng}                        │ Zone Data
│  │     ├─ devices: {[deviceMac]: {...}}              │
│  │     ├─ weather: [...]                             │
│  │     └─ site_maps_ESS: [...]                       │
│  ├─ tes: {...}                                        │
│  ├─ tgs: {...}                                        │
│  ├─ all: {/* Combined */}                             │
│  └─ specific: {/* Sub-locations */}                   │
├────────────────────────────────────────────────────────┘
│
├─ essDataConsumption ──────────────────────────────────┐
│  └─ [locationId]                                      │
│     └─ [deviceMac]                                    │ Energy
│        ├─ consumption: number (kWh)                   │ Tracking
│        ├─ hoursOfUsage: number                        │
│        └─ isSelected: boolean                         │
├────────────────────────────────────────────────────────┘
│
├─ userInfo ────────────────────────────────────────────┐
│  ├─ user                                              │
│  │  ├─ user_id                                        │
│  │  ├─ firstname, lastname                            │
│  │  ├─ email                                          │ User &
│  │  ├─ user_role                                      │ Auth
│  │  └─ temperature_unit                               │
│  ├─ permissions                                        │
│  │  ├─ ESS_CONTROL: boolean                           │
│  │  ├─ TES_CONTROL: boolean                           │
│  │  └─ ADMIN_ACCESS: boolean                          │
│  ├─ isAuthenticated: boolean                           │
│  └─ accessToken: string                               │
├────────────────────────────────────────────────────────┘
│
├─ units ───────────────────────────────────────────────┐
│  └─ isF: boolean (false=Celsius, true=Fahrenheit)     │ Settings
├────────────────────────────────────────────────────────┤
│                                                        │
├─ windFactor ───────────────────────────────────────────│
│  ├─ isActivated: boolean                              │
│  └─ windSpeed: number                                 │
├────────────────────────────────────────────────────────┤
│                                                        │
├─ snowSensor ───────────────────────────────────────────│
│  ├─ isActivated: boolean                              │
│  └─ defaultTemp: number                               │
├────────────────────────────────────────────────────────┘
│
├─ masterControlSelect ──────────────────────────────────┐
│  ├─ ess                                               │
│  │  └─ [locationId]                                  │
│  │     ├─ isSelected: boolean                        │ Selection
│  │     └─ machines: [deviceMacs...]                  │ State
│  ├─ tes: {...}                                        │
│  └─ tgs: {...}                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
├─ selectedMachines ─────────────────────────────────────│
│  ├─ ess: [deviceMacs...]                              │
│  ├─ tes: [...]                                        │
│  └─ tgs: [...]                                        │
├────────────────────────────────────────────────────────┘
│
├─ telemetryChartData ───────────────────────────────────┐
│  ├─ chartData: [{date, consumption, hours}...]        │ Reporting
│  └─ dateRange: {start, end}                           │
├────────────────────────────────────────────────────────┤
│                                                        │
├─ reportStatus ─────────────────────────────────────────│
│  ├─ heaterStatus                                      │
│  ├─ switchStatus                                      │
│  └─ activeDevices                                     │
├────────────────────────────────────────────────────────┤
│                                                        │
├─ FaultsState ──────────────────────────────────────────│
│  └─ faults: [{device_mac, faultType, message}...]     │
├────────────────────────────────────────────────────────┘
│
├─ messageBoxes ─────────────────────────────────────────┐
│  ├─ showError: boolean                                │ UI State
│  ├─ showSuccess: boolean                              │
│  └─ message: string                                   │
├────────────────────────────────────────────────────────┤
│                                                        │
├─ globalOverview ───────────────────────────────────────│
│  ├─ activeDevices: number                             │
│  ├─ totalConsumption: number                          │
│  └─ alerts: number                                    │
├────────────────────────────────────────────────────────┤
│                                                        │
└─ isExpanded ──────────────────────────────────────────┘
   ├─ sidePanel: boolean
   └─ deviceCard: {[deviceId]: boolean}

Total: 40 Slices
Redux Persist: Saved to localStorage
```

---

**End of Visual Diagrams**

These diagrams provide visual representations of the data flow patterns described in `DATA_FLOW_ANALYSIS.md`.
