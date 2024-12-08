import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { Provider } from "react-redux";
import Dashboard from "./Components/Dashboard";
import Home from "./pages/Home";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BuildType, OktoProvider } from "okto-sdk-react";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const OKTO_CLIENT_API = process.env.REACT_APP_CLIENT_API_KEY;
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <OktoProvider apiKey={OKTO_CLIENT_API || ""} buildType={BuildType.SANDBOX}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <Routes>
                {/* <Route path="/" element={<App />} /> */}
                <Route path="/" element={<Dashboard children={<Home />} />} />
              </Routes>
            </Router>
          </PersistGate>
        </Provider>
      </GoogleOAuthProvider>
    </OktoProvider>
  </React.StrictMode>
);

reportWebVitals();
