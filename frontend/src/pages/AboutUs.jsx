import "../styles/AboutUs.css";

import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';

function AboutUs() {
    return (
        <div>

            <div className="about pt-5 pb-5">
                <div className="mt-5 container-xxl text-white">
                    <h1 className="about-us-heading mb-5">About Us</h1>

                    <div className="about-section row align-items-center mb-5">
                        <div className="col-lg-5 about-text-block">
                            <p className="text">
                                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo
                            </p>
                        </div>
                        <div className="col-lg-7 about-image-block">
                            <img src={image1} alt="Fashion store interior" className="img-fluid rounded shadow" />
                        </div>
                    </div>

                    <div className="about-section row align-items-center mb-5">
                        <div className="col-lg-7 about-image-block order-lg-0">
                            <img src={image2} alt="Designers working" className="img-fluid rounded shadow" />
                        </div>
                        <div className="col-lg-5 about-text-block order-lg-1">
                            <p className="text">
                                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;