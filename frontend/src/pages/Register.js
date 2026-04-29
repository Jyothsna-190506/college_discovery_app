import { useState } from "react";
import axios from "axios";

function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const handleRegister = async () => {
    await axios.post("http://localhost:5000/api/auth/register", data);
    alert("Registered!");
  };

  return (
    <div>
      <input
        placeholder="Name"
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
