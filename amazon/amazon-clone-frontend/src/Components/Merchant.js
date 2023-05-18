import React, { useState } from 'react';
import axios from '../axios';

function Merchant() {
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [nationalIdDocument, setNationalIdDocument] = useState(null);
  const [orgDocument, setOrgDocument] = useState(null);

  const handleBusinessNameChange = (event) => {
    setBusinessName(event.target.value);
  };

  const handleBusinessAddressChange = (event) => {
    setBusinessAddress(event.target.value);
  };

  const handleNationalIdDocumentChange = (event) => {
    setNationalIdDocument(event.target.files[0]);
  };

  const handleOrgDocumentChange = (event) => {
    setOrgDocument(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('businessName', businessName);
    formData.append('businessAddress', businessAddress);
    formData.append('nationalIdDocument', nationalIdDocument);
    formData.append('orgDocument', orgDocument);

    axios.post("/merchant-registration", formData)
    .then((response) => {
      console.log('Merchant registration successful:', response.data);
      // Redirect to confirmation page or display success message
    })
    .catch((error) => {
      console.error('Merchant registration failed:', error);
      // Display error message to user
    });
};



  return (
    <div>
      <h2>Merchant Page</h2>
      
      
        <h3>Become a Merchant</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="business-name">Business Name:</label>
          <input type="text" id="business-name" name="business-name" value={businessName} onChange={handleBusinessNameChange} />

          <label htmlFor="business-address">Business Address:</label>
          <input type="text" id="business-address" name="business-address" value={businessAddress} onChange={handleBusinessAddressChange} />

          <label htmlFor="national-id-document">National ID Document:</label>
          <input type="file" id="national-id-document" name="national-id-document" onChange={handleNationalIdDocumentChange} />

          <label htmlFor="org-document">Organization Document:</label>
          <input type="file" id="org-document" name="org-document" onChange={handleOrgDocumentChange} />

          <button type="submit">Submit</button>
        </form>
    
    </div>
  );
}

export default Merchant;
