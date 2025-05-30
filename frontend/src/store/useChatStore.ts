import {create} from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import axios from "axios";
import {ResponseError, useAuthStore, User} from "./useAuthStore.ts";

interface IMessage {
    senderId: string;
    receiverId: string
    text: string
    image: string
    createdAt:Date
    _id:string
}

interface IUserChatStore {
    messages: Array<IMessage>,
    users: Array<User>
    selectedUser: User | null,
    isUsersLoading: boolean,
    isMessagesLoading: boolean,

    getUsers: () => Promise<void>;
    getMessages: (userID: string) => Promise<void>;
    sendMessage: (messageData: { text: string, image: string }) => Promise<void>;
    subscribeToMessages: () => void;
    unsubscribeFromMessages: () => void;
    setSelectedUser: (selectedUser: User | null) => void;
}

export const useChatStore = create<IUserChatStore>((set, get) => ({
    messages: [],
    users: [],
    selectedUser:null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = (error.response.data as ResponseError['response']['data']).message
                    || 'Произошла ошибка во время получения пользователей';
                toast.error(errorMessage);
            } else {
                console.error(error);
                toast.error("Произошла непредвиденная ошибка");
            }
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userId: string) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = (error.response.data as ResponseError['response']['data']).message
                    || 'Произошла ошибка во время получения списка сообщений';
                toast.error(errorMessage);
            } else {
                console.error(error);
                toast.error("Произошла непредвиденная ошибка");
            }
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async (messageData: { text: string, image: string }) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser? selectedUser._id : ''}`, messageData);
            set({messages: [...messages, res.data]});
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = (error.response.data as ResponseError['response']['data']).message
                    || 'Произошла ошибка во время отправки сообщения';
                toast.error(errorMessage);
            } else {
                console.error(error);
                toast.error("Произошла непредвиденная ошибка");
            }
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState().socket;
    
        socket?.on("newMessage", (newMessage) => {
          const isMessageSentFromSelectedUser =
           newMessage.senderId === selectedUser._id;
           
          if (!isMessageSentFromSelectedUser) return;
    
          set({
            messages: [...get().messages, newMessage],
          });
        });
      },
    
      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
      },

    setSelectedUser: (selectedUser) => set({selectedUser}),
}));
