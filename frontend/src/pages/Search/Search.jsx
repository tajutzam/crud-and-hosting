import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./Search.css";

// MOCK DATA: Replace this with your actual API call or data source later
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Kemeja Kasual Pria",
    price: "120.000",
    category: "Pakaian Pria",
    img: "https://placehold.co/300x400?text=Kemeja",
  },
  {
    id: 2,
    name: "Blouse Wanita Elegant",
    price: "150.000",
    category: "Pakaian Wanita",
    img: "https://placehold.co/300x400?text=Blouse",
  },
  {
    id: 3,
    name: "Celana Chino",
    price: "180.000",
    category: "Pakaian Pria",
    img: "https://placehold.co/300x400?text=Chino",
  },
  {
    id: 4,
    name: "Rok Panjang Floral",
    price: "135.000",
    category: "Pakaian Wanita",
    img: "https://placehold.co/300x400?text=Rok",
  },
  {
    id: 5,
    name: "Jaket Denim",
    price: "250.000",
    category: "Outerwear",
    img: "https://placehold.co/300x400?text=Jaket",
  },
  {
    id: 6,
    name: "Kaos Polos Hitam",
    price: "50.000",
    category: "Pakaian Pria",
    img: "https://placehold.co/300x400?text=Kaos",
  },
];

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || ""; // Get 'q' from URL (e.g., ?q=shirt)
  const [results, setResults] = useState([]);

  // Filter products whenever the query changes
  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = MOCK_PRODUCTS.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLowerCase().includes(lowerCaseQuery)
    );
    setResults(filtered);
  }, [query]);

  return (
    <div>
      <div className="container-xxl py-5">
        <div className="row">
          <div className="col-12 mb-4">
            <h2 className="fw-bold">Search Results</h2>
            <p className="text-muted">
              Showing results for:{" "}
              <span className="text-primary fw-bold">"{query}"</span>
            </p>
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="row g-4">
          {results.length > 0 ? (
            results.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                {/* Use your actual ProductCard component here if you have it.
                Example: <ProductCard name={product.name} price={product.price} imgUrl={product.img} />
                For now, I'll put a simple card structure directly here:
              */}
                <div className="card h-100 border-0 shadow-sm product-card-hover">
                  <div
                    className="overflow-hidden position-relative"
                    style={{ height: "280px" }}
                  >
                    <img
                      src={product.img}
                      className="card-img-top h-100 object-fit-cover w-100"
                      alt={product.name}
                    />
                  </div>
                  <div className="card-body">
                    <small className="text-muted">{product.category}</small>
                    <h5 className="card-title mt-1 mb-2 text-truncate">
                      {product.name}
                    </h5>
                    <p className="card-text fw-bold text-brown">
                      Rp. {product.price}
                    </p>
                    <button className="btn btn-brown w-100 rounded-pill mt-2">
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // NO RESULTS STATE
            <div className="col-12 text-center py-5">
              <div className="display-1 text-muted mb-3">😕</div>
              <h3>No results found for "{query}"</h3>
              <p className="text-muted">
                Try checking your spelling or using different keywords.
              </p>
              <Link to="/" className="btn btn-outline-dark mt-3">
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
