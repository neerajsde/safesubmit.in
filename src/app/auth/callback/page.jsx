"use client"
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession } from "next-auth/react";
import apiHandler from "@/utils/apiHandler";
import Spinner from "@/components/spinner/Spinner";
import { useAppDispatch } from "@/lib/store/hooks/hook";
import { fetchUser } from "@/lib/store/features/user/AuthSlice";

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    let dispatch = useAppDispatch();

    async function  createUser(){
        try {
            const session = await getSession();

            if (!session || !session.user) {
                router.push("/login");
                return;
            }

            const payload = {
                username: session.user.name,
                email: session.user.email,
                imgUrl: session.user.image,
                otp: process.env.NEXT_PUBLIC_SECRET_CODE,
                password: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD,
            };

            const res = await apiHandler("/user", "POST", false, payload);

            if (res.success) {
                const loginRes = await apiHandler("/auth/login", "POST", false, payload);
                if (loginRes.success) {
                    localStorage.setItem("authToken", loginRes.data.token);
                    dispatch(fetchUser());
                } else {
                    router.push(`/signup?err_message=${encodeURIComponent(loginRes.message || "Something went wrong")}`);
                    return;
                }
                router.push("/dashboard");
            } else {
                router.push(`/signup?err_message=${encodeURIComponent(res.message || "Something went wrong")}`);
            }
        } catch (err) {
            console.error(err);
            router.push("/signup?err_message=Unexpected error during login");
        }
    }

    async function loginUser() {
        try{
            const session = await getSession();

            if (!session || !session.user) {
                router.push("/login");
                return;
            }

            const payload = {
                username: session.user.name,
                email: session.user.email,
                password: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD,
            };

            const res = await apiHandler("/auth/login", "POST", false, payload);

            if (res.success) {
                localStorage.setItem("authToken", res.data.token);
                dispatch(fetchUser());
                router.push("/dashboard");
            } else {
                router.push(`/login?err_message=${encodeURIComponent(res.message || "Something went wrong")}`);
            }
        }  catch (err) {
            router.push("/login?err_message=Unexpected error during login");
        }
    }

    useEffect(() => {
        const source = searchParams.get("source");
        if (source === "signup") {
            createUser();
            return;
        }
        else if (source === "login") {
            loginUser();
            return;
        }
        else{
            router.push("/login?err_message=Invalid source parameter");
            return;
        }
    }, [router]);

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <Spinner/>
            <p className="text-center mt-10">Setting up your account...</p>
        </div>
    )
}