export const userData = [
    {
        id: "1",
        avatar: 'avatars/01.png',
        messages: [
            {
                id:"1",
                avatar: 'avatars/02.png',
                name: 'Jane Doe',
                message: 'Hey, Jakob',
            },
        ],
        name: 'Jane Doe',
    },
];

export type UserData = (typeof userData)[number];

export const loggedInUserData = {
    id: 5,
    avatar: 'avatars/01.png',
    name: 'Jakob Hoeg',
};

export type LoggedInUserData = (typeof loggedInUserData);

export interface Message {
    id: string;
    avatar: string;
    name: string;
    text: string;
}

export interface User {
    id: string;
    avatar: string;
    messages: Message[];
    name: string;
}