import { useState } from "react";
import "./App.css";
import { ScrollBar } from "@quite-ok/scrollbar-react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div
        style={{ width: 400, height: 400, display: "grid", overflow: "hidden" }}
      >
        <ScrollBar scrollWidth={10000} scrollHeight={1000}>
          <div>asd</div>
        </ScrollBar>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
