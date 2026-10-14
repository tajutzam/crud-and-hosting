import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/Product.css";
import productService from "../services/productService";
import { useCart } from "../hooks/useCart";
import PlaceholderProductCard from "../assets/PlaceholderProductCard.png";

import mainProductImage from '../assets/image1.png';
import Upload from '../assets/upload.svg';
import HeartFill from '../assets/heart-fill.svg';
import HeartEmpty from '../assets/heart-empty.svg';

const BACKEND_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('M');
    const [isLiked, setIsLiked] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Failed to fetch product:", err);
            }
        };
        fetchProduct();
    }, [id]);

    const toggleLike = () => setIsLiked(!isLiked);
    const handleSizeSelect = (size) => setSelectedSize(size);
    const handleQuantityChange = (type) => {
        if (type === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const getImageUrl = () => {
        if (!product) return mainProductImage;
        const imgPath = product.product_images?.[0]?.image_path || product.image;
        if (!imgPath) return PlaceholderProductCard;
        if (imgPath.startsWith('http')) return imgPath;
        return `${BACKEND_URL}/storage/${imgPath}`;
    };

    return (
        <div>
            <div className="product-page-content py-5">
                <div className="container-xxl product-container">
                    <div className="row pt-5">
                        <div className="col-lg-7 product-image-section d-flex align-items-start position-relative">
                            <div className="action-buttons d-flex flex-column flex-lg-row me-3">
                                <div>
                                    <img 
                                        src={getImageUrl()} 
                                        alt={product?.name || "Product Main"} 
                                        className="img-fluid product-main-image rounded shadow-sm"
                                        onError={(e) => { e.currentTarget.src = PlaceholderProductCard; }}
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
                            <h2 className="fw-bold mb-2">{product?.name || "Product Details"}</h2>
                            {product?.category && (
                                <span className="badge bg-secondary mb-3">{product.category.name}</span>
                            )}
                            <div className="d-flex align-items-center mb-3">
                                <span className="current-price text-danger fs-3 fw-bold me-3">
                                    Rp {(product?.base_price ?? 0).toLocaleString('id-ID')}
                                </span>
                                {product?.reseller_price && (
                                    <span className="text-muted text-decoration-line-through me-3">
                                        Rp {(product.reseller_price).toLocaleString('id-ID')}
                                    </span>
                                )}
                                <span className="sold-info me-3">• Tersedia</span>
                                <span className="rating-info">⭐ 5.0</span>
                            </div>

                            <h4 className="product-title mb-2">Description:</h4>
                            <p className="product-description mb-4 text-muted">
                                {product?.description || "Tidak ada deskripsi produk."}
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
                                <button 
                                    className="add-to-cart-button me-3"
                                    onClick={() => product && addToCart(product, quantity)}
                                    disabled={!product}
                                >
                                    Add To Cart
                                </button>
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