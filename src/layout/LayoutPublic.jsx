import { Outlet, useLocation } from "react-router-dom";
import Navbar from '../components/Navbar';
import estateHubLogo from "../assets/estateHubLogoFullWhite.png";

const LayoutPublic = () => {

  const location = useLocation();
  const hideNavbarRoutes = ["/", "/register"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!shouldHideNavbar && (
        <footer className="bg-[#101828] text-white py-12 border-t border-[#344054]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <img
                  src={estateHubLogo}
                  alt="EstateHubLogo"
                  className="w-50 drop-shadow-lg animate-fadeIn"
                />
              </div>

              <div className="text-[#98A2B3] text-center md:text-right">
                <p>&copy; 2024 EstateHub. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default LayoutPublic;
