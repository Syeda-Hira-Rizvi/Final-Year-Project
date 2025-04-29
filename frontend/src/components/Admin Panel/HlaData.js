import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components for Table and other UI elements
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center; /* Center-align table content */
    @media (max-width: 1000px) {
    display: grid;
    border: 0;
  }
`;

const TableHeader = styled.th`
  background-color: #b00000;
  color: white;
  padding: 10px;
  text-align: center; /* Center-align header text */
    @media (max-width: 1000px) {
    display: none;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center; /* Center-align cell text */
   @media (max-width: 1000px) {
    display: block;
    text-align: left;
    padding-left: 50%;
    position: relative;
    border: none;

    &:before {
      content: attr(data-label);
      position: absolute;
      left: 10px;
      top: 10px;
      font-weight: bold;
      color: #333;
    }
  }
  @media (max-width: 650px) {
    font-size: 11px;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f4f4f4;
  }
    @media (max-width: 1000px) {
    display: block;
    margin-bottom: 20px;
    border: 1px solid #ddd;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: start; /* Center-align filter */
  margin-bottom: 20px;
  padding: 10px;
`;

const Input = styled.input`
  padding: 8px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const HlaData = () => {
  // Sample HLA results data with added hospital name field
  const [hlaRecords, setHLARecords] = useState([
    {
      id: 1,
      donorName: 'John Doe',
      hospitalName: 'City General Hospital',
      testDate: '2024-12-01',
      patientName: 'Alice Brown',
      hlaMatchStatus: 'Matched',
    },
    {
      id: 2,
      donorName: 'Jane Smith',
      hospitalName: 'Townsville Medical Center',
      testDate: '2024-12-05',
      patientName: 'Bob White',
      hlaMatchStatus: 'No Match',
    },
    {
      id: 3,
      donorName: 'Samuel Johnson',
      hospitalName: 'City General Hospital',
      testDate: '2024-12-10',
      patientName: 'Charlie Green',
      hlaMatchStatus: 'Matched',
    },
  ]);

  // Single filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Handle filter change
  const handleFilterChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered HLA results based on the single filter field
  const filteredHLARecords = hlaRecords.filter((record) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      record.donorName.toLowerCase().includes(searchLower) ||
      record.hospitalName.toLowerCase().includes(searchLower) ||
      record.testDate.toLowerCase().includes(searchLower) ||
      record.patientName.toLowerCase().includes(searchLower) ||
      record.hlaMatchStatus.toLowerCase().includes(searchLower) 
        );
  });

  return (
    <div>
      {/* Filter Section */}
      <FilterContainer>
        <div>
          <label>Search: </label>
          <Input
            type="text"
            value={searchTerm}
            onChange={handleFilterChange}
            placeholder="Filter here..."
          />
        </div>
      </FilterContainer>

      {/* HLA Results Table */}
      <Table>
        <thead>
          <tr>
            <TableHeader>Donor Name</TableHeader>
            <TableHeader>Hospital Name</TableHeader> {/* New column for hospital name */}
            <TableHeader>Test Date</TableHeader>
            <TableHeader>Patient Name</TableHeader>
            <TableHeader>HLA Match Status</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredHLARecords.map((record) => (
           <TableRow key={record.id}>
           <TableCell data-label="Donor Name">{record.donorName}</TableCell>
           <TableCell data-label="Hospital Name">{record.hospitalName}</TableCell> {/* Display hospital name */}
           <TableCell data-label="Test Date">{record.testDate}</TableCell>
           <TableCell data-label="Patient Name">{record.patientName}</TableCell>
           <TableCell data-label="HLA Match Status">{record.hlaMatchStatus}</TableCell>
         </TableRow>
         
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default HlaData;
