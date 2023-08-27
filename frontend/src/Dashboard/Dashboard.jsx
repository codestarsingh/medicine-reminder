import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';
import SearchBar from '../SearchBar/searchBar';
import AddPatientModal from '../Modals/AddPatientModal/AddPatientModal';
import DeleteModal from '../Modals/DeleteModal/DeleteModal'
import EditModal from '../Modals/EditModal/EditModal';
import PhoneModal from '../Modals/PhoneModal/PhoneModal'
import './Dashboard.css';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';

const Dashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage, setPatientsPerPage] = useState(6);
  const [modalContent, setModalContent] = useState(false);
  const [modalEditContent, setEditModalContent] = useState(false);
  const [modalDeleteContent, setDeleteModalContent] = useState(false);
  const [modalPhoneContent, setPhoneModalContent] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [choosenUser, setChoosenUser] = useState(null);
  const [totalMessages, setTotalMessages] = useState(0);

  useEffect(() => {
    fetchPatients();
  }, [currentPage]);

  const fetchPatients = () => {
    axios.get(`http://localhost:5000/getAllUsers?limit=${patientsPerPage}&pages=${currentPage}`)
      .then(response => {
        if (response.data.messsage = 'Data Fetched') {
          setTotalMessages(response.data.totalLength);
          const newPatient = [...response.data.arrayList];
          setPatients(newPatient);
        }
      }).catch(err => console.log(err))
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
  for (var i = 1; i <= Math.ceil(totalMessages / patientsPerPage); i++) {
    pageNumbers.push(i);
  }

  const searchPatients = async () => {
    const res = await axios.get(`http://localhost:5000/searchByUserName?name=${searchText}&limit=${patientsPerPage}&pages=${currentPage}`);
    setTotalMessages(res.data.totalLength);
    setPatients(res.data.arrayList);
    setCurrentPage(1);
    if (searchText != '') {
      setPatientsPerPage(res.data.totalLength);
    } else {
      setPatientsPerPage(6);
    }
    setSearchText('')
  };

  return (
    <div>
      <Header />
      <div className='dashboard-top'>
        <button onClick={() => openModal()}><AddIcon fontSize='small' /> Add New Patient</button>
        <div className='dashboard-searchbar-container'>
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
          <button onClick={searchPatients}><SearchIcon fontSize='small' /> Search</button>
        </div>
        <button onClick={() => navigate('/emails')}><EmailIcon fontSize='small' /> See All Emails</button>
      </div>
      <div className='dashboard-patients'>
        {patients.map((patient, index) => (
          <div className='dashboard-patient'>
            <div className='dashboard-patient-left'>
              <h3 className='patient-name'>{patient.name}</h3>
              <p className='patient-phoneNumber'>{patient.phoneNumber}</p>
              <p className='patient-email'>{patient.email}</p>
              <div className='medicine-details-text'>Medicine Details</div>
              <ul className='medicine-details'>
                {patient.medicines.map((medicine) => (
                  <li>{medicine.medicineName} {medicine.dosage} {medicine.days}</li>
                ))}
              </ul>
            </div>
            <div className='dashboard-patient-right'>
              <button onClick={() => openDeleteModal(index)} className='danger'><DeleteIcon fontSize='small' /> Delete User</button>
              <button onClick={() => openEditModal(index)}><EditIcon fontSize='small' /> Edit User Details</button>
              <button onClick={() => openPhoneModal(index)}><PhoneForwardedIcon fontSize='small' /> Change Phone Number</button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <ul className='pagination'>
          {pageNumbers.map((number) => (
            <li key={number}>
              <button onClick={() => paginate(number)}>{number}</button>
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