import {create} from "zustand";
import {axiosInstance} from "../lib/axios.ts";
import toast from "react-hot-toast";
import axios from "axios";

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

    checkAuth: () => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    login: (data: LoginData) => Promise<void>;
    logout:() => Promise<void>;
    updateProfile: (data: { profilePic: string}) => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers:[],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
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
    }
}));
