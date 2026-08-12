import { FaSpinner } from "react-icons/fa";

function LoadingSpinner() {
  return (
    <div className="loading">
      <FaSpinner className="spinner" />
      <p>Analyzing Emergency...</p>
    </div>
  );
}

export default LoadingSpinner;