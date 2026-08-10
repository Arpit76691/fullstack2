// Unauthorized page
// Shown when a user tries to access a route their role doesn't allow.

import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1>403</h1>
      <p>Unauthorized Access</p>
      <p className="text-muted">
        Your role does not have permission to view this page.
      </p>
      <button className="btn" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;