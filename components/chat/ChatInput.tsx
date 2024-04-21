import { useState } from "react";

export default function ChatInput(props: { onSubmit: (text: string) => Promise<unknown> }) {
  const [draft, setDraft] = useState("");

  return (
    <form
      className="flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        if (draft === "") return;
        await props.onSubmit(draft);
        setDraft("");
      }}
    >
      <input
        type="text"
        className="flex-1 input input-bordered"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button type="submit" className="btn">
        Send
      </button>
    </form>
  );
}
