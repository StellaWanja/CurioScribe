import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div>
      404 not found <Link to="/">Back to home page</Link>
    </div>
  );
};

export default ErrorPage;
