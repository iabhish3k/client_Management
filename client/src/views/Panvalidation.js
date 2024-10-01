import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { debounce } from 'lodash';
import { useSelector } from 'react-redux';
import { selectToken } from '../store/authSlice';

const Panvalidation = () => {
  const  token  = useSelector(selectToken);
  const [pan, setPan] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debounced function to call PAN validation API
  const validatePan = async (pan) => {
    if (!pan) {
      setValidationResult(null);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/panvalidation', { pan }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setValidationResult({ success: true, msg: response.data.msg, data: response.data.data.data });
    } catch (error) {
      setValidationResult({
        success: false,
        message: error.response?.data?.message || 'Error validating PAN',
      });
    } finally {
      setLoading(false);
    }
  };

  // Use useCallback to memoize the debounced function
  const debouncedValidatePan = useCallback(
    debounce((term) => {
      validatePan(term);
    }, 300), // 300ms delay
    []
  );

  // Handle PAN input change
  const handlePanChange = (e) => {
    const { value } = e.target;
    setPan(value);
    debouncedValidatePan(value); // Call the debounced function
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedValidatePan.cancel(); 
    };
  }, [debouncedValidatePan]);

  return (
    <div style={{ backgroundColor: '#343a40', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <h1 className="text-center mb-4">PAN Validation</h1>
      <div className="d-flex justify-content-center mb-4">
        <Form.Group controlId="pan" style={{ width: '400px' }}>
          <Form.Control
            type="text"
            placeholder="Enter your PAN"
            value={pan}
            onChange={handlePanChange}
            style={{ borderColor: loading ? 'orange' : '' }} 
          />
        </Form.Group>
      </div>

      {loading && <p className="text-center">Validating PAN...</p>}

      {validationResult && (
        <div className="text-center" style={{ marginTop: '10px' }}>
          <p style={{ color: validationResult.success ? 'green' : 'red' }}>
            {validationResult.success ? (
              <>
                <div>{validationResult.msg}</div>
                <br />
                <strong style={{ color: 'white' }}>Details:</strong>
                <div style={{ color: 'white' }}>
                  <div>First Name: {validationResult.data?.first_name || "N/A"}</div>
                  <div>Middle Name: {validationResult.data?.middle_name || "N/A"}</div>
                  <div>Last Name: {validationResult.data?.last_name || "N/A"}</div>
                  <div>PAN Number: {validationResult.data?.pan_number || "N/A"}</div>
                  <div>DOB Match: {validationResult.data?.dob_match || "N/A"}</div>
                  <div>PAN Active: {validationResult.data?.pan_active || "N/A"}</div>
                  <div>Aadhaar Seeding Status: {validationResult.data?.aadhaar_seeding_status || "N/A"}</div>
                </div>
              </>
            ) : validationResult.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Panvalidation;
