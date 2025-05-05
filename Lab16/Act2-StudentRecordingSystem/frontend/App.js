import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

const App = () => {
    const [students, setStudents] = useState([]);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/students");
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="container">
            <h1>Student Recording System</h1>
            <StudentForm fetchStudents={fetchStudents} />
            <StudentList students={students} fetchStudents={fetchStudents} />
        </div>
    );
};

export default App;
