import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'; // Adjust the import path as needed

interface CustomToastProps {
  item: {
    photo: string;
    name: string;
    text: string;
    read: boolean;
  };
}

const CustomToast: React.FC<CustomToastProps> = ({ item }) => (
  <div className="flex w-full flex-col gap-1">
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

export default CustomToast;
