import { useData } from 'vike-react/useData';
import {Chat} from "./Chat";
import type { Data } from './+data';

export default function Page() {
  const { conversation, messages } = useData<Data>()
  return (
    <>
      <h1 className="text-4xl">Customer Chat</h1>
      <Chat conversation={conversation} messages={messages} />
    </>
  );
}
