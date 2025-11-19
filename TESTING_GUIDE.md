# 🧪 Comprehensive Testing Guide

**Date:** November 19, 2025
**Purpose:** Complete guide to testing the UMB-360 heating control application
**Audience:** Developers who want to test and validate the application

---

## 📋 **Table of Contents**

1. [Project Setup](#project-setup)
2. [Manual Testing](#manual-testing)
3. [Automated Testing](#automated-testing)
4. [API Testing](#api-testing)
5. [WebSocket Testing](#websocket-testing)
6. [Redux State Testing](#redux-state-testing)
7. [Component Testing](#component-testing)
8. [Integration Testing](#integration-testing)
9. [End-to-End Testing](#end-to-end-testing)
10. [Testing Checklist](#testing-checklist)

---

## 🚀 **Project Setup**

### **Prerequisites**

Before testing, ensure you have:

```bash
# Required software
Node.js >= 16.x
npm >= 8.x (or yarn >= 1.22.x)

# Check versions
node --version
npm --version
```

### **Step 1: Create package.json**

Since the project doesn't have a `package.json` file, create one in the root directory:

```bash
cd /home/user/ahmedmedra57
```

Create `package.json`:

```json
{
  "name": "umb-360-heating-control",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.3",
    "@reduxjs/toolkit": "^1.9.7",
    "redux-persist": "^6.0.0",
    "react-query": "^3.39.3",
    "axios": "^1.6.0",
    "socket.io-client": "^4.5.4",
    "styled-components": "^6.1.1",
    "react-i18next": "^13.5.0",
    "i18next": "^23.7.0",
    "i18next-browser-languagedetector": "^7.2.0",
    "lodash": "^4.17.21",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "@types/jest": "^29.5.10",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/index.js",
      "!src/test_data/**"
    ]
  }
}
```

### **Step 2: Install Dependencies**

```bash
npm install
# or
yarn install
```

### **Step 3: Create .env File**

Create `.env` in the root directory with API configuration:

```env
REACT_APP_BASE_URL=https://api.dev.umb-360.com
REACT_APP_SOCKET_URL=https://api.dev.umb-360.com
REACT_APP_AMAZON_S3_URL=https://s3.amazonaws.com
```

### **Step 4: Create public/index.html**

Create `public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="UMB-360 Heating Control Application" />
    <title>UMB-360 Control</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

### **Step 5: Run the Application**

```bash
npm start
# or
yarn start
```

The app should open at `http://localhost:3000`

---

## 🖱️ **Manual Testing**

### **1. Authentication Testing**

#### **Test Login Flow**

```
Test Case: Successful Login
─────────────────────────────────────────
1. Navigate to http://localhost:3000/login
2. Enter valid credentials:
   Email: test@example.com
   Password: ********
3. Click "Login" button

Expected Results:
✓ JWT token stored in localStorage
✓ Redirect to main dashboard
✓ User info visible in navigation
✓ Permissions loaded correctly
```

**Manual Test Steps:**

1. **Open Browser DevTools** (F12)
2. **Go to Application/Storage tab**
3. **Check localStorage:**
   ```javascript
   // In Console tab:
   localStorage.getItem('access_token')
   // Should return JWT token
   ```

4. **Check Redux State:**
   ```javascript
   // In Console (with Redux DevTools):
   window.__REDUX_DEVTOOLS_EXTENSION__;
   // Check state.userInfo
   ```

#### **Test Logout Flow**

```
Test Case: User Logout
─────────────────────────────────────────
1. Click user profile menu
2. Click "Logout" button

Expected Results:
✓ access_token removed from localStorage
✓ Redirect to /login page
✓ Redux state cleared
✓ WebSocket disconnected
```

**Validation:**
```javascript
// Should return null after logout
localStorage.getItem('access_token')
```

---

### **2. Device Control Testing**

#### **Test Temperature Setting**

```
Test Case: Set Instant Heat Temperature
─────────────────────────────────────────
Prerequisites:
- User logged in with ESS_CONTROL permission
- At least one ESS device available

Steps:
1. Navigate to device card
2. Find "Instant Heat" section
3. Enter temperature: 25°C
4. Click "Apply" button

Expected Results:
✓ UI shows "Ready to Apply" → "Applying" → "Activated"
✓ Current temperature displays correctly
✓ Set temperature shows 25°C
✓ WebSocket event received within 2 seconds
✓ Other connected clients see update
```

**Manual Verification:**

```javascript
// Open Browser Console
// Check Redux state
const state = store.getState();
const device = state.essSwitch.flatEssSwitch["location-id"]["device-mac"];
console.log(device.instantHeat);

// Expected output:
// {
//   inputTemp: 25,
//   isActivated: true,
//   isReady: false,
//   isF: false
// }
```

#### **Test Device Selection**

```
Test Case: Select Multiple Devices
─────────────────────────────────────────
Steps:
1. Open Master Control panel
2. Select location dropdown
3. Check "Boston East" (5 devices)
4. Verify all 5 devices show selected state

Expected Results:
✓ All device cards show selection indicator
✓ Master control shows "5 devices selected"
✓ Redux state updated for all devices
```

**State Validation:**
```javascript
// Check selection state
const state = store.getState();
const essSwitch = state.essSwitch.flatEssSwitch;

Object.keys(essSwitch["location-id"]).forEach(mac => {
  console.log(`${mac}: ${essSwitch["location-id"][mac].isSelected}`);
});
// All should be true
```

---

### **3. Real-time Updates Testing**

#### **Test WebSocket Connection**

```
Test Case: WebSocket Real-time Updates
─────────────────────────────────────────
Prerequisites:
- Two browser windows/tabs open
- Same user logged in both

Steps:
1. In Tab 1: Change temperature to 30°C
2. In Tab 2: Watch the same device card

Expected Results:
✓ Tab 1 shows immediate optimistic update
✓ Tab 2 receives WebSocket event within 2s
✓ Both tabs show same final state
✓ No UI flickering or race conditions
```

**Monitor WebSocket Events:**

```javascript
// In Browser Console, intercept socket events
const originalSocket = io;
io = function(...args) {
  const socket = originalSocket(...args);

  socket.on('switchAudit', (data) => {
    console.log('📡 WebSocket Event: switchAudit', data);
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket Connected');
  });

  socket.on('disconnect', () => {
    console.log('❌ WebSocket Disconnected');
  });

  return socket;
};
```

---

### **4. Navigation Testing**

```
Test Case: Navigate Between Pages
─────────────────────────────────────────
Pages to Test:
1. Landing Page → Login
2. Login → Dashboard
3. Dashboard → Settings
4. Settings → Device Control
5. Device Control → Telemetry/Reports
6. Back button behavior

Expected Results:
✓ No page refresh on navigation
✓ State persists across navigation
✓ Active route highlighted in menu
✓ Protected routes redirect to login
```

---

### **5. Language Switching Testing**

```
Test Case: Toggle Language (EN ↔ FR)
─────────────────────────────────────────
Steps:
1. Click language toggle in navigation
2. Observe all UI text changes

Expected Results:
✓ All labels switch to French
✓ Language preference saved to localStorage
✓ Temperature units preserved
✓ Page doesn't reload
✓ On refresh, language persists
```

**Verification:**
```javascript
localStorage.getItem('i18nextLng')
// Should return 'en' or 'fr'
```

---

### **6. Permissions Testing**

```
Test Case: Permission-Based UI Rendering
─────────────────────────────────────────
Test with different user roles:

Administrator:
✓ Can control all device types
✓ Can access Settings page
✓ Can view Admin panel
✓ Can update system configuration

Technician:
✓ Can control assigned devices
✓ Cannot access Admin panel
✓ Can view reports

Viewer:
✓ Can view all data
✓ Cannot control devices (buttons disabled)
✓ Cannot access Settings
```

---

## 🤖 **Automated Testing**

### **Setup Testing Framework**

#### **1. Install Testing Libraries**

Already included in package.json above. If not installed:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest
```

#### **2. Create Test Setup File**

Create `src/setupTests.js`:

```javascript
// Jest-dom adds custom matchers for asserting on DOM nodes
import '@testing-library/jest-dom';

// Mock environment variables
process.env.REACT_APP_BASE_URL = 'https://api.dev.umb-360.com';
process.env.REACT_APP_SOCKET_URL = 'https://api.dev.umb-360.com';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock socket.io-client
jest.mock('socket.io-client', () => {
  const mSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  };
  return jest.fn(() => mSocket);
});
```

---

### **Unit Tests Examples**

#### **Test 1: Redux Reducer**

Create `src/components/store/slices/__tests__/essSwitchSlice.test.js`:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import essSwitchReducer, {
  handleInstantHeatReady,
  handleEssSwitchSocket,
} from '../essSwitchSlice';

describe('essSwitchSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { essSwitch: essSwitchReducer },
      preloadedState: {
        essSwitch: {
          flatEssSwitch: {
            'test-location': {
              'AA:BB:CC:DD:EE:FF': {
                instantHeat: {
                  inputTemp: 0,
                  isReady: false,
                  isActivated: false,
                  isF: false,
                },
                currentTemp: 20,
                setTemp: null,
              },
            },
          },
        },
      },
    });
  });

  test('should handle instant heat ready', () => {
    // Dispatch action
    store.dispatch(
      handleInstantHeatReady({
        location: 'test-location',
        machine: 'AA:BB:CC:DD:EE:FF',
        temp: 25,
        isF: false,
      })
    );

    // Get updated state
    const state = store.getState().essSwitch;
    const device = state.flatEssSwitch['test-location']['AA:BB:CC:DD:EE:FF'];

    // Assertions
    expect(device.instantHeat.inputTemp).toBe(25);
    expect(device.instantHeat.isReady).toBe(true);
    expect(device.instantHeat.isActivated).toBe(false);
  });

  test('should handle WebSocket update', () => {
    // Mock WebSocket data
    const socketData = {
      device_mac: 'AA:BB:CC:DD:EE:FF',
      zoneInfo: { zone_id: 'test-location' },
      eventDeviceType: 'ESS',
      instantHeat: 30,
      currentTemp: 25,
      setTemp: 30,
      deviceStatus: 'ACTIVE',
    };

    // Dispatch socket action
    store.dispatch(
      handleEssSwitchSocket({
        data: socketData,
        isF: false,
      })
    );

    // Get updated state
    const state = store.getState().essSwitch;
    const device = state.flatEssSwitch['test-location']['AA:BB:CC:DD:EE:FF'];

    // Assertions
    expect(device.instantHeat.isActivated).toBe(true);
    expect(device.currentTemp).toBe(25);
    expect(device.setTemp).toBe(30);
  });
});
```

**Run the test:**
```bash
npm test essSwitchSlice.test.js
```

---

#### **Test 2: API Service**

Create `src/services/__tests__/sendCommand.service.test.js`:

```javascript
import axios from 'axios';
import { postEssCommand } from '../sendCommand.service';

jest.mock('axios');

describe('sendCommand.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('postEssCommand should send correct request', async () => {
    // Mock axios response
    const mockResponse = {
      data: {
        data: { success: true },
      },
    };
    axios.post.mockResolvedValue(mockResponse);

    // Call the service
    const result = await postEssCommand(
      'AA:BB:CC:DD:EE:FF',
      'instantHeat',
      25
    );

    // Assertions
    expect(axios.post).toHaveBeenCalledWith('/switches/send-command', {
      mac: 'AA:BB:CC:DD:EE:FF',
      instantHeat: 25,
    });
    expect(result).toEqual({ success: true });
  });

  test('postEssCommand should handle errors', async () => {
    // Mock axios error
    const mockError = {
      response: {
        data: { error: 'Device not found' },
      },
    };
    axios.post.mockRejectedValue(mockError);

    // Call the service and expect error
    await expect(
      postEssCommand('INVALID:MAC', 'instantHeat', 25)
    ).rejects.toEqual({ error: 'Device not found' });
  });
});
```

---

#### **Test 3: React Component**

Create `src/components/ui/__tests__/Button.test.js`:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders with correct variant class', () => {
    const { container } = render(<Button variant="primary">Test</Button>);
    const button = container.querySelector('button');

    expect(button).toHaveClass('variant-primary');
  });

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');

    expect(button).toBeDisabled();
  });
});
```

---

#### **Test 4: Custom Hook**

Create `src/hooks/__tests__/useSocket.test.js`:

```javascript
import { renderHook } from '@testing-library/react';
import { useSocket } from '../useSocket';
import io from 'socket.io-client';

jest.mock('socket.io-client');

describe('useSocket Hook', () => {
  test('establishes socket connection with correct config', () => {
    const mockSocket = {
      on: jest.fn(),
      disconnect: jest.fn(),
    };
    io.mockReturnValue(mockSocket);

    renderHook(() => useSocket('user-123', 'test-token'));

    // Verify socket was initialized
    expect(io).toHaveBeenCalledWith('https://api.dev.umb-360.com', {
      query: { room: 'user-123' },
    });

    // Verify event listeners registered
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('switchAudit', expect.any(Function));
  });
});
```

---

### **Run All Tests**

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test Button.test.js

# Run tests in watch mode
npm test -- --watch
```

---

## 🌐 **API Testing**

### **Using Postman**

#### **1. Import Postman Collection**

Create a Postman collection with these endpoints:

**Collection: UMB-360 API**

**Environment Variables:**
```
base_url: https://api.dev.umb-360.com
access_token: <your_jwt_token>
```

#### **2. Authentication Endpoints**

**POST /login**
```
URL: {{base_url}}/login
Method: POST
Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "email": "test@example.com",
  "password": "your_password"
}

Tests:
pm.test("Status is 200", () => {
  pm.response.to.have.status(200);
});

pm.test("Returns access token", () => {
  const response = pm.response.json();
  pm.expect(response).to.have.property('access_token');
  pm.environment.set('access_token', response.access_token);
});
```

#### **3. Device Control Endpoints**

**POST /switches/send-command**
```
URL: {{base_url}}/switches/send-command
Method: POST
Headers:
  Authorization: Bearer {{access_token}}
  Content-Type: application/json

Body (raw JSON):
{
  "mac": "AA:BB:CC:DD:EE:FF",
  "instantHeat": 25
}

Tests:
pm.test("Command sent successfully", () => {
  pm.response.to.have.status(200);
});

pm.test("Response has success status", () => {
  const response = pm.response.json();
  pm.expect(response.status).to.eql('success');
});
```

#### **4. Get Zones**

**GET /get-zones/switches**
```
URL: {{base_url}}/get-zones/switches
Method: GET
Headers:
  Authorization: Bearer {{access_token}}

Tests:
pm.test("Returns zones data", () => {
  const response = pm.response.json();
  pm.expect(response).to.be.an('object');
});

pm.test("Each zone has required properties", () => {
  const response = pm.response.json();
  const firstZone = Object.values(response)[0];
  pm.expect(firstZone).to.have.property('zone_id');
  pm.expect(firstZone).to.have.property('zone_name');
  pm.expect(firstZone).to.have.property('devices');
});
```

---

### **Using cURL**

```bash
# Login
curl -X POST https://api.dev.umb-360.com/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "your_password"
  }'

# Save the access_token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get user profile
curl -X GET https://api.dev.umb-360.com/me \
  -H "Authorization: Bearer $TOKEN"

# Get ESS zones
curl -X GET https://api.dev.umb-360.com/get-zones/switches \
  -H "Authorization: Bearer $TOKEN"

# Send device command
curl -X POST https://api.dev.umb-360.com/switches/send-command \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mac": "AA:BB:CC:DD:EE:FF",
    "instantHeat": 25
  }'

# Master control
curl -X POST https://api.dev.umb-360.com/switches/master-control \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceIds": ["AA:BB:CC:DD:EE:FF", "BB:CC:DD:EE:FF:00"],
    "deviceType": "ESS",
    "instantHeat": 30
  }'
```

---

## 🔌 **WebSocket Testing**

### **Using Browser Console**

```javascript
// Connect to WebSocket
const io = require('socket.io-client');
const socket = io('https://api.dev.umb-360.com', {
  query: { room: 'user-123' }
});

// Listen for connection
socket.on('connect', () => {
  console.log('✅ Connected to WebSocket');
  console.log('Socket ID:', socket.id);
});

// Listen for device updates
socket.on('switchAudit', (data) => {
  console.log('📡 Device Update:', data);
  console.table({
    'Device MAC': data.device_mac,
    'Location': data.zoneInfo.zone_id,
    'Current Temp': data.currentTemp,
    'Set Temp': data.setTemp,
    'Status': data.deviceStatus
  });
});

// Listen for errors
socket.on('connect_error', (error) => {
  console.error('❌ Connection Error:', error);
});

// Disconnect
socket.disconnect();
```

### **Using Socket.io Test Tool**

Install globally:
```bash
npm install -g socket.io-client
```

Create test script `test-socket.js`:

```javascript
const io = require('socket.io-client');

const socket = io('https://api.dev.umb-360.com', {
  query: { room: 'user-123' }
});

socket.on('connect', () => {
  console.log('✅ Connected');
});

socket.on('switchAudit', (data) => {
  console.log('📡 switchAudit:', JSON.stringify(data, null, 2));
});

socket.on('blowerAudit', (data) => {
  console.log('📡 blowerAudit:', JSON.stringify(data, null, 2));
});

socket.on('ssrUpdate', (data) => {
  console.log('📡 ssrUpdate:', JSON.stringify(data, null, 2));
});

// Keep running
process.on('SIGINT', () => {
  socket.disconnect();
  process.exit();
});
```

Run:
```bash
node test-socket.js
```

---

## 📊 **Redux State Testing**

### **Using Redux DevTools**

#### **1. Install Redux DevTools Extension**

- Chrome: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)
- Firefox: [Redux DevTools](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

#### **2. Inspect State**

1. Open DevTools (F12)
2. Click "Redux" tab
3. View state tree on right panel
4. Click actions on left to see dispatched actions

#### **3. Time Travel Debugging**

- Slider at bottom lets you replay actions
- Click any action to see state at that point
- Export/Import state for testing

#### **4. Manual State Inspection**

```javascript
// In browser console
const state = store.getState();

// Check user info
console.log(state.userInfo);

// Check device state
console.log(state.essSwitch.flatEssSwitch['location-id']['device-mac']);

// Check locations
console.log(state.locations.ess);

// Check selections
console.log(state.masterControlSelect);
```

---

## 🧩 **Component Testing**

### **React Testing Library Examples**

#### **Test Connected Component (with Redux)**

Create `src/components/__tests__/DeviceCard.test.js`:

```javascript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DeviceCard from '../DeviceCard';
import essSwitchReducer from '../../store/slices/essSwitchSlice';

const renderWithRedux = (
  component,
  {
    preloadedState,
    store = configureStore({
      reducer: { essSwitch: essSwitchReducer },
      preloadedState,
    }),
  } = {}
) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('DeviceCard', () => {
  const mockDevice = {
    deviceMac: 'AA:BB:CC:DD:EE:FF',
    deviceStatus: 'ACTIVE',
    currentTemp: 22,
    setTemp: 25,
    instantHeat: {
      inputTemp: 25,
      isActivated: true,
    },
  };

  test('displays device information correctly', () => {
    renderWithRedux(<DeviceCard device={mockDevice} />, {
      preloadedState: {
        essSwitch: {
          flatEssSwitch: {
            'test-location': {
              'AA:BB:CC:DD:EE:FF': mockDevice,
            },
          },
        },
      },
    });

    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getByText('25°C')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });
});
```

---

## 🔗 **Integration Testing**

### **Test Complete User Flow**

Create `src/__tests__/integration/deviceControl.test.js`:

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from '../../components/store/store';
import App from '../../App';
import axios from 'axios';

jest.mock('axios');

describe('Device Control Integration Test', () => {
  test('complete flow: login → select device → set temperature', async () => {
    const user = userEvent.setup();

    // Mock login API
    axios.post.mockResolvedValueOnce({
      data: {
        access_token: 'test-token',
        user: { email: 'test@example.com' },
      },
    });

    // Mock get zones API
    axios.get.mockResolvedValueOnce({
      data: {
        'test-zone': {
          zone_id: 'test-zone',
          devices: [
            {
              device_mac: 'AA:BB:CC:DD:EE:FF',
              currentTemp: 20,
            },
          ],
        },
      },
    });

    // Mock send command API
    axios.post.mockResolvedValueOnce({
      data: { status: 'success' },
    });

    // Render app
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Step 1: Login
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /login/i }));

    // Step 2: Wait for dashboard
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    // Step 3: Find device card
    const deviceCard = await screen.findByText('AA:BB:CC:DD:EE:FF');
    expect(deviceCard).toBeInTheDocument();

    // Step 4: Set temperature
    const tempInput = screen.getByPlaceholderText(/temperature/i);
    await user.clear(tempInput);
    await user.type(tempInput, '25');
    await user.click(screen.getByRole('button', { name: /apply/i }));

    // Step 5: Verify API called
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/switches/send-command',
        expect.objectContaining({
          mac: 'AA:BB:CC:DD:EE:FF',
          instantHeat: 25,
        })
      );
    });
  });
});
```

---

## 🎭 **End-to-End Testing**

### **Using Cypress**

#### **1. Install Cypress**

```bash
npm install --save-dev cypress
```

#### **2. Configure Cypress**

Create `cypress.config.js`:

```javascript
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
};
```

#### **3. Create E2E Test**

Create `cypress/e2e/device-control.cy.js`:

```javascript
describe('Device Control E2E', () => {
  beforeEach(() => {
    // Visit login page
    cy.visit('/login');
  });

  it('should login and control device', () => {
    // Login
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Boston East').should('be.visible');

    // Find device card
    cy.contains('ESS Unit 1').click();

    // Set temperature
    cy.get('input[placeholder*="temperature"]').clear().type('25');
    cy.contains('button', 'Apply').click();

    // Verify success message
    cy.contains('Temperature updated successfully').should('be.visible');

    // Verify UI update
    cy.contains('25°C').should('be.visible');
    cy.contains('Activated').should('be.visible');
  });

  it('should handle master control', () => {
    // Login
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Open master control
    cy.contains('Master Control').click();

    // Select location
    cy.get('select[name="location"]').select('Boston East');

    // Configure setting
    cy.get('input[name="instantHeat"]').type('30');

    // Apply to all
    cy.contains('button', 'Apply to All').click();

    // Verify success
    cy.contains('5 devices updated').should('be.visible');
  });
});
```

#### **4. Run Cypress Tests**

```bash
# Open Cypress UI
npx cypress open

# Run headless
npx cypress run
```

---

## ✅ **Testing Checklist**

### **Functional Testing**

- [ ] **Authentication**
  - [ ] Login with valid credentials
  - [ ] Login with invalid credentials
  - [ ] Logout functionality
  - [ ] Token expiration handling
  - [ ] Password reset flow

- [ ] **Device Control**
  - [ ] Set instant heat temperature
  - [ ] Activate/deactivate snow sensor
  - [ ] Enable/disable wind factor
  - [ ] Set optional constant temperature
  - [ ] Add heating schedule
  - [ ] Clear heating schedule
  - [ ] Control SSR states

- [ ] **Master Control**
  - [ ] Select multiple devices
  - [ ] Apply batch settings
  - [ ] Verify all devices updated
  - [ ] Handle partial failures

- [ ] **Real-time Updates**
  - [ ] WebSocket connection established
  - [ ] Device updates received
  - [ ] Multiple clients synchronized
  - [ ] Reconnection after disconnect

- [ ] **Navigation**
  - [ ] All routes accessible
  - [ ] Protected routes redirect
  - [ ] Back/forward buttons work
  - [ ] Deep linking works

- [ ] **Language Switching**
  - [ ] Toggle EN ↔ FR
  - [ ] Persistence after refresh
  - [ ] All labels translated

- [ ] **Permissions**
  - [ ] Admin can access everything
  - [ ] Technician limited access
  - [ ] Viewer read-only
  - [ ] Unauthorized actions blocked

### **Non-Functional Testing**

- [ ] **Performance**
  - [ ] Page load < 3 seconds
  - [ ] API calls < 500ms
  - [ ] WebSocket latency < 100ms
  - [ ] Smooth scrolling

- [ ] **Usability**
  - [ ] Intuitive navigation
  - [ ] Clear error messages
  - [ ] Loading indicators
  - [ ] Responsive design

- [ ] **Security**
  - [ ] JWT tokens secure
  - [ ] No sensitive data in localStorage
  - [ ] HTTPS enforced
  - [ ] XSS prevention

- [ ] **Compatibility**
  - [ ] Chrome latest
  - [ ] Firefox latest
  - [ ] Safari latest
  - [ ] Edge latest
  - [ ] Mobile browsers

---

## 📝 **Test Reporting**

### **Generate Coverage Report**

```bash
npm test -- --coverage --watchAll=false
```

**Expected Output:**
```
---------------------|---------|----------|---------|---------|-------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------|---------|----------|---------|---------|-------------------
All files            |   85.2  |   78.4   |   82.1  |   85.7  |
 components          |   92.3  |   87.5   |   91.2  |   92.8  |
 services            |   88.5  |   82.1   |   85.4  |   89.2  |
 store/slices        |   81.2  |   74.3   |   78.9  |   81.8  |
---------------------|---------|----------|---------|---------|-------------------
```

### **Coverage Goals**

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

---

## 🎯 **Quick Test Commands**

```bash
# Start development server
npm start

# Run all unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test Button.test.js

# Run E2E tests
npx cypress open

# Build for production
npm run build

# Serve production build
npx serve -s build
```

---

## 📚 **Additional Resources**

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Cypress Documentation](https://docs.cypress.io/)
- [Redux Testing Guide](https://redux.js.org/usage/writing-tests)
- [Postman Learning Center](https://learning.postman.com/)

---

**Testing Status:** Ready to implement
**Priority:** High (ensures code quality)
**Next Steps:** Set up project and start with manual testing

---

**End of Testing Guide**
