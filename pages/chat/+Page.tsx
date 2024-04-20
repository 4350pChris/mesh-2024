import React, { useState } from "react";
import {Chat} from "./Chat";

export default function Page() {
  return (
    <>
      <h1>To-do List</h1>
      <Chat />
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      This page is interactive:
      <button type="button" onClick={() => setCount((count) => count + 1)}>
        Counter {count}
      </button>
    </div>
  );
}
