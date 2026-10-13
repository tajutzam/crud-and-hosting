import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductCard.css";
import PlaceholderProductCard from "../assets/PlaceholderProductCard.png";
import { useCart } from "../contexts/CartContext";

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
    <div className="col-6 col-md-4 col-lg-3 col-xl-2 mb-4">
      <div 
        className="card h-100 shadow-sm transition border-0 cursor-pointer"
        onClick={() => slug && navigate(`/product/${slug}`)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={getImageUrl()}
          alt={name || "Product Image"}
          className="card-img-top object-fit-cover"
          style={{ height: "180px", width: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PlaceholderProductCard;
          }}
        />
        <div className="card-body px-2 py-2 d-flex flex-column">
          <p className="product-name fw-normal text-start" style={{ fontSize: "1rem" }}>
            {name}
          </p>
          <div className="d-flex flex-row align-items-center justify-content-between mt-auto">
            <span className="fw-medium" style={{ fontSize: "1rem" }}>
              Rp. {basePrice ? Number(basePrice).toLocaleString("id-ID") : "0"}
            </span>
            <button
              className="plus btn btn-outline-dark btn-sm rounded-circle ms-2"
              style={{
                width: "32px",
                height: "32px",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={handleAddToCart}
              aria-label={`Add ${name} to cart`}
              type="button"
              title="Tambah ke Keranjang"
            >
              <span className="fs-4">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;