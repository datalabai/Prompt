import React from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'; // Adjust the import path as needed
import { toast } from 'react-toastify';

interface CustomToastProps {
  item: {
    photo: string;
    name: string;
    text: string;
    read: boolean;
  };
  toastId: string; // Ensure this prop is passed correctly
}

const CustomToast: React.FC<CustomToastProps> = ({ item, toastId }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/expert?id=${toastId}`);
    toast.dismiss(toastId); // Dismiss the toast when clicked
  };

  return (
    <div
      className="flex w-full h-full p-2 flex-col gap-1 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className="flex items-start gap-4 text-sm">
          <Avatar>
            <AvatarImage src={item.photo} alt={item.name} />
            <AvatarFallback>
              {item.name
                .split(" ")
                .map((chunk) => chunk[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="font-semibold flex">
              {item.name}
              {!item.read && (
                <span className="flex h-2 w-2 mt-1 ml-1 rounded-full bg-blue-600" />
              )}
            </div>
            <div className="line-clamp-1 text-xs">
              {item.text.substring(0, 300)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomToast;
