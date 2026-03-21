/**
 * Instructor Messaging Service
 * Handles group messaging between instructors and students
 */

import { db } from '@/firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { sendCustomWhatsAppMessage } from './notificationService';

export interface MessageGroup {
  id?: string;
  instructorId: string;
  instructorName: string;
  groupName: string;
  description: string;
  courseId: string;
  courseName: string;
  members: string[]; // User IDs
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
  lastMessageAt?: Date;
  isActive: boolean;
  groupType: 'class' | 'course' | 'announcement' | 'general';
  image?: string;
  settings?: {
    allowStudentCreated: boolean;
    notifyOnNewMessage: boolean;
    archiveOldMessages: boolean;
  };
}

export interface GroupMessage {
  id?: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderRole: 'instructor' | 'student';
  message: string;
  messageType: 'text' | 'image' | 'document' | 'announcement';
  attachmentUrl?: string;
  attachmentType?: string;
  createdAt: Date;
  editedAt?: Date;
  reactions?: {
    emoji: string;
    count: number;
    userIds: string[];
  }[];
  readBy: string[]; // User IDs who have read
  pinned: boolean;
}

export interface GroupMember {
  id?: string;
  groupId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  role: 'instructor' | 'student';
  joinedAt: Date;
  lastSeenAt?: Date;
  isMuted: boolean;
  notificationPreference: 'all' | 'mentions' | 'none';
}

export interface MessageNotification {
  id?: string;
  userId: string;
  groupId: string;
  groupName: string;
  messageId: string;
  senderName: string;
  message: string;
  type: 'message' | 'mention' | 'announcement';
  read: boolean;
  createdAt: Date;
}

/**
 * Create a new group
 */
export const createMessageGroup = async (groupData: MessageGroup): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'message_groups'), {
      ...groupData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      memberCount: groupData.members.length,
      settings: {
        allowStudentCreated: false,
        notifyOnNewMessage: true,
        archiveOldMessages: false,
        ...groupData.settings,
      },
    });

    console.log('Message group created:', docRef.id);
    return docRef.id;
  } catch (error: unknown) {
    console.error('Error creating message group:', error);
    return null;
  }
};

/**
 * Get all groups for an instructor
 */
export const getInstructorGroups = async (instructorId: string): Promise<MessageGroup[]> => {
  try {
    const q = query(collection(db, 'message_groups'), where('instructorId', '==', instructorId));

    const querySnapshot = await getDocs(q);
    const groups: MessageGroup[] = [];

    querySnapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        lastMessageAt: doc.data().lastMessageAt?.toDate(),
      } as MessageGroup);
    });

    return groups;
  } catch (error: unknown) {
    console.error('Error fetching instructor groups:', error);
    return [];
  }
};

/**
 * Get all groups for a student
 */
export const getStudentGroups = async (studentId: string): Promise<MessageGroup[]> => {
  try {
    const q = query(collection(db, 'message_groups'), where('members', 'array-contains', studentId));

    const querySnapshot = await getDocs(q);
    const groups: MessageGroup[] = [];

    querySnapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        lastMessageAt: doc.data().lastMessageAt?.toDate(),
      } as MessageGroup);
    });

    return groups;
  } catch (error: unknown) {
    console.error('Error fetching student groups:', error);
    return [];
  }
};

/**
 * Send a message to a group
 */
export const sendGroupMessage = async (messageData: GroupMessage): Promise<string | null> => {
  try {
    // Add message
    const docRef = await addDoc(collection(db, 'group_messages'), {
      ...messageData,
      createdAt: serverTimestamp(),
      readBy: [messageData.senderId],
      pinned: false,
    });

    // Update group's last message
    const groupRef = doc(db, 'message_groups', messageData.groupId);
    await updateDoc(groupRef, {
      lastMessage: messageData.message.substring(0, 100),
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Get group members for notification
    const groupDoc = await getDocs(
      query(collection(db, 'message_groups'), where('__name__', '==', messageData.groupId))
    );

    groupDoc.forEach(async (doc) => {
      const groupData = doc.data() as MessageGroup;

      // Notify members if instructor sends announcement
      if (messageData.senderRole === 'instructor' && messageData.messageType === 'announcement') {
        for (const memberId of groupData.members) {
          if (memberId !== messageData.senderId) {
            // Create notification
            await addDoc(collection(db, 'message_notifications'), {
              userId: memberId,
              groupId: messageData.groupId,
              groupName: groupData.groupName,
              messageId: docRef.id,
              senderName: messageData.senderName,
              message: messageData.message,
              type: 'announcement',
              read: false,
              createdAt: serverTimestamp(),
            });

            // Get member's phone for WhatsApp notification
            const memberDoc = await getDocs(
              query(collection(db, 'group_members'), where('userId', '==', memberId), where('groupId', '==', messageData.groupId))
            );
            memberDoc.forEach(async (memberData) => {
              const member = memberData.data() as GroupMember;
              if (member.userPhone && member.notificationPreference !== 'none') {
                const whatsappMessage = `
📢 *New Announcement - ${groupData.groupName}*

From: ${messageData.senderName}

${messageData.message}

SkillCoders
                `.trim();

                await sendCustomWhatsAppMessage(member.userPhone, whatsappMessage, 'announcement');
              }
            });
          }
        }
      }
    });

    console.log('Message sent successfully:', docRef.id);
    return docRef.id;
  } catch (error: unknown) {
    console.error('Error sending message:', error);
    return null;
  }
};

/**
 * Get messages from a group
 */
export const getGroupMessages = async (groupId: string, messageLimit: number = 50): Promise<GroupMessage[]> => {
  try {
    const q = query(
      collection(db, 'group_messages'),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc'),
      limit(messageLimit)
    );

    const querySnapshot = await getDocs(q);
    const messages: GroupMessage[] = [];

    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        editedAt: doc.data().editedAt?.toDate(),
      } as GroupMessage);
    });

    return messages.reverse(); // Return in chronological order
  } catch (error: unknown) {
    console.error('Error fetching group messages:', error);
    return [];
  }
};

/**
 * Subscribe to real-time messages
 */
export const subscribeToGroupMessages = (
  groupId: string,
  callback: (messages: GroupMessage[]) => void
): (() => void) => {
  const q = query(collection(db, 'group_messages'), where('groupId', '==', groupId), orderBy('createdAt', 'asc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages: GroupMessage[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        editedAt: doc.data().editedAt?.toDate(),
      } as GroupMessage);
    });
    callback(messages);
  });

  return unsubscribe;
};

/**
 * Add member to group
 */
export const addGroupMember = async (
  groupId: string,
  userId: string,
  userName: string,
  userEmail: string,
  userPhone?: string,
  role: 'instructor' | 'student' = 'student'
): Promise<boolean> => {
  try {
    // Add to group members collection
    await addDoc(collection(db, 'group_members'), {
      groupId,
      userId,
      userName,
      userEmail,
      userPhone,
      role,
      joinedAt: serverTimestamp(),
      isMuted: false,
      notificationPreference: 'all',
    });

    // Update group member count
    const groupRef = doc(db, 'message_groups', groupId);
    const groupDoc = await getDocs(
      query(collection(db, 'message_groups'), where('__name__', '==', groupId))
    );

    groupDoc.forEach(async (doc) => {
      const groupData = doc.data() as MessageGroup;
      await updateDoc(groupRef, {
        members: [...groupData.members, userId],
        memberCount: (groupData.members.length || 0) + 1,
        updatedAt: serverTimestamp(),
      });
    });

    // Send welcome message
    if (userPhone) {
      const welcomeMessage = `
👋 *Welcome to ${groupId}*

You have been added to a group on SkillCoders.

Start receiving important updates and class announcements here!

📱 Open SkillCoders app to view messages.
      `.trim();

      await sendCustomWhatsAppMessage(userPhone, welcomeMessage, 'notification');
    }

    return true;
  } catch (error: unknown) {
    console.error('Error adding group member:', error);
    return false;
  }
};

/**
 * Remove member from group
 */
export const removeGroupMember = async (groupId: string, userId: string): Promise<boolean> => {
  try {
    // Remove from group members
    const q = query(collection(db, 'group_members'), where('groupId', '==', groupId), where('userId', '==', userId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Update group
    const groupRef = doc(db, 'message_groups', groupId);
    const groupDoc = await getDocs(
      query(collection(db, 'message_groups'), where('__name__', '==', groupId))
    );

    groupDoc.forEach(async (doc) => {
      const groupData = doc.data() as MessageGroup;
      const updatedMembers = groupData.members.filter((id) => id !== userId);
      await updateDoc(groupRef, {
        members: updatedMembers,
        memberCount: updatedMembers.length,
        updatedAt: serverTimestamp(),
      });
    });

    return true;
  } catch (error: unknown) {
    console.error('Error removing group member:', error);
    return false;
  }
};

/**
 * Mark message as read
 */
export const markMessageAsRead = async (messageId: string, userId: string): Promise<boolean> => {
  try {
    const messageRef = doc(db, 'group_messages', messageId);
    const messageDoc = await getDocs(
      query(collection(db, 'group_messages'), where('__name__', '==', messageId))
    );

    messageDoc.forEach(async (doc) => {
      const messageData = doc.data() as GroupMessage;
      const readBy = messageData.readBy || [];
      if (!readBy.includes(userId)) {
        await updateDoc(messageRef, {
          readBy: [...readBy, userId],
        });
      }
    });

    return true;
  } catch (error: unknown) {
    console.error('Error marking message as read:', error);
    return false;
  }
};

/**
 * Get group statistics
 */
export const getGroupStatistics = async (groupId: string) => {
  try {
    const messages = await getGroupMessages(groupId, 1000);
    const members = await getDocs(
      query(collection(db, 'group_members'), where('groupId', '==', groupId))
    );

    const memberCount = members.size;
    const messageCount = messages.length;
    const uniqueSenders = new Set(messages.map((m) => m.senderId)).size;

    return {
      totalMessages: messageCount,
      totalMembers: memberCount,
      uniqueSenders,
      lastMessageDate: messages.length > 0 ? messages[messages.length - 1].createdAt : null,
    };
  } catch (error: unknown) {
    console.error('Error getting group statistics:', error);
    return null;
  }
};
