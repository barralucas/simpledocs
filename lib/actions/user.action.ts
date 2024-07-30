'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
        const { data } = await clerkClient.users.getUserList({
            emailAddress: userIds
        });

        const users = data.map((user: any) => ({
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            avatar: user.imageUrl
        }));

        const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));

        return parseStringify(sortedUsers);
    } catch (error) {
        console.log(`Error fetching clerk users: ${error}`);
    }
}

export const getDocumentUsers = async (
    { roomId, currentUser, text }:
        { roomId: string, currentUser: any, text: string }
) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser.email);

        if (text.length) {
            const lowerCaseText = text.toLowerCase();

            const filteredUsers = users.filter((email) => email.toLowerCase().includes(lowerCaseText));

            return parseStringify(filteredUsers);
        }

        return parseStringify(users);
    } catch (error) {
        console.log(`Error fetching document users: ${error}`);
    }
};