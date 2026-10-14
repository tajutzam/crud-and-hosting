import "./AboutUs.css";

import image1 from '../../assets/image1.png';
import image2 from '../../assets/image2.png';

function AboutUs() {
    return (
        <div>

            <div className="about pt-5 pb-5">
                <div className="mt-5 container-xxl text-white">
                    <h1 className="about-us-heading mb-5">About Us</h1>

                    {/* First Content Block: Text on Left, Image on Right */}
                    <div className="about-section row align-items-center mb-5">
                        <div className="col-lg-6 about-text fade-in delay-1">
                            <p className="about-text">
                            Dishine adalah brand fashion yang berdiri dari keinginan menghadirkan pakaian yang simple, elegan, dan nyaman dipakai setiap hari. Kami percaya bahwa gaya terbaik adalah gaya yang effortless, tidak perlu berlebihan, cukup berkualitas dan sesuai dengan karakter setiap pemakainya.

                            Setiap koleksi Dishine dibuat dengan memperhatikan detail, pemilihan material yang baik, serta desain yang timeless. Kami ingin menjadi brand yang menemani aktivitas harian kamu, mulai dari bekerja, kuliah, hingga hangout.
                            </p>
                        </div>
                        <div className="col-lg-6 about-image-block fade-in delay-2">
                            <img src={image1} alt="Fashion store interior" className="img-fluid rounded shadow" />
                        </div>
                    </div>

                    {/* Second Content Block: Image on Left, Text on Right */}
                    <div className="about-section row align-items-center mb-5">
                        <div className="col-lg-6 about-image-block fade-in delay-2">
                            <img src={image2} alt="Designers working" className="img-fluid rounded shadow" />
                        </div>
                        <div className="col-lg-6 about-text fade-in delay-1">
                            <p className="about-text">
                                Kami merancang setiap produk melalui proses yang teliti, mulai dari pemilihan bahan, pembuatan pola, hingga quality control sebelum dikirimkan ke pelanggan. Semua dilakukan dengan tujuan agar setiap produk Dishine terasa nyaman, ringan, dan tahan lama.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;