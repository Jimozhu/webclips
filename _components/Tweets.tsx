import { useState } from "npm:preact/hooks";

export default function Tweets({ id }: { id: string; }) {
  const [toot, setToot] = useState("");
  return (
    <>
      <div>
        x{id}x{toot}
        <button onClick={() => setToot("x" + id)}>toot</button>
      </div>
    </>
  );
}
