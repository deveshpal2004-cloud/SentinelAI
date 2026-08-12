function ResultCard({ title, children }) {
  return (
    <div
      className="card"
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          marginBottom: "15px",
        }}
      >
        {title}
      </h2>

      <div>{children}</div>
    </div>
  );
}

export default ResultCard;