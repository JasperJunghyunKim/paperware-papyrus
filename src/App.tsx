import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "@/pages/Home";
import Invoice from "@/pages/Invoice";
import Login from "@/pages/Login";

import "@/App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

setupIonicReact();

const queryClient = new QueryClient();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <QueryClientProvider client={queryClient}>
        <IonRouterOutlet>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/invoice">
            <Invoice />
          </Route>
          <Route exact path="/">
            <Redirect to="/invoice" />
          </Route>
        </IonRouterOutlet>
      </QueryClientProvider>
    </IonReactRouter>
  </IonApp>
);

export default App;
