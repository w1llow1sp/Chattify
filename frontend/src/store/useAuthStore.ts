import {create} from "zustand";
import {axiosInstance} from "../lib/axios.ts";
import toast from "react-hot-toast";

interface User {
    id: string;
    username: string;
    email: string;
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

    checkAuth: () => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    login: (data: LoginData) => Promise<void>;
    logout:() => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

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
            toast.success("Account created successfully");
        } catch (error) {
            if(error instanceof Error){
                toast.success(error.message);
            } else {
                console.error(error)
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
            toast.success("Logged in successfully");
        } catch (error:unknown) {
            if(error instanceof Error){
                toast.success(error.message);
            } else {
                console.error(error)
            }
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error:unknown) {
            if(error instanceof Error){
                toast.success(error.message);
            } else {
                console.error(error)
            }
        }
    },
}));
