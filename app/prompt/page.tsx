// pages/mail.tsx

import { cookies } from "next/headers";
import Image from "next/image";

import { Mail } from "./components/mail";
import { mails } from "./data";
import { RightNotifications } from "@/components/rightpanel-notification";

export default function MailPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const collapsed = cookies().get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  
  let defaultCollapsed;
  if (collapsed && typeof collapsed.value === 'string') {
    try {
      defaultCollapsed = JSON.parse(collapsed.value);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      defaultCollapsed = undefined; // or some default value
    }
  } else {
    defaultCollapsed = undefined; // or some default value
  }

  return (
    <>
      <div className=" flex-col flex border  min-h-screen  overflow-y-auto">
        <Mail
          mails={mails}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
}
