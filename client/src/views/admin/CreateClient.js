import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { selectToken } from "../../store/authSlice";
import { useSelector } from "react-redux";
import { message } from "antd";
import { baseUrl } from "../../utils/constants.js";

const CreateClient = () => {
  const token = useSelector(selectToken);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [clientData, setClientData] = useState({
    id: null,
    name: "",
    industry: "",
    phone: "",
    email: "",
    password: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/api/client?page=${page}&limit=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClients(response.data.data.clients);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      message.error("Failed to fetch clients.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (client = {}) => {
    setClientData(client);
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    resetClientData();
  };

  const resetClientData = () => {
    setClientData({
      id: null,
      name: "",
      industry: "",
      phone: "",
      email: "",
      password: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, ...payload } = clientData;
      if (id) {
        // Update existing client
        await axios.put(`${baseUrl}/api/client/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("Client updated successfully!");
      } else {
        // Create new client
        await axios.post(`${baseUrl}/api/client`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("Client created successfully!");
      }

      fetchClients();
      handleCloseModal();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to save client.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(`${baseUrl}/api/client/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success("Client deleted successfully!");
        fetchClients();
      } catch (error) {
        message.error("Failed to delete client.");
      }
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page]);
  return (
    <div
      style={{
        backgroundColor: "#343a40",
        color: "white",
        minHeight: "100vh",
        paddingTop: "20px",
      }}
    >
      <h1 className="text-center mb-4">Clients</h1>
      <div
        className="d-flex justify-content-end"
        style={{ width: "80%", margin: "0 auto" }}
      >
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => handleShowModal()}
        >
          Add Client
        </Button>
      </div>
      <Table
        striped
        bordered
        hover
        variant="dark"
        style={{ backgroundColor: "#343a40", width: "80%", margin: "0 auto" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Industry</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center">
                Loading...
              </td>
            </tr>
          ) : clients.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No data available
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.industry}</td>
                <td>{client.phone}</td>
                <td>{client.email}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => handleShowModal(client)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(client.id)}
                    className="ml-2"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {clients.length > 0 && (
        <div
          className="d-flex justify-content-end mt-3"
          style={{ width: "80%", margin: "0 auto" }}
        >
          <Button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="mr-2"
          >
            Previous
          </Button>
          <span className="mr-2">
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <Modal show={modalShow} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {clientData.id ? "Edit Client" : "Add Client"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={clientData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="industry">
              <Form.Label>Industry</Form.Label>
              <Form.Control
                type="text"
                name="industry"
                value={clientData.industry}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={clientData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={clientData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>
                {clientData.id ? "New Password" : "Password"}
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={clientData.password}
                onChange={handleInputChange}
                required={!clientData.id}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              {clientData.id ? "Update Client" : "Add Client"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateClient;
