import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";

const Login = () => {
  const [data, setData] = useState({ email: "", code: "" });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8000/user/activate";
      const { data: res } = await axios.patch(url, data);
      localStorage.setItem("user", res.data);
      window.location = "/";
      console.log(res.message);
    } catch (error) {
      setError(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Verify Your Account</h1>
            <p>The code has been sent to your email</p>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Code"
              name="code"
              onChange={handleChange}
              value={data.code}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Activate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
