import { Provider } from "react-redux";
import styled from "styled-components";
import store from "./components/store/store";
import GlobalStyle from "./components/styles/GlobalStyles";
import MainPage from "./Mainpage";
import { QueryClientProvider, QueryClient } from "react-query";
import "./axiosConfig";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { AutoLogoutProvider } from "./providers";

const queryClient = new QueryClient({});
// let persistor = persistStore(store);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Wrapper>
        <GlobalStyle />
        <Provider store={store}>
          {/* <PersistGate persistor={persistor}> */}
          <AutoLogoutProvider>
            <MainPage />
          </AutoLogoutProvider>
          {/* </PersistGate> */}
        </Provider>
      </Wrapper>
    </QueryClientProvider>
  );
}

export default App;

const Wrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  background: transparent linear-gradient(90deg, #233a54 0%, #060d19 100%);
  display: flex;
  justify-content: center;
  /* align-items: center; */
`;
