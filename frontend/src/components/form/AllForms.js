import React, { useState, useEffect } from "react";
import { retrieveAllFormsForUserApiService } from "../../api/FormApiService";
import Navbar from "../home/Navbar/Navbar";

const AllForms = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId || !token) {
          throw new Error("User ID or token is missing");
        }
        const response = await retrieveAllFormsForUserApiService(userId, token);
        const formattedData = response.map((form) => ({
          ...form,
          link: form.link === 'null' ? null : form.link,
        }));
        setFormData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError(error.message || 'An error occurred while fetching form data');
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userId, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Array.isArray(formData)) {
    return (
      <div>Data received from the server is not in the expected format</div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container card mt-5 md-5">
        {formData.length > 0 ? (
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Form ID</th>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Link</th>
                <th scope="col">User ID</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((form) => (
                <tr key={form.formId}>
                  <td>{form.formId}</td>
                  <td>{form.title}</td>
                  <td>{form.description}</td>
                  <td>
                    <a href={form.link}>{form.link}</a>
                  </td>
                  <td>{form.userId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No form data available</div>
        )}
      </div>
    </div>
  );
};

export default AllForms;