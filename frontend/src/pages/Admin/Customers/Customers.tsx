import React from "react";
import "./Customers.css";
import {
  BiSearch,
  BiSortAlt2,
  BiFilter,
  BiPlus,
  BiShow,
  BiPencil,
  BiTrash,
} from "react-icons/bi";


// Define the shape of your data
type Customer = {
  id: number;
  name: string;
  orderDate: string;
};

// Mock Data (Replace this with your real props later)
const customers: Customer[] = [
  { id: 1, name: "User 1", orderDate: "28-11-2005" },
  { id: 2, name: "User 2", orderDate: "28-11-2005" },
  { id: 3, name: "User 3", orderDate: "28-11-2005" },
  { id: 4, name: "User 4", orderDate: "28-11-2005" },
  { id: 5, name: "User 5", orderDate: "28-11-2005" },
  { id: 6, name: "User 6", orderDate: "28-11-2005" },
];

const Customers = () => {
  return (
    <div className="container-fluid mt-4">
      <div className="container-xl py-5 mt-5">
        <h4 className="mb-4 fw-bold text-dark">Customers</h4>

        <div className="bg-white p-4 rounded-3 shadow-sm">
          {/* Top Toolbar Section */}
          <div className="toolbar-container d-flex justify-content-between align-items-center mb-4 px-3 py-2">
            {/* Search Input */}
            <div className="d-flex align-items-center flex-grow-1">
              <BiSearch className="text-muted me-2 fs-5" />
              <input
                type="text"
                className="form-control border-0 bg-transparent shadow-none"
                placeholder="Search"
              />
            </div>

            {/* Top Actions */}
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

          {/* Table Section */}
          <div className="table-responsive">
            <table className="table table-striped align-middle custom-table">
              <thead>
                <tr>
                  <th scope="col" className="ps-3">
                    No
                  </th>
                  <th scope="col">Name</th>
                  <th scope="col">Order Date</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="ps-3">{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.orderDate}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {/* View Button (Blue) */}
                        <button className="action-btn btn-view">
                          <BiShow />
                        </button>
                        {/* Edit Button (Yellow) */}
                        <button className="action-btn btn-edit">
                          <BiPencil />
                        </button>
                        {/* Delete Button (Red) */}
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

export default Customers;
