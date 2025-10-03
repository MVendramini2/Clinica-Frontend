import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import ReservaForm from "./Pages/ReservaForm";
import ReservaPaso2 from "./Pages/ReservaFormHorarios";
import { ScrollToTop } from "./components/ScrollToTop";
import AreaMedica from "./Pages/AreaMedica";
import PanelAdministrativo from "./Pages/PanelAdministrativo";


export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />               
        <Route path="/reservar-cita" element={<ReservaForm />} />    
        <Route path="/reservar-fecha" element={<ReservaPaso2 />} />
        <Route path="/inicio-sesion-area-medica" element={<AreaMedica />} />
        <Route path="/panel-administrativo" element={<PanelAdministrativo />} />
      </Routes>
    </Router>
  );
}
    