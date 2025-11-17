import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleEssSwitch,
  selectEssSwitch,
} from './components/store/slices/essSwitchSlice';
import {
  handleTgsSwitch,
  selectTgsSwitch,
} from './components/store/slices/tgsSwitchSlice';
import {
  handleTesSwitch,
  selectTesSwitch,
} from './components/store/slices/tesSwitchSlice';
import { useEffect, useState } from 'react';
import {
  handleEssInitialState,
  handleOpenMasterControl,
  handleTesInitialState,
  handleTgsInitialState,
  setOpenLocationInitialStateHandler,
  setOpenSpecificLocationInitialStateHandler,
} from './components/store/slices/MCIsExpandedSlice';
import {
  handleAccessToken,
  handleAllUsers,
  selectUserInfo,
} from './components/store/slices/userSlice';
import { useMediaQuery } from 'react-responsive';
import styled, { css } from 'styled-components';

import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  scrollbarX,
  scrollbarY,
} from './components/styles/commonStyles';
import Footer from './components/Footer';
import Header from './components/Header';
import Sidebar from './components/sidebar/Sidebar';
import GlobalOverviewMain from './components/globalOverview/GlobalOverViewMain';
import TelemetryMain from './components/telemetry/TelemetryMain';
import EssMain from './components/ess/EssMain';
import TgsMain from './components/tgs/TgsMain';
import TesMain from './components/tes/TesMain';
import HeatingPlatformMain from './components/heatingPlatform';
import SettingsMain from './components/settings/SettingsMain';
import AuditTrailMain from './components/auditTrail/AuditTrailMain';
import FaultsMain from './components/faults/FaultsMain';
import ReportStatusMain from './components/reportStatus/ReportStatusMain';
import MasterControlMain from './components/masterControl/MasterControlMain';
import MobileMain from './components/mobileMain/MobileMain';
import MainLoadingPage from './components/loading/MainLoadingPage';
import MobileMasterControl from './components/masterControl/MobileMasterControl';
import { useQuery } from 'react-query';
import {
  getAllUsers,
  getEssZones,
  getTesZones,
  getTgsZones,
  getUserProfileDataService,
  logoutService,
} from './services';
import {
  handleEssLocation,
  handleSysLocation,
  handleTesLocation,
  handleTgsLocation,
} from './components/store/slices/locationsSlice';
import {
  handleEssFaults,
  handleMessagesFaults,
  handleTesFaults,
  handleTgsFaults,
} from './components/store/slices/FaultsSlice';
import {
  handleEssFCSelect,
  handleTesFCSelect,
  handleTgsFCSelect,
  handleSysFCSelect,
} from './components/store/slices/settings/forceAndCommandsSlice';
import { useSetZoneOpeningsState, useSocket } from './hooks';
import {
  handleUnitSelection,
  selectUnits,
} from './components/store/slices/settings/unitsSlice';
import { createBrowserHistory } from 'history';
import qs from 'qs';
import HomePage from './components/landingPage/HomePage';
import {
  handleEssAdminSelect,
  handleSysAdminSelect,
  handleTesAdminSelect,
  handleTgsAdminSelect,
} from './components/store/slices/settings/admin/adminSlice';
import { handleEssDataConsumptionLocation } from './components/store/slices/essDataConsumptionSlice';
import { handleTgsDataConsumptionLocation } from './components/store/slices/tgsDataConsumptionSlice';
import { handleTesDataConsumptionLocation } from './components/store/slices/tesDataConsumptionSlice';
import EssTgsTesProvider from './components/context/contextOfEssTgsTes';
import testData from './test_data/testData';
import { getSpecLocationHandler } from './helpers/helpers';
import GeneralProvider from './components/context/contextOfGeneral';
import LandingPage from './components/newLandingPage/LandingPage';

const MainPage = () => {
  useEffect(()=>{
    const user= async ()=>{
       try{
         const users= await getUserProfileDataService();
         users.forEach(user =>{
         })
       }catch(error){
       }
    }
  },[])
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const isTablet = useMediaQuery({ query: '(max-width:1366px)' });
 
  const userInfo = useSelector(selectUserInfo);
  const { isEssSwitch, isTesSwitch, isTgsSwitch, accessToken, user } = userInfo;

  const { essSwitch: essSwitches, flatEssSwitch } =
    useSelector(selectEssSwitch);
  const { tgsSwitch: tgsSwitches, flatTgsSwitch } =
    useSelector(selectTgsSwitch);
  const { tesSwitch: tesSwitches, flatTesSwitch } =
    useSelector(selectTesSwitch);
  const unitsStatus = useSelector(selectUnits);
  const { isF } = unitsStatus;
  const dispatch = useDispatch();
  const storedAccessToken = localStorage.getItem('access_token');

  // start handle logout after 15 minutes of inactivity
  let timer = null;

  const startTimer = () => {
    timer = setTimeout(() => {
      logoutService().then(() => {
        localStorage.removeItem('access_token');
        dispatch(handleAccessToken(null));
      });
    }, 15 * 60 * 1000);
  };

  const resetTimer = () => {
    clearTimeout(timer);
    startTimer();
  };

  useEffect(() => {
    if (accessToken) {
      startTimer();
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keydown', resetTimer);
      };
    }
  }, [accessToken]);
  // end handle logout after 15 minutes of inactivity

  useSocket(user.user_id, accessToken);

  useEffect(() => {
    if (storedAccessToken) {
      dispatch(handleAccessToken(storedAccessToken));
      dispatch(getUserProfileDataService());
      getAllUsers().then((data) => {
        dispatch(handleAllUsers(data));
      });
    }
  }, [dispatch, storedAccessToken]);

  // !!TEST DATA
  // const { testEssSwitch, testTgsSwitch, testTesSwitch } = testData(
  //   essSwitches,
  //   tgsSwitches,
  //   null,
  //   tesSwitches
  // );


  // !! END OF TEST DATA

  useEffect(() => {
    let choosenUnit = user?.temperature_unit === 'f' ? 0 : 1;
    dispatch(handleUnitSelection(choosenUnit));
  }, [user, user.temperature_unit]);

  useEffect(() => {
    dispatch(
      handleMessagesFaults({ flatEssSwitch, flatTgsSwitch, flatTesSwitch })
    );
  }, [flatEssSwitch, flatTgsSwitch, flatTesSwitch]);

  useSetZoneOpeningsState(essSwitches, isEssSwitch, null, 'ess', true);
  useSetZoneOpeningsState(tgsSwitches, isTgsSwitch, null, 'tgs', true);
  useSetZoneOpeningsState(tesSwitches, isTesSwitch, null, 'tes', true);

  useEffect(() => {
    if (isMobile) {
      if (isEssSwitch) {
        dispatch(handleOpenMasterControl({ swtName: 'ess', status: false }));
      }
      if (isTgsSwitch) {
        dispatch(handleOpenMasterControl({ swtName: 'tgs', status: false }));
      }
      if (isTesSwitch) {
        dispatch(handleOpenMasterControl({ swtName: 'tes', status: false }));
      }
    }
  }, []);

  // const dispatchFCHandler = (swtData, swtSystem) => {
  //   //  set initial state for isLocationOpen: []
  //   const locations = Object.keys(swtData).map((_) => false);
  //   dispatch(setOpenLocationInitialStateHandler({ locations, swtSystem }));

  //   //  set initial state for isSpecificLocationOpen: []
  //   const specLocationArr = getSpecLocationHandler(swtData).map((_) => false);
  //   dispatch(
  //     setOpenSpecificLocationInitialStateHandler({
  //       specificLocations: specLocationArr,
  //       swtSystem,
  //     })
  //   );

  //   isMobile &&
  //     dispatch(handleOpenMasterControl({ swtName: swtSystem, status: false }));
  // };

  // useEffect(() => {
  //   if (isEssSwitch) {
  //     // dispatchFCHandler(essSwitches, 'ess');
  //     // !!TEST
  //     dispatchFCHandler(testEssSwitch, 'ess');
  //     // !!END
  //   } else {
  //     dispatch(handleOpenMasterControl({ swtName: 'ess', status: false }));
  //   }
  //   if (isTgsSwitch) {
  //     // dispatchFCHandler(tgsSwitches, 'tgs');
  //     // !!TEST
  //     dispatchFCHandler(testTgsSwitch, 'tgs');
  //     // !!END
  //   } else {
  //     dispatch(handleOpenMasterControl({ swtName: 'tgs', status: false }));
  //   }
  //   if (isTesSwitch) {
  //     // dispatchFCHandler(tesSwitches, 'tes');
  //     // !!TEST
  //     dispatchFCHandler(testTesSwitch, 'tes');
  //     // !!END
  //   } else {
  //     dispatch(handleOpenMasterControl({ swtName: 'tes', status: false }));
  //   }
  // }, [
  //   isEssSwitch,
  //   isTgsSwitch,
  //   isTesSwitch,
  //   isMobile,
  //   testTesSwitch,
  //   testTgsSwitch,
  //   testEssSwitch,
  //   dispatch,
  // ]);

  // useEffect(() => {
  //   if (isEssSwitch) {

  //     const locationEss = Object.keys(essSwitches).map((location) => false);
  //     dispatch(handleEssInitialState(locationEss));
  //     isMobile &&
  //       dispatch(handleOpenMasterControl({ swtName: 'ess', status: false }));
  //   } else {
  //     dispatch(handleOpenMasterControl({ swtName: 'ess', status: false }));
  //   }

  //   if (isTgsSwitch) {
  //     const locationTgs = Object.keys(tgsSwitches).map((location) => false);
  //     dispatch(handleTgsInitialState(locationTgs));
  //     isMobile &&
  //       dispatch(handleOpenMasterControl({ swtName: 'tgs', status: false }));
  //   } else {
  //     dispatch(handleOpenMasterControl({ swtName: 'tgs', status: false }));
  //   }

  //   if (isTesSwitch) {
  //     const locationTes = Object.keys(tesSwitches).map((location) => false);
  //     dispatch(handleTesInitialState(locationTes));
  //     isMobile &&
  //       dispatch(handleOpenMasterControl({ swtName: 'tes', status: false }));
  //   } else {
  //     dispatch(handleOpenMasterControl({ swtName: 'tes', status: false }));
  //   }
  // }, [isEssSwitch, isTgsSwitch, isTesSwitch, isMobile, dispatch]);

  // fetch zones from backend use react query
  const {
    data: essZones,
    isLoading: essZonesLoading,
    refetch: essRefetch,
  } = useQuery('essZones', () => getEssZones({ structured: true }), {
    enabled: !!accessToken,
    staleTime: Infinity,
  });
  const {
    data: tgsZones,
    isLoading: tgsZonesLoading,
    refetch: tgsRefetch,
  } = useQuery('tgsZones', () => getTgsZones({ structured: true }), {
    enabled: !!accessToken,
    staleTime: Infinity,
  });
  const {
    data: tesZones,
    isLoading: tesZonesLoading,
    refetch: tesRefetch,
  } = useQuery('tesZones', () => getTesZones({ structured: true }), {
    enabled: !!accessToken,
    staleTime: Infinity,
  });
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    if (
      (essZonesLoading || tgsZonesLoading || tesZonesLoading) &&
      accessToken
    ) {
      setIsDataLoading(true);
    } else {
      setIsDataLoading(false);
    }
  }, [essZonesLoading, tgsZonesLoading, tesZonesLoading, accessToken]);

  useEffect(() => {
    if (essZones) {
      dispatch(handleEssSwitch({ essZones, isF }));
      dispatch(handleEssLocation(essZones));
      dispatch(handleEssFaults(essZones));
      dispatch(handleEssFCSelect(essZones));
      dispatch(handleEssAdminSelect(essZones));
      dispatch(handleEssDataConsumptionLocation(essZones));
    }
    if (tgsZones) {
      dispatch(handleTgsSwitch({ tgsZones, isF }));
      dispatch(handleTgsLocation(tgsZones));
      dispatch(handleTgsFaults(tgsZones));
      dispatch(handleTgsFCSelect(tgsZones));
      dispatch(handleTgsAdminSelect(tgsZones));
      dispatch(handleTgsDataConsumptionLocation(tgsZones));
    }
    if (tesZones) {
      dispatch(handleTesSwitch({ tesZones, isF }));
      dispatch(handleTesLocation(tesZones));
      dispatch(handleTesFaults(tesZones));
      dispatch(handleTesFCSelect(tesZones));
      dispatch(handleTesAdminSelect(tesZones));
      dispatch(handleTesDataConsumptionLocation(tesZones));
    }
    if (essZones && tgsZones && tesZones) {
      dispatch(handleSysLocation([ ...tesZones, ...tgsZones, ...essZones]));
      dispatch(handleSysFCSelect([...tesZones, ...tgsZones, ...essZones]));
      dispatch(handleSysAdminSelect([...tesZones, ...tgsZones, ...essZones]));
    }
  }, [essZones, tgsZones, tesZones, isF]);

  useEffect(() => {
    if (!essZones && accessToken) {
      essRefetch();
    }
    if (!tgsZones && accessToken) {
      tgsRefetch();
    }
    if (!tesZones && accessToken) {
      tesRefetch();
    }
  }, [
    essZones,
    tgsZones,
    tesZones,
    accessToken,
    essRefetch,
    tgsRefetch,
    tesRefetch,
  ]);
  const [savedPrevParam, setSavedPrevParam] = useState('');
  const history = createBrowserHistory();
  useEffect(() => {
    const filterParams = history.location.search.substr(1);
    const filtersFromParams = qs.parse(filterParams);

    if (filtersFromParams.path) {
      setSavedPrevParam(filtersFromParams.path);
    }
  }, []);

  if (isDataLoading) {
    return (
      <LoadingWrapper>
        <MainLoadingPage />
      </LoadingWrapper>
    );
  }

  return (
    <BrowserRouter>
      {isMobile ? (
        accessToken || storedAccessToken ? (
          <MobileWrapper>
            <GeneralProvider>
              <Header />
              <MobileMainContentsWrapper>
                <EssTgsTesProvider>
                  <Routes>
                    <Route path='/' element={<MobileMain />} />
                    <Route path='ess' element={<EssMain />} />
                    <Route path='tgs' element={<TgsMain />} />
                    <Route path='tes' element={<TesMain />} />

                    <Route
                      path='masterControl'
                      element={<MobileMasterControl />}
                    />
                    <Route path='telemetry' element={<TelemetryMain />} />

                    <Route
                      path='heatingPlatform'
                      element={<HeatingPlatformMain />}
                    />

                    <Route
                      path='settings'
                      element={
                        <SettingsMain
                          essRefetch={essRefetch}
                          tgsRefetch={tgsRefetch}
                          tesRefetch={tesRefetch}
                        />
                      }
                    />
                    <Route path='faults' element={<FaultsMain />} />
                    <Route path='reportStatus' element={<ReportStatusMain />} />
                  </Routes>
                </EssTgsTesProvider>
              </MobileMainContentsWrapper>
              <Footer />
            </GeneralProvider>
          </MobileWrapper>
        ) : (
          <Wrapper>
            <Routes>
              <Route path='/login' element={<HomePage />} />
              <Route path='/login/fr' element={<HomePage />} />
              <Route path='*' element={<Navigate to='/login' />} />
            </Routes>
          </Wrapper>
        )
      ) : accessToken || storedAccessToken ? (
        <MainWrapper isTablet={isTablet}>
          <GeneralProvider>
            <Wrapper>
              <Header />
              <Title src={'/images/embrellaTitle-sm.svg'} />
              <MainContentsWrapper>
                <Sidebar />
                <EssTgsTesProvider>
                  <Routes>
                    <Route path='/' element={<GlobalOverviewMain />} />

                    <Route path='/telemetry' element={<TelemetryMain />} />
                    <Route
                      path='masterControl'
                      element={<MasterControlMain />}
                    />

                    <Route path='ess' element={<EssMain />} />
                    <Route path='tgs' element={<TgsMain />} />
                    <Route path='tes' element={<TesMain />} />

                    <Route
                      path='heatingPlatform'
                      element={<HeatingPlatformMain />}
                    />
                    <Route
                      path='settings'
                      element={
                        <SettingsMain
                          essRefetch={essRefetch}
                          tgsRefetch={tgsRefetch}
                          tesRefetch={tesRefetch}
                        />
                      }
                    />
                    <Route path='auditTrail' element={<AuditTrailMain />} />
                    <Route path='faults' element={<FaultsMain />} />
                    <Route path='reportStatus' element={<ReportStatusMain />} />
                    <Route
                      path='*'
                      element={<Navigate to={savedPrevParam} />}
                    />
                  </Routes>
                </EssTgsTesProvider>
              </MainContentsWrapper>
              <Footer />
            </Wrapper>
          </GeneralProvider>
        </MainWrapper>
      ) : (
        <Wrapper>
          <Routes>
            <Route path='/login' element={<HomePage />} />
            <Route path='/login/fr' element={<HomePage />} />
            <Route path='*' element={<Navigate to='/login' />} />
          </Routes>
        </Wrapper>
      )}
    </BrowserRouter>
  );
};

export default MainPage;

const MainWrapper = styled.div`
  ${({ isTablet }) =>
    isTablet
      ? css`
          width: 100%;
          height: 100%;
          ${scrollbarX}
        `
      : css`
          ${flexBoxCenter}
        `}
`;

const Wrapper = styled.div`
  width: 1366px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 10rem 20rem;
  padding-top: 0;
`;

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  z-index: 1000;
`;

const Title = styled.img`
  margin: 5rem 0;
`;

const MainContentsWrapper = styled.div`
  width: 100%;
  height: auto;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  margin: 5rem 0;
`;

const MobileWrapper = styled.div`
  width: 332px;
  ${justifyContentFlexStart}
  flex-direction: column;
`;

const MobileMainContentsWrapper = styled.div``;
