import { useState } from "react";
import "./App.css";

const LIMITS = {
  Twitter: 280,
  Facebook: 63206,
  Instagram: 2200,
};

function App() {
  const [platform, setPlatform] = useState("Twitter");
  const [text, setText] = useState("");

  const limit = LIMITS[platform];
  const remaining = limit - text.length;
  const isOver = remaining < 0;
  const isEmpty = text.length === 0;

  return (
    <div className="container">
      <h1>Social Media Post Composer</h1>

      <label htmlFor="platform">Select Platform</label>
      <select
        id="platform"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        <option value="Twitter">Twitter</option>
        <option value="Facebook">Facebook</option>
        <option value="Instagram">Instagram</option>
      </select>

      <label htmlFor="post">Write Your Post</label>
      <textarea
        id="post"
        rows="8"
        cols="60"
        placeholder="Write your post here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <p className={`counter ${isOver ? "counter--over" : ""}`}>
        {remaining} characters left (limit: {limit})
      </p>

      <button disabled={isOver || isEmpty}>Publish</button>
    </div>
  );
}

export default App;
