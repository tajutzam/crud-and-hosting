
import "./HomePage.css";
import Catalogue from "../../Catalogue";

import dishineHero1 from '../../assets/DishineHero1.png'
import dishineHeroSmall1 from '../../assets/DishineHeroSmall1.jpeg'
import dishineHeroSmall2 from '../../assets/DishineHeroSmall2.jpeg'
import LeftArrow from '../../assets/LeftArrow.png'
import RightArrow from '../../assets/RightArrow.png'

function HomePage() {
  return (<div>
              <div className="Header w-100 pb-5 py-5 d-flex justify-content-center align-items-center">
              <div className="d-none d-md-flex container-xl mt-5 p-2 row d-flex justify-content-center align-items-center">
                <div className="col-1 me-xl-auto">
                  <div className="arrow-container">
                    <img src={LeftArrow} className="" alt="" />
                  </div>
                </div>
                <div className="hero-banner-small row col-0 col-lg-2 d-none d-xl-flex justify-content-center">
                  <img src={dishineHeroSmall1} className="hero-banner-small w-75" alt="" />
                </div>
                <img src={dishineHero1} className="hero-banner col-8 col-lg-7 col-xl-6 d-flex justify-content-center" alt="Dishine Hero 1 - New Collection"></img>
                <div className="row col-0 col-lg-2 d-none d-xl-flex justify-content-center">
                  <img src={dishineHeroSmall2} className="hero-banner-small w-75" alt="" />
                </div>
                <div className="col-1 ms-xl-auto">
                  <div className="arrow-container">
                    <img src={RightArrow} className="" alt="" />
                  </div>
                </div>
              </div>
          </div>
          <Catalogue></Catalogue>
  </div>
  )
}

export default HomePage;