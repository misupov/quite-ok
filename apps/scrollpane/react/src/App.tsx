import { useState } from "react";
import "./App.css";
import { ScrollPanel } from "@quite-ok/scrollpanel-react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div
        style={{ width: 400, height: 400, display: "grid", overflow: "hidden" }}
      >
        <ScrollPanel scrollWidth={10000} scrollHeight={10000}>
          <div>asd</div>
        </ScrollPanel>
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
