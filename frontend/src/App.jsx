import { useEffect, useState } from "react";

function App() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/colleges")
      .then(res => res.json())
      .then(data => {
        setColleges(data);
        setLoading(false);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  if (loading) {
    return <h2>Loading colleges...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>College List</h1>
      <ul>
        {colleges.map((college, i) => (
          <li key={i}>{college}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

