import React from 'react';
import './styles/index.css';

const CurrencySelector = ({ currency, onChange }) => (
  <div className="currency-selector">
    <label className="currency-selector__label" htmlFor="currency">
      Валюта
    </label>
    <select
      id="currency"
      className="currency-selector__select"
      value={currency}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="BYN">BYN</option>
      <option value="RUB">RUB</option>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
    </select>
  </div>
);

export default CurrencySelector;
