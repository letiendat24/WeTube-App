import AppRoutes from "./components/AppRoutes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
// import "./styles/main.scss"
import "./index.css";
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
