const API_URL = import.meta.env.VITE_API_BASE_URL 
  ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') 
  : 'http://localhost:8000';

import React, { useState } from "react";

import "./Product.css";
import Header from "../../Header";

import mainProductImage from '../../assets/image1.png';
import Upload from '../../assets/upload.svg';
import HeartFill from '../../assets/heart-fill.svg';
import HeartEmpty from '../../assets/heart-empty.svg';

function Product() {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [isLiked, setIsLiked] = useState(false); 

    const handleQuantityChange = (type) => {
        if (type === 'increase') {
            setQuantity(prevQuantity => prevQuantity + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const toggleLike = () => {
        setIsLiked(prevIsLiked => !prevIsLiked);
    };

    return (
        <div>
            <Header></Header>
            <div className="product-page-content py-5">
                <div className="container-xxl product-container">
                    <div className="row pt-5">
                        <div className="col-lg-7 product-image-section d-flex  align-items-start position-relative">
                            <div className="action-buttons d-flex flex-column flex-lg-row me-3">
                                <div>
                                    <img 
                                        src={
                                            product?.image 
                                            ? (product.image.startsWith('http') ? product.image : `${API_URL}/storage/${product.image}`)
                                            : mainProductImage
                                        } 
                                        alt={product?.name || "Product Main"} 
                                        className="img-fluid product-main-image" 
                                        />
                                </div>
                                <div className="d-flex flex-row flex-lg-column mt-3 mt-lg-0">
                                    <button className="icon-button mb-3">
                                        <img src={Upload} alt="Share" />
                                    </button>
                                    <button 
                                        className="icon-button"
                                        onClick={toggleLike}
                                    >
                                        <img 
                                            src={isLiked ? HeartFill : HeartEmpty} 
                                            alt={isLiked ? "Unlike button (Filled Heart)" : "Like button (Empty Heart)"}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5 product-details-section">
                            <div className="d-flex align-items-center mb-3">
                                <span className="original-price me-2">150.000,00</span>
                                <span className="current-price me-3">100.000,00</span>
                                <span className="sold-info me-3">• 1,238 Sold</span>
                                <span className="rating-info">⭐ 4.5</span>
                            </div>

                            <h4 className="product-title mb-2">Description:</h4>
                            <p className="product-description mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation ullamco
                                laboris nisi ut aliquip ex ea commodo, See More...
                            </p>

                            <div className="color-options mb-4">
                                <div className="color-swatch active" style={{ backgroundColor: '#ADD8E6' }}></div>
                                <div className="color-swatch" style={{ backgroundColor: '#D3D3D3' }}></div>
                            </div>

                            <div className="size-options mb-4">
                                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                    <button
                                        key={size}
                                        className={`size-button ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => handleSizeSelect(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>

                            <div className="d-flex align-items-center mb-4">
                                <button className="add-to-cart-button me-3">Add To Cart</button>
                                <div className="quantity-control d-flex align-items-center">
                                    <button className="quantity-button" onClick={() => handleQuantityChange('decrease')}>-</button>
                                    <span className="quantity-display">{quantity}</span>
                                    <button className="quantity-button" onClick={() => handleQuantityChange('increase')}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;