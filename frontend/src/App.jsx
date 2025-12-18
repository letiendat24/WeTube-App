import AppRoutes from "./components/AppRoutes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { Provider as ReduxProvider } from "react-redux";

import "./index.css";
import { store } from "@/store/store";
function App() {
  return (
    <ReduxProvider store={ store }>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ReduxProvider>
  );
}

export default App;
