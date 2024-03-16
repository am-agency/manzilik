// CheckoutComponent.tsx

import React, { useState } from 'react';
import { aiIcons } from '../../assets/icons/ai';
import CustomAlert from '../custom_alert';

interface CheckoutComponentProps {}

const CheckoutComponent: React.FC<CheckoutComponentProps> = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\s/g, ''); // Remove spaces
    if (/^\d{0,16}$/.test(value)) {
      setCardNumber(value);
    }
  };

  const handleCardNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(event.target.value);
  };

  const handleExpirationDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Add slash after 2 digits in expiration date
    const value = event.target.value.replace(/\s/g, ''); // Remove spaces
    if (/^\d{0,4}$/.test(value)) {
      if (value.length === 2 && expirationDate.length === 1) {
        // Add slash after 2 digits in expiration date (MM/YY)
        setExpirationDate(`${value}/`);
      } else {
        setExpirationDate(value);
      }
    }
  };

  const handleSecurityCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\s/g, ''); // Remove spaces
    if (/^\d{0,4}$/.test(value)) {
      setSecurityCode(value);
    }
  };

  const handlePayClick = () => {
    // Your payment processing logic here
    const isValid = validateForm();
    setIsFormValid(isValid);

    if (!isValid) {
      setErrorMessages(['Error message from payment gateway']);
    } else {
      // Perform payment processing
    }
  };

  const validateForm = () => {
    if (cardNumber.length === 16 && cardName.length > 0 && expirationDate.length === 4 && securityCode.length === 3) {
      return true;
    }
    return false;
  };

  return (
    <div className="checkout-container">
      {/* <div>
        <CustomAlert
          isBlocked
          text="Here is added the text of the error message from HyperPay"
          bgColor="rgb(255 59 48 / 18%)"
        />
      </div> */}
      <div className="card-details">
        <div className="input-group">
          <label htmlFor="cardNumber">Card Number</label>
          <div className="input-with-icon">
            <span className="card-icon">
              <img src={aiIcons.creditCard} alt="Credit Card Icon" />
            </span>
            <input type="text" id="cardNumber" value={cardNumber} onChange={handleCardNumberChange} />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="cardName">Card Holder Name</label>
          <input
            type="text"
            id="cardName"
            value={cardName}
            onChange={handleCardNameChange}
            placeholder="Name as it appears on card"
          />
        </div>
        <div className="d-flex">
          <div className="input-group half-width">
            <label htmlFor="expirationDate">Expiration Date</label>
            <input type="text" id="expirationDate" placeholder="MM/YY Or MM/YYYY" value={expirationDate} />
          </div>
          <div className="input-group half-width">
            <label htmlFor="securityCode">Security Code</label>
            <input
              type="text"
              id="securityCode"
              value={securityCode}
              onChange={handleSecurityCodeChange}
              placeholder="3 Or 4-digit Code"
            />
          </div>
        </div>
      </div>
      <button
        className={`pay-button ${isFormValid ? '' : 'disabled'}`}
        onClick={handlePayClick}
        disabled={!isFormValid}
      >
        Pay Now 120 SAR
      </button>
    </div>
  );
};

export default CheckoutComponent;
