import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  value: string | number;  // Only handle string or number types
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

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