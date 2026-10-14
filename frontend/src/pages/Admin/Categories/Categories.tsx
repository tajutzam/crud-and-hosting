import React from "react";
import "./Categories.css"; // Make sure to import your CSS

import "../Customers/Customers.css"

import {
  BiSearch,
  BiSortAlt2,
  BiFilter,
  BiPlus,
  BiPencil,
  BiTrash,
} from "react-icons/bi";

// 1. The Shape (Blueprint)
type Category = {
  id: number;
  name: string;
  parent: string;
};

// 2. The Data (Matches your screenshot)
const categories: Category[] = [
  { id: 1, name: "Pakaian Pria", parent: "-" },
  { id: 2, name: "Pakaian Wanita", parent: "-" },
  { id: 3, name: "Kemeja Kasual", parent: "Pakaian Pria" },
  { id: 4, name: "Rok Panjang", parent: "Pakaian Wanita" },
  { id: 5, name: "Kemeja Kasual", parent: "Pakaian Pria" },
  { id: 6, name: "Rok Panjang", parent: "Pakaian Wanita" },
  { id: 7, name: "Kemeja Kasual", parent: "Pakaian Pria" },
  { id: 8, name: "Rok Panjang", parent: "Pakaian Wanita" },
];

const Categories = () => {
  return (
    <div className="container-fluid mt-4">
      <div className="container-xl py-5 mt-5">
        {/* Page Header with Title and Add Button */}
        <div className="page-header">
          <h4 className="fw-bold text-dark mb-0">Categories</h4>
          <button className="btn-brown">
            <BiPlus size={20} /> Category
          </button>
        </div>

        {/* White Card Container */}
        <div className="bg-white p-4 rounded-3 shadow-sm">
          {/* Toolbar (Search + Actions) */}
          <div className="toolbar-container d-flex justify-content-between align-items-center mb-4 px-3 py-2">
            {/* Search */}
            <div className="d-flex align-items-center flex-grow-1">
              <BiSearch className="text-muted me-2 fs-5" />
              <input
                type="text"
                className="form-control border-0 bg-transparent shadow-none"
                placeholder="Search"
              />
            </div>

            {/* Right Icons */}
            <div className="d-flex gap-3 text-muted align-items-center">
              <button className="icon-btn">
                <BiSortAlt2 size={20} />
              </button>
              <button className="icon-btn">
                <BiFilter size={20} />
              </button>
              <button className="icon-btn">
                <BiPlus size={20} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-striped align-middle custom-table">
              <thead>
                <tr>
                  <th scope="col" className="ps-3">
                    No
                  </th>
                  <th scope="col">Name</th>
                  <th scope="col">Parent</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="ps-3">{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.parent}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {/* Only Edit (Yellow) and Delete (Red) buttons here */}
                        <button className="action-btn btn-edit">
                          <BiPencil />
                        </button>
                        <button className="action-btn btn-delete">
                          <BiTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
