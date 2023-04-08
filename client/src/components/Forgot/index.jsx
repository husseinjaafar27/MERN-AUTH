import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { Link, useNavigate } from "react-router-dom";

const Forgot = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8000/user/resetPassword";
      const { data: res } = await axios.post(url, data);
      navigate("/validateResetCode");
      console.log(res.message);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Find Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Search
            </button>
            <Link to="/signup">
              <h4>back</h4>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
