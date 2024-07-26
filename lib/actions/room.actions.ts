'use server';

import { nanoid } from 'nanoid';
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { parseStringify } from '../utils';

export const createDocument = async (userId: string, email: string) => {
    const roomId = nanoid();

    try {
        const metadata = {
            creatorId: userId,
            email,
            title: 'Untitled Document'
        }

        const usersAccesses: RoomAccesses = {
            [email]: ['room:write']
        }

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: ['room:write']
        });

        revalidatePath('/');

        return parseStringify(room);
    } catch (error) {
        console.log(`Error creating document: ${error}`);
    }
};

export const getDocument = async (roomId: string, userId: string) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        // const hasAccesss = Object.keys(room.usersAccesses).includes(userId);

        // if (!hasAccesss) {
        //     throw new Error('You do not have access to this document');
        // }

        return parseStringify(room);
    } catch (error) {
        console.log(`Error fetching document: ${error}`);
    }
}

export const updateDocument = async (roomId: string, title: string) => {
    try {
        const room = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            }
        });

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(room);
    } catch (error) {
        console.log(`Error updating document: ${error}`);
    }
}