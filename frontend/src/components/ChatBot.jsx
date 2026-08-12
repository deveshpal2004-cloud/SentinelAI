import { useState } from "react";
import api from "../services/api";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setReply("");

      const res = await api.post("/chat", {
        incident: question,
      });

      console.log("AI Response:", res.data);

      // Backend response:
      // { reply: { response: "AI answer" } }

      const aiReply =
        res.data?.reply?.response ||
        res.data?.reply?.reply ||
        res.data?.reply ||
        "No response received.";

      setReply(
        typeof aiReply === "string"
          ? aiReply
          : JSON.stringify(aiReply)
      );

    } catch (err) {
      console.error("Chat Error:", err);
      setReply("Failed to contact AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "30px",
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,.1)",
      }}
    >
      <h2>🤖 AI Emergency Assistant</h2>

      <textarea
        rows={4}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask emergency related question..."
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
          marginTop: "10px",
        }}
      />

      <button
        className="btn"
        style={{ marginTop: "15px" }}
        onClick={askAI}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {reply && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f4f4f4",
            borderRadius: "10px",
            lineHeight: "1.6",
          }}
        >
          <b>🤖 AI Response</b>

          <p
            style={{
              marginTop: "10px",
              whiteSpace: "pre-line",
            }}
          >
            {reply}
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatBot;