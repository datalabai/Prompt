import { cookies } from "next/headers";
import { ChatLayout } from "@/components/chat/chat-layout";
import Link from "next/link";

export default function Home() {
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    
        <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8} />
    
  );
}
