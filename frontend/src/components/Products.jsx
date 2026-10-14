import ProductCard from "./ProductCard";
import Loading from "./Loading";
import { useEffect, useState } from "react";
import productService from "../services/productService";
import allProducts from "../data/products";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.warn('Failed to fetch products from API, using local data:', err);
        setProducts(allProducts);
        setError('Using local data');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container-xl">
        <div className="d-flex">
          <p className="fs-4 fw-semibold">Products</p>
        </div>
        <Loading message="Loading products..." />
      </div>
    );
  }

  return (
    <div className="container-xl catalogue-inner">
      <div className="catalogue-heading">
        <div>
          <p className="eyebrow mb-2">CURATED FOR YOU</p>
          <h2 className="display-font">Latest pieces</h2>
        </div>
        <p className="catalogue-note">Simple silhouettes. Thoughtful details. Made for repeat wear.</p>
      </div>
      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              product={product}
              name={product.name}
              slug={product.slug}
              category={product.category?.name || ''}
              description={product.description}
              basePrice={product.base_price}
              productImages={product.product_images || product.productImages}
            />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p>No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;