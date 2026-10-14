import { Routes, Route, Link } from "react-router-dom";
import "./Products.css";


import ProductCard from "./ProductCard";

function Products() {
  return (
    <div className="">
      <div className="pt-5 mt-5">
        <div className="container-lg">
          <div className="row p-2 pb-5">
            <p className="fw-semibold col-6 m-0 fs-4">Products</p>
            <div className="col-6 d-flex justify-content-end">
              <button className="button-add text-end p-2">
                <p className="m-0 text-center text-light">+ Product</p>
              </button>
            </div>
          </div>
          <div className="row pb-5">
            <ProductCard name="Bajussssssssssssssssssssssssssssssssssssssss" price="231321" ></ProductCard>
            <ProductCard></ProductCard>
            <ProductCard></ProductCard>
            <ProductCard></ProductCard>
            <ProductCard></ProductCard>
            <ProductCard></ProductCard>
            <ProductCard></ProductCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
