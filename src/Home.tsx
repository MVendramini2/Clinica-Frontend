import Header from "./Landing Page/Header";
import Inicio from "./Landing Page/sections/Inicio";
import Servicios from "./Landing Page/sections/Servicios";
import Formacion from "./Landing Page/sections/Formacion";
import Contacto from "./Landing Page/sections/Contacto";
import Footer from "./Landing Page/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Inicio />
        <Servicios />
        <Formacion />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}