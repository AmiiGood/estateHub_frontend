import { Outlet, useLocation } from "react-router-dom";
import Navbar from '../components/Navbar';

const LayoutPublic = () => {

  const location = useLocation();
  const hideNavbarRoutes = ["/", "/register"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main className="container">
        <Outlet />
      </main>
      {!shouldHideNavbar && (
      <footer className="bg-[#101828] text-white py-12 border-t border-[#344054]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className="text-white font-bold text-xl">Estate Hub</span>
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
