
import "../styles/HomePage.css";
import Catalogue from "../components/Catalogue";

import dishineHero1 from '../assets/DishineHero1.png'
import dishineHeroSmall1 from '../assets/DishineHeroSmall1.jpeg'
import dishineHeroSmall2 from '../assets/DishineHeroSmall2.jpeg'
import LeftArrow from '../assets/LeftArrow.png'
import RightArrow from '../assets/RightArrow.png'

function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span />New season / 2025</div>
          <h1>Quiet style,<br /><em>made personal.</em></h1>
          <p className="hero-description">Everyday pieces designed with quiet details, honest materials, and room for you to make them yours.</p>
          <div className="hero-actions">
            <a className="btn-brand hero-button" href="#catalogue">Explore collection <span>↗</span></a>
            <a className="hero-text-link" href="#catalogue">View essentials <span>↓</span></a>
          </div>
          <div className="hero-proof"><strong>01</strong><span /> <p>Designed for<br />everyday living</p></div>
        </div>
        <div className="hero-gallery">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-gallery-label"><span>DS</span><b>THE<br />ESSENTIAL<br />EDIT</b></div>
          <img className="hero-side-image left" src={dishineHeroSmall1} alt="Dishine collection" />
          <figure className="hero-main-figure">
            <img className="hero-main-image" src={dishineHero1} alt="Dishine new collection" />
            <figcaption>New collection <span>—</span> 01 / 03</figcaption>
          </figure>
          <img className="hero-side-image right" src={dishineHeroSmall2} alt="Dishine collection" />
        </div>
      </section>
      <section id="catalogue" className="catalogue-section"><Catalogue /></section>
    </div>
  )
}

export default HomePage;