export const userData = [
    {
        id: 1,
        avatar: 'avatars/01.png',
        messages: [
            {
                id: 1,
                avatar: 'avatars/02.png',
                name: 'Jane Doe',
                message: 'Hey, Jakob',
            },
            {
                id: 2,
                avatar: 'avatars/02.png',
                name: 'Jakob Hoeg',
                message: 'Hey!',
            },
            {
                id : 3,
                avatar: 'avatars/01.png',
                name: 'Jane Doe',
                message: 'How are you?',
            },
            {
                id: 4,
                avatar: 'avatars/01.png',
                name: 'Jakob Hoeg',
                message: 'I am good, you?',
            },
            {
                id: 5,
                avatar: 'avatars/01.png',
                name: 'Jane Doe',
                message: 'I am good too!',
            },
            {
                id: 6,
                avatar: 'avatars/01.png',
                name: 'Jakob Hoeg',
                message: 'That is good to hear!'
            },
            {
                id: 7,
                avatar: 'avatars/02.png',
                name: 'Jane Doe',
                message: 'How has your day been so far?',
            },
            {
                id: 8,
                avatar: 'avatars/03.png',
                name: 'Jakob Hoeg',
                message: 'It has been good. I went for a run this morning and then had a nice breakfast. How about you?',
            },
            {
                id: 9,
                avatar: 'avatars/01.png',
                name: 'Jane Doe',
                message: 'I had a relaxing day. Just catching up on some reading.',
            }
        ],
        name: 'Jane Doe',
    },
    {
        id: 2,
        avatar: 'avatars/01.png',
        name: 'John Doe',
    },
    {
        id: 3,
        avatar: 'avatars/03.png',
        name: 'Elizabeth Smith',
    },
    {
        id: 4,
        avatar: 'avatars/04.png',
        name: 'John Smith',
    }
];

export type UserData = (typeof userData)[number];

export const loggedInUserData = {
    id: 5,
    avatar: 'avatars/01.png',
    name: 'Jakob Hoeg',
};

export type LoggedInUserData = (typeof loggedInUserData);

export interface Message {
    id: number;
    avatar: string;
    name: string;
    message: string;
}

export interface User {
    id: number;
    avatar: string;
    messages: Message[];
    name: string;
}