import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { TeacherDataContext } from "../context/TeacherContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TeacherLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { teacher, setTeacher } = useContext(TeacherDataContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        const teacherData = {
            email: email,
            password: password,
        };

        const response = await axios.post(
            `http://localhost:8000/teacher/login`,
            teacherData
        );

        if (response.status === 200) {
            const data = response.data;
            console.log(data.teacher);
            setTeacher({
                email: data.teacher.email,
                name: data.teacher.name,
              });
            console.log(teacher)
            localStorage.setItem("token", data.token);
            navigate("/teacherDashboard");
        }

        setEmail("");
        setPassword("");
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-zinc-700">
            <div className="p-7 h-auto flex flex-col justify-center items-center border-0 border-gray-200 rounded-lg bg-zinc-800 text-white">
                <div className="p-7 pt-0 flex flex-col justify-between">
                    <h2 className="w-full items-center text-3xl font-bold mb-5">teacher Login</h2>

                    <form
                        onSubmit={(e) => {
                            submitHandler(e);
                        }}
                    >
                        <h3 className="text-lg font-medium mb-2">What's your email</h3>
                        <input
                            required
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            className="bg-zinc-200 mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base placeholder:text-zinc-700 text-black"
                            type="email"
                            placeholder="email@example.com"
                        />

                        <h3 className="text-lg font-medium mb-2">Enter Password</h3>

                        <input
                            className="bg-zinc-200 mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base placeholder:text-zinc-700 text-black"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            required
                            type="password"
                            placeholder="password"
                        />

                        <button className="bg-zinc-900 text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base">
                            Login
                        </button>
                    </form>
                    <p className="text-center">
                        New here?{" "}
                        <Link to="/teacher/signup" className="text-blue-600">
                            Create new Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TeacherLogin;