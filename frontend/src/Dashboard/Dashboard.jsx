import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/searchBar.jsx';
import AddPatientModal from '../Modals/AddPatientModal/AddPatientModal.jsx';
import DeleteModal from '../Modals/DeleteModal/DeleteModal.jsx'
import EditModal from '../Modals/EditModal/EditModal.jsx';
import PhoneModal from '../Modals/PhoneModal/PhoneModal.jsx'
import Header from '../Header/Header.jsx';
import './Dashboard.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import AddIcon from '@mui/icons-material/Add';
import MessageIcon from '@mui/icons-material/Message';
import SearchIcon from '@mui/icons-material/Search';

const Dashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage, setPatientsPerPage] = useState(6);
  const [modalContent, setModalContent] = useState(false);
  const [modalEditContent, setEditModalContent] = useState(false);
  const [modalDeleteContent, setDeleteModalContent] = useState(false);
  const [modalPhoneContent, setPhoneModalContent] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [choosenUser, setChoosenUser] = useState(null);
  const [totalMessages, setTotalMessages] = useState(0);

  useEffect(() => {
    fetchPatients();
  }, [currentPage]);

  const fetchPatients = () => {
    axios.get(`http://localhost:5000/getAllUsers?limit=${patientsPerPage}&pages=${currentPage}`)
      .then(response => {
        if (response.data.messsage = "Data Fetched") {
          setTotalMessages(response.data.totalLength);
          const newPatient = [...response.data.arrayList];
          setPatients(newPatient);
        }
      })
      .catch(err => console.log(err))
  };

  const openModal = () => {
    setModalContent(true);
  };

  const openEditModal = (index) => {
    setEditModalContent(true);
    setChoosenUser(index);
  };

  const openDeleteModal = (index) => {
    setDeleteModalContent(true);
    setChoosenUser(index);
  };

  const openPhoneModal = (index) => {
    setPhoneModalContent(true);
    setChoosenUser(index);
  };

  const closeModal = () => {
    setModalContent(false);
    setEditModalContent(false);
    setDeleteModalContent(false);
    setPhoneModalContent(false);
    setChoosenUser(null);
    fetchPatients();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalMessages / patientsPerPage); i++) {
    pageNumbers.push(i);
  }

  const searchPatients = async () => {
    const res = await axios.get(`http://localhost:5000/searchByUserName?name=${searchText}&limit=${patientsPerPage}&pages=${currentPage}`);
    setTotalMessages(res.data.totalLength);
    setPatients(res.data.arrayList);
    setCurrentPage(1);
    if (searchText != "") {
      setPatientsPerPage(res.data.totalLength);
    } else {
      setPatientsPerPage(6);
    }
    setSearchText("")
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-top">
        <button onClick={() => openModal()}><AddIcon fontSize="small" /> Add New Patient</button>
        <div className="dashboard-searchbar-container">
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
          <button onClick={searchPatients}><SearchIcon fontSize="small" /> Search</button>
        </div>
        <button onClick={() => navigate('/messages')}><MessageIcon fontSize="small" /> See All Messages</button>
      </div>
      <div className="dashboard-patients">
        {patients.map((patient, index) => (
          <div key={patient._id} className="dashboard-patient">
            <div className="dashboard-patient-left" style={{
              backgroundColor: "#272829",
              padding: "5px",
              paddingLeft: "10px",
              borderRadius: "5px",
              fontFamily: "Bricolage Grotesque, sans-serif"
            }}>
              <h3 style={{
                color: "#fff",
                fontSize: "24px",
                marginBottom: "10px"
              }}>
                {patient.name}
              </h3>
              <p style={{
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold"
              }}>
                {patient.phoneNumber}
              </p>
              <div style={{
                color: "#fff",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "2px",
              }}>
                Medicine Details
              </div>
              <ul style={{
                color: "#fff",
                fontSize: "14px",
                listStyleType: "none",
                paddingLeft: "10px"
              }}>
                {patient.medicines.map((medicine) => (
                  <li key={medicine.medicineName} style={{
                    marginBottom: "5px",
                  }}>
                    {medicine.medicineName} {medicine.dosage} {medicine.days}
                  </li>
                ))}
              </ul>
            </div>
            <div className="dashboard-patient-right">
              <button onClick={() => openDeleteModal(index)} className="danger"><DeleteIcon fontSize="small" /> Delete User</button>
              <button onClick={() => openEditModal(index)}><EditIcon fontSize="small" /> Edit User Details</button>
              <button onClick={() => openPhoneModal(index)}><PhoneForwardedIcon fontSize="small" /> Change Phone Number</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination-container">
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {modalContent && <AddPatientModal closeModal={closeModal} />}
      {modalDeleteContent && <DeleteModal closeModal={closeModal} user={patients[choosenUser]} />}
      {modalEditContent && <EditModal closeModal={closeModal} user={patients[choosenUser]} />}
      {modalPhoneContent && <PhoneModal closeModal={closeModal} user={patients[choosenUser]} />}
    </div>
  );
};

export default Dashboard;