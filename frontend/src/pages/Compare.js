import { useLocation } from "react-router-dom";

function Compare() {
  const { state } = useLocation();
  const colleges = state || [];

  if (colleges.length < 2) {
    return <h3 className="p-4">Select at least 2 colleges</h3>;
  }

  return (
    <div className="container mt-4">
      <h2>📊 College Comparison</h2>

      <table className="table table-bordered mt-3 text-center">
        <thead>
          <tr>
            <th>Feature</th>
            {colleges.map((c) => (
              <th key={c._id}>{c.name}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>📍 Location</td>
            {colleges.map((c) => (
              <td key={c._id}>{c.location}</td>
            ))}
          </tr>

          <tr>
            <td>💰 Fees</td>
            {colleges.map((c) => (
              <td key={c._id}>₹{c.fees}</td>
            ))}
          </tr>

          <tr>
            <td>💼 Placement %</td>
            {colleges.map((c) => (
              <td key={c._id}>{c.placement || "80%"}</td>
            ))}
          </tr>

          <tr>
            <td>⭐ Rating</td>
            {colleges.map((c) => (
              <td key={c._id}>{c.rating || "4.2"}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Compare;
