import {create} from "zustand";
import {axiosInstance} from "../lib/axios.ts";
import toast from "react-hot-toast";
import axios from "axios";
import {io} from "socket.io-client";
import {Socket} from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export interface User {
    id: string;
    _id: string;
    email: string
    fullName: string
    password: string
    profilePic: string
    createdAt:Date;
    updatedAt:Date
}

export interface SignupData {
    fullName: string,
    email: string,
    password: string,
}

export interface LoginData {
    email: string;
    password: string
}
export type ResponseError = {
    response:{
        data : {
            message:string
        }
    }
}


interface AuthStoreState {
    authUser: User | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    onlineUsers: string[];
    socket:null | Socket

    checkAuth: () => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    login: (data: LoginData) => Promise<void>;
    logout:() => Promise<void>;
    updateProfile: (data: { profilePic: string}) => Promise<void>;
    connectSocket:() => void;
    disconnectSocket:() => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers:[],
    socket:null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Аккаунт успешно создан");

            get().connectSocket()
        } catch (error:unknown) {
            if(axios.isAxiosError(error) && error.response) {
                const errorMessage = (error.response.data as ResponseError['response']['data']).message
                    || 'Произошла ошибка во время регистрации';
                toast.error(errorMessage);
            } else {
                console.error(error);
                toast.error("Произошла непредвиденная ошибка");
            }
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Вы успешно вошли в систему");
            get().connectSocket()
        } catch (error:unknown) {
            if(axios.isAxiosError(error) && error.response) {
                const errorMessage = (error.response.data as ResponseError['response']['data']).message
                    || 'Произошла ошибка при входе в систему';
                toast.error(errorMessage);
            } else {
                console.error(error);
                toast.error("Произошла непредвиденная ошибка");
            }
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null });
            toast.success("Вышли из системы успешно");
            get().disconnectSocket()
        }
        catch (error:unknown) {
            if(axios.isAxiosError(error) && error.response) {
                const errorMessage = (error.response.data as ResponseError['response']['data']).message
                    || 'Произошла ошибка при выходе из системы';
                toast.error(errorMessage);
            } else {
                console.error(error);
                toast.error("Произошла непредвиденная ошибка");
            }
        }
    },

    updateProfile: async (data: { profilePic: string  }) => {
       set({ isUpdatingProfile: true });
       try {
           const res = await axiosInstance.put("/auth/update-profile", data);
           set({ authUser: res.data });
           toast.success("Профиль успешно обновлен");
       } catch (error:unknown) {
           if(axios.isAxiosError(error) && error.response) {
               const errorMessage = (error.response.data as ResponseError['response']['data']).message
                   || 'Произошла ошибка при обновлении профиля';
               toast.error(errorMessage);
           } else {
               console.error(error);
               toast.error("Произошла непредвиденная ошибка");
           }
       } finally {
           set({ isUpdatingProfile: false });
       }
    },

    connectSocket:() => {
        const {authUser} = get()
        if (!authUser || get().socket?.connected) return

        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id
            }
        });
        socket.connect()
        set({socket :socket})

        socket.on('getOnlineUsers', (userIds:string[]) => {
            set({onlineUsers:userIds})
        })
    },


    disconnectSocket:() => {
        if(get().socket?.connected) {
            get().socket?.disconnect()
        }
    }
}));
