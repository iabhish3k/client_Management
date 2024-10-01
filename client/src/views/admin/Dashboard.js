import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, Modal, Form } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import io from "socket.io-client";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FiDownload } from "react-icons/fi";
import { Chart } from "chart.js";
import { useSelector } from "react-redux";
import { selectToken } from "../../store/authSlice";
import axios from "axios"; // Import axios
import { baseUrl } from "../../utils/constants";
const socket = io(baseUrl);
Chart.register(ChartDataLabels);

const AdminDashboard = () => {
  // Access the token from Redux store
  const token = useSelector(selectToken);
  const [reportData, setReportData] = useState({
    today: [],
    last7Days: [],
    thisMonth: [],
  });

  const [currentReport, setCurrentReport] = useState("today");
  const [showModal, setShowModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState("");
  const currentDate = new Date().toISOString().split("T")[0];

  // Fetch initial report data from the API
  const fetchReportData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/report/mis-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  // Listen for data from the socket server
  useEffect(() => {
    fetchReportData();
    socket.on("misReport", (data) => {
      console.log("Received MIS Report:", data);
      setReportData(data);
    });

    return () => {
      socket.off("misReport");
    };
  }, []);

  // Generate data for the Pie chart based on the selected report
  const generateChartData = () => {
    const data = reportData[currentReport] || [];
    const labels = data.map((item) => item.category);
    const counts = data.map((item) => item.count);
    const colors = ["#28a745", "#ffc107", "#a3231f", "#d6204e"];

    return {
      datasets: [
        {
          data: counts,
          backgroundColor: colors,
          hoverOffset: 4,
        },
      ],
      labels,
    };
  };

  // Chart options with datalabel configuration
  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      datalabels: {
        color: "white",
        display: true,
        anchor: "center",
        align: "center",
        formatter: (value) => {
          return value;
        },
      },
    },
  };

  // Function to handle download report
  const downloadReport = async () => {
    if (!fromDate || !toDate) {
      setError("Please enter both dates.");
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError("From Date must be earlier than To Date.");
      return;
    }

    setError("");
    try {
      const response = await axios.get(
        `${baseUrl}/api/report/mis-download?fromDate=${fromDate}&toDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "MISReport.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#343a40",
        color: "white",
        minHeight: "100vh",
        paddingTop: "20px",
      }}
    >
      <Container>
        <div className="d-flex justify-content-end mt-3">
          <Button
            variant="outline-primary"
            onClick={() => setShowModal(true)}
            className="me-3 mt-3"
          >
            <FiDownload
              size={30}
              style={{ cursor: "pointer", color: "white" }}
              title="Download Report"
            />
          </Button>
        </div>
        <div
          className="chart-container"
          style={{ width: "40%", margin: "0 auto" }}
        >
          <Pie data={generateChartData()} options={chartOptions} />
        </div>

        <ButtonGroup className="mb-3 d-flex justify-content-center mt-5">
          <Button
            variant={currentReport === "today" ? "primary" : "outline-primary"}
            onClick={() => setCurrentReport("today")}
          >
            Today
          </Button>
          <Button
            variant={
              currentReport === "last7Days" ? "primary" : "outline-primary"
            }
            onClick={() => setCurrentReport("last7Days")}
          >
            Last 7 Days
          </Button>
          <Button
            variant={
              currentReport === "thisMonth" ? "primary" : "outline-primary"
            }
            onClick={() => setCurrentReport("thisMonth")}
          >
            Last 30 Days
          </Button>
        </ButtonGroup>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Download Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <div className="text-danger">{error}</div>}
            <Form>
              <Form.Group controlId="fromDate">
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  value={fromDate}
                  max={currentDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="toDate">
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="date"
                  value={toDate}
                  max={fromDate ? fromDate : currentDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={downloadReport}>
              Download
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminDashboard;
