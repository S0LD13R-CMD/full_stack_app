import { Component } from "react";

// Define the props for the ErrorModal component
interface ErrorModalProps {
  message: string; // Error message to display
  onClose: () => void; // Function to close the modal
}

class ErrorModal extends Component<ErrorModalProps> {
  render() {
    const { message, onClose } = this.props;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
        <div className="border border-7 border-secondary bg-base-300 p-6 rounded-lg shadow-lg w-100">
          <h2 className="text-3xl font-bold mb-4 text-center">Error</h2>
          <p className="mb-4 text-center">{message}</p>
          <div className="flex justify-center">
            <button onClick={onClose} className="btn btn-secondary">Close</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorModal;