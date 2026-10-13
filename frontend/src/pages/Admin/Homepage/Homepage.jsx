import Header from "../Header";
import "./HomePage.css";

import dishineHeroSmall1 from "../../../assets/DishineHeroSmall1.jpeg";
import dishineHeroSmall2 from "../../../assets/DishineHeroSmall2.jpeg";
import LeftArrow from "../../../assets/LeftArrow.png";
import RightArrow from "../../../assets/RightArrow.png";

function HomePage() {
  return (
    <div>
      <Header></Header>
      <div className="pt-5 mt-5">
        <div className="analytics">
          <div className=" container-lg py-5">
            <div className="row mb-2">
              <p className=" text-light col-12 col-sm-4 col-lg-6 col-xl-8 fs-4 fw-semibold ps-2 ps-sm-4  pt-3">
                Data Analytics
              </p>
              <div className="  col-6 col-sm-4 col-lg-3 col-xl-2 d-flex justify-content-center">
                <button className="button">
                  <p className="text-dark p-0 m-0">Order List</p>
                </button>
              </div>
              <div className="  col-6 col-sm-4 col-lg-3 col-xl-2 d-flex justify-content-center">
                <button className="button">
                  <p className="text-dark p-0 m-0">Order List</p>
                </button>
              </div>
            </div>
            <div className="row pt-4">
              <div className="col-9 col-sm-4 d-flex justify-content-center m-auto pb-4">
                <div className="  analytic-small">
                  <div className="d-flex justify-content-between px-3 py-2">
                    <p className=" text-center">Total Revenue</p>
                    <p className="">IDR</p>
                  </div>
                  <p className="fs-4 text-center pb-4">OOGA BOOGA</p>
                </div>
              </div>
              <div className="col-9 col-sm-4 d-flex justify-content-center m-auto pb-4">
                <div className="  analytic-small">
                  <div className="d-flex justify-content-between px-3 py-2">
                    <p className=" text-center">Total Orders</p>
                    <p className="">IDR</p>
                  </div>
                  <p className="fs-4 text-center pb-4">OOGA BOOGA</p>
                </div>
              </div>
              <div className="col-9 col-sm-4 d-flex justify-content-center m-auto pb-4">
                <div className="  analytic-small">
                  <div className="d-flex justify-content-between px-3 py-2">
                    <p className=" text-center">Active Customer</p>
                    <p className="">IDR</p>
                  </div>
                  <p className="fs-4 text-center pb-4">OOGA BOOGA</p>
                </div>
              </div>
            </div>
          </div>
          {/* revenue and top prouduct overview */}
          <div className="container-lg">
            <div className="row">
              <div className="col-12 col-md-6 pb-4">
                <div className="analytic-large">
                    <div className="d-flex px-3 py-2">
                        <p className="fs-5  fw-semibold">Revenue Overview</p>
                    </div>
                </div>
              </div>
              <div className="col-12 col-md-6 pb-4">
                <div className="analytic-large">
                    <div className="d-flex px-3 py-2">
                        <p className="fs-5  fw-semibold">Top Products</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
