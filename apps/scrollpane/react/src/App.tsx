import { useState } from "react";
import "./App.css";
import { ScrollPanel } from "@quite-ok/scrollpanel-react";

function App() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  return (
    <>
      <div
        style={{
          width: 400,
          height: 400,
          display: "grid",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <ScrollPanel
          scrollWidth={2000}
          scrollHeight={2000}
          onViewportChange={(x, y) => {
            setX(-x);
            setY(-y);
          }}
        >
          <div style={{ position: "absolute", left: x, top: y }}>
            asd
            <br />
            asd
            <br />
            asd
            <br />
            asd
            <br />
          </div>
        </ScrollPanel>
      </div>
      <h1>Vite + React</h1>
    </>
  );
}

export default App;
