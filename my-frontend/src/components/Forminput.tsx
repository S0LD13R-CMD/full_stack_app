import React from 'react';

// Define the props for the FormInput component
interface FormInputProps {
  label: string; // Label for the input field
  name: string; // Name attribute for the input field
  type: string; // Type of the input field (e.g., text, number)
  value: string | number; // Current value of the input field
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle input changes
}

// Functional component for rendering a form input with a label
const FormInput: React.FC<FormInputProps> = ({ label, name, type, value, onChange }) => {
  return (
    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="input input-bordered"
      />
    </div>
  );
};

export default FormInput;