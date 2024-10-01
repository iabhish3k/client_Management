import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios'; 
import { message } from 'antd'; 
import { baseUrl } from '../utils/constants'; 

const CreateUser = () => {
  const { role, token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [userData, setUserData] = useState({ id: null, name: '', email: '', password: '', clientId: '' });
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pageSize = 5;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/user?page=${page}&limit=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setUsers(response.data.data.users);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      message.error("Failed to fetch users", 3);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/client/list`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setClients(response.data.data);
    } catch (error) {
      message.error("Error fetching clients", 3);
    }
  };

  const handleShowModal = (user = {}) => {
    setUserData(user);
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    setUserData({ id: null, name: '', email: '', password: '', clientId: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (userData.id) {
        const { id, name, email, password, clientId } = userData;
        const payload = { name, email, password, clientId };
        await axios.put(`${baseUrl}/api/user/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        message.success('User updated successfully', 3); 
      } else {
        await axios.post(`${baseUrl}/api/user`, userData, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        message.success('User created successfully', 3); 
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save user', 3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${baseUrl}/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('User deleted successfully', 3);
        fetchUsers();
      } catch (error) {
        message.error('Failed to delete user', 3);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
    if (role === 'admin') {
      fetchClients();
    }
  }, [page, role]);

  return (
    <div style={{ backgroundColor: '#343a40', color: 'white', minHeight: '100vh', paddingTop: '20px' }}>
      <h1 className="text-center mb-4">Users</h1>
      <div className="d-flex justify-content-end" style={{ width: '80%', margin: '0 auto' }}>
        <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
          Add User
        </Button>
      </div>
      <Table striped bordered hover variant="dark" style={{ backgroundColor: '#343a40', width: '80%', margin: '0 auto' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            {role === 'admin' && <th>Client</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center">Loading...</td>
            </tr>
          ) : users.length <= 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No data available</td>
            </tr>
          ) : (
            Array.isArray(users) && users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {role === 'admin' && <td>{user.Client.name}</td>}
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(user)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(user.id)} className="ml-2">
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      {Array.isArray(users) && users.length > 0 && (
        <>
          <div className="d-flex justify-content-end mt-3" style={{ width: '80%', margin: '0 auto' }}>
            <div className="d-flex align-items-center">
              <Button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="mr-2"
              >
                Previous
              </Button>
              <span className="mr-2">Page {page} of {totalPages}</span>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
      <Modal show={modalShow} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{userData.id ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={userData.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={userData.email} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>{userData.id ? 'New Password' : 'Password'}</Form.Label>
              <Form.Control type="text" name="password" value={userData.password} onChange={handleInputChange} required={!userData.id} />
            </Form.Group>
            {role === 'admin' && (
              <Form.Group controlId="clientId">
                <Form.Label>Client</Form.Label>
                <Form.Control as="select" name="clientId" value={userData.clientId} onChange={handleInputChange}>
                  <option value="">Select Client</option>
                  {Array.isArray(clients) && clients.map((client) => (
                    <option key={client.id} value={client.id}>{`${client.name} || ${client.email}`}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {userData.id ? 'Update User' : 'Add User'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateUser;
