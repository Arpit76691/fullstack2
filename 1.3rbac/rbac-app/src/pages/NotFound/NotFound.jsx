// NotFound page — 404

import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Page not found</p>
      <Link className="btn" to="/dashboard">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;