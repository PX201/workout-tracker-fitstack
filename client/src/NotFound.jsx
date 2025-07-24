import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 text-danger">404</h1>
      <p className="lead">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
