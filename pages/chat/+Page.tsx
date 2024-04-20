import {Chat} from "./Chat";

export default function Page() {
  return (
    <>
      <h1 className="text-4xl">Customer Chat</h1>
      <Chat conversationId='customer' />
    </>
  );
}
