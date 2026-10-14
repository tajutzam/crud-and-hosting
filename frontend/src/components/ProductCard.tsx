import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductCard.css";
import PlaceholderProductCard from "../assets/PlaceholderProductCard.png";
import { useCart } from "../hooks/useCart";

const BACKEND_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

function ProductCard({ id, product, name, slug, categoryId, description, basePrice, productImages }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Helper untuk menentukan URL gambar yang valid
  const getImageUrl = () => {
    let imgPath = null;

    if (Array.isArray(productImages) && productImages.length > 0) {
      imgPath = productImages[0]?.image_url || productImages[0];
    } else if (typeof productImages === 'string') {
      imgPath = productImages;
    }

    if (imgPath) {
      if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
        return imgPath;
      }
      const cleanPath = imgPath.replace(/^\/?(storage\/)?/, '');
      return `${BACKEND_URL}/storage/${cleanPath}`;
    }

    return PlaceholderProductCard;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Mencegah navigasi saat tombol '+' diklik
    const productData = product || {
      id,
      name,
      base_price: basePrice,
      slug,
      product_images: Array.isArray(productImages) ? productImages : (productImages ? [{ image_url: productImages }] : [])
    };
    await addToCart(productData, 1);
  };

  return (
    <div className="col-6 col-md-4 col-lg-3 col-xl-3 mb-4">
      <article
        className="product-card-ui h-100"
        onClick={() => slug && navigate(`/product/${slug}`)}
        role="link"
        tabIndex={0}
        onKeyDown={(event) => event.key === 'Enter' && slug && navigate(`/product/${slug}`)}
      >
        <img
          src={getImageUrl()}
          alt={name || "Product Image"}
          className="product-card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PlaceholderProductCard;
          }}
        />
        <div className="product-card-body">
          <p className="product-name">{name}</p>
          <div className="product-card-footer">
            <span className="product-price">Rp {basePrice ? Number(basePrice).toLocaleString("id-ID") : "0"}</span>
            <button
              className="plus"
              onClick={handleAddToCart}
              aria-label={`Add ${name} to cart`}
              type="button"
              title="Tambah ke Keranjang"
            >
              <span className="fs-4">+</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ProductCard;