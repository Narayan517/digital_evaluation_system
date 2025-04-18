import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AdminDataContext } from "../context/AdminContext";

const AdminSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();

  const { admin, setAdmin } = useContext(AdminDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);

    try {
      const response = await axios.post(
        "http://localhost:8000/admin/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        const data = response.data;
        setAdmin(data.admin);
        localStorage.setItem("token", data.token);
        navigate("/adminDashboard");
      }
    } catch (error) {
      console.error("Error during admin registration:", error);
    }

    setEmail("");
    setName("");
    setPassword("");
    setAvatar(null);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-zinc-900">
      <div className="p-7 h-3-4 flex flex-col justify-between bg-zinc-700 border-2 border-gray-800 rounded-lg">
        <div>
          <h2 className="text-2xl font-bold mb-5">Admin Signup</h2>
          <form onSubmit={submitHandler} encType="multipart/form-data">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="file_input"
            >
              Upload file
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
            <p
              className="mt-1 text-sm text-gray-500 dark:text-gray-300"
              id="file_input_help"
            >
              SVG, PNG, JPG or GIF (MAX. 800x400px).
            </p>

            <h3 className="text-md font-medium mb-2">What's your name</h3>
            <div className="w-full mb-3">
              <input
                required
                className="bg-[#eeeeee] w-full rounded-lg px-4 py-1 border text-md placeholder:text-base"
                type="text"
                placeholder="enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <h3 className="text-md font-medium mb-2">What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#eeeeee] mb-3 rounded-lg px-4 py-1 border w-full text-md placeholder:text-base"
              type="email"
              placeholder="email@example.com"
            />

            <h3 className="text-md font-medium mb-2">Enter Password</h3>
            <input
              className="bg-[#eeeeee] mb-3 rounded-lg px-4 py-1 border w-full text-md placeholder:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder="password"
            />

            <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-1 w-full text-md placeholder:text-base">
              Create account
            </button>
          </form>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/admin/login" className="text-blue-600">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
