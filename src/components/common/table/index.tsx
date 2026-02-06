"use client";
import React, { useState } from "react";
import Pagination from "./pagination";
import "./style.scss";
import { MdOutlineManageSearch } from "react-icons/md";

interface TableProps {
  data: any[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="custom-table">
      <div className="filter">
        <MdOutlineManageSearch className="filter_icon" />
        <input
          type="text"
          placeholder="Filter by name or email"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      <figure>
        <table>
          <thead>
            <tr>
              {/* Adjust table headers according to your data */}
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredData.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Table;
