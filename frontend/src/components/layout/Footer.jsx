import { NavLink } from "react-router-dom";
import "../../styles/Footer.css";
import dishineLogo from "../../assets/Dishine Logo.png";
import instagramLogo from "../../assets/Instagram.png";
import tiktokLogo from "../../assets/tiktoklogo.png";
import shopeelogo from "../../assets/shopeelogo.png";

function Footer() {
  return (
    <div className="w-100 white">
      <footer className="footer container-xxl d-flex justify-content-center">
        <div className="footer-container d-flex row flex-row justify-content-center align-items-center mb-5 py-2">
          <div className="footer-content-container row d-flex align-items-center col-10 col-xl-4">
            <div className="d-flex flex-column col-12 col-sm-10 col-md-7 col-lg-6 col-xl-8 align-items-center">
              <img
                src={dishineLogo}
                alt="Dishine Logo"
                className="w-100 mb-1"
              />
              <div className="w-100">
                <div className="d-flex justify-content-xl-between justify-content-evenly w-100">
                  <div className="icon">
                    <img src={shopeelogo} alt="" />
                  </div>
                  <div className="icon">
                    <img src={instagramLogo} alt="" />
                  </div>
                  <div className="icon">
                    <img src={tiktokLogo} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-content-container col-10 col-xl-8 py-5">
            <div className="row align-items-start justify-content-around">
              <div className="col-12 col-xl-5 mb-4 mb-xl-0">
                <h3 className="mb-4 fw-medium">About</h3>
                <p>
                Dishine adalah brand fashion yang menggabungkan kesederhanaan, kenyamanan, dan gaya modern. 
                Kami ingin setiap orang merasa lebih percaya diri lewat pakaian yang mudah dipadupadankan dan cocok untuk aktivitas sehari-hari.
                </p>
              </div>
              <div className="col-12 col-xl-5">
                <div className="row">
                  <h3 className="col-12 mb-4">Quick Link</h3>
                  <div className="col-6">
                    <NavLink to="/AboutUs" className="text-decoration-none text-dark">
                      About Us
                    </NavLink>
                  </div>

                  <p className="col-6">FAQ</p>
                  <p className="col-6">Product</p>
                  <p className="col-6">Contact</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
