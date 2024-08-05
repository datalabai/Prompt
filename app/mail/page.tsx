// pages/mail.tsx

import { cookies } from "next/headers";
import Image from "next/image";

import { Mail } from "./components/mail";
import { mails } from "./data";

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
      <div className="md:hidden border-4 border-red-400">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex ">
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
