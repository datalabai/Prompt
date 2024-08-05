import * as React from "react";
import { Input } from "@/components/ui/input";
import { addReply } from "@/app/firebase";
import { auth } from "@/app/firebase";

interface ReplySectionProps {
  postId: string;
  onReplySend: () => void;
}

export const ReplySection: React.FC<ReplySectionProps> = ({ postId, onReplySend }) => {
  const [replyText, setReplyText] = React.useState("");

  const handleReplySend = async () => {
    if (replyText.trim() !== "") {
      const newReply = {
        postId: postId,
        text: replyText,
        date: new Date().getTime(),
        user: auth.currentUser?.displayName,
      };
      try {
        await addReply(newReply); // Implement this function to add reply to Firebase
        setReplyText("");
        onReplySend(); // Trigger parent component's update logic
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleReplySend();
    }
  };

  return (
    <div className="p-2 bg-gray-100 rounded-lg mt-2">
      <Input
        placeholder="Reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-lg mt-2"
        onClick={handleReplySend}
      >
        Send
      </button>
    </div>
  );
};
