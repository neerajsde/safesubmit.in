import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoInformationCircleOutline } from "react-icons/io5";
import { signIn } from "next-auth/react";
import MdLoader from '@/components/spinner/MdLoader';
import apiHandler from '@/utils/apiHandler';
import Spinner from '@/components/spinner/Spinner';
import { useSearchParams } from 'next/navigation'; // ✅ Correct import

const UserForm = ({formData, setFormData, setIsSendOtp}) => {
    const searchParams = useSearchParams();
    let err_message = searchParams.get("err_message");
    const [isVisiablePass, setVisiablePass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [load, setLoad] = useState(false);

    function inputHandler(e){
        const {name, value} = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    useEffect(() => {
        if(err_message){
            setError(err_message);
        }
    }, [err_message]);

    // send otp to user email
    async function submitHandler(e){
        e.preventDefault();
        if(!formData.username || !formData.email || !formData.password){
            setError("Please fill all the fields.");
            return;
        }
        setLoading(true);
        // Perform sign up logic here
        const payload = {
            email: formData.email,
        }
        const response = await apiHandler('/auth/sendotp', 'POST', false, payload);
        // console.log("response: ", response);
        if(response.success){
            setIsSendOtp(true);
        }
        else{
            setError(response.message);
        }
        setLoading(false);
    }

    async function googleLoginHandler() {
        try {
            setLoad(true);
            // Redirect to a callback route after successful Google sign-in
            await signIn("google", {
                callbackUrl: "/auth/callback?source=signup"
            });
        } catch (error) {
            console.error("Login error:", error);
            setError("Google login failed.");
            setLoad(false);
        }
    }    
    
    return (
        <div className='relative'>
            <div className={`${load ? 'bg-[#fff6] w-full h-full flex justify-center items-center absolute top-0 left-0' : ' hidden'}`}>
                <Spinner/>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 text-center">Sign up</h2>
            <p className="text-gray-500 text-center text-sm mt-2">
                Already have an account? <Link href="/login" className="text-purple-600 font-medium">Login</Link>
            </p>

            {/* Form for User Registration */}
            <form className="mt-6" onSubmit={submitHandler}>
                {/* Username Input */}
                <div>
                    <label className="text-gray-700 text-sm font-medium">Your Name</label>
                    <input 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={inputHandler}
                        placeholder="Jhon Doe"
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                {/* Email Input */}
                <div className='mt-4'>
                    <label className="text-gray-700 text-sm font-medium">Email Address</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={inputHandler}
                        placeholder="you@example.com"
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* Password Input */}
                <div className="mt-4 relative">
                    <label className="text-gray-700 text-sm font-medium flex justify-between">
                        Password
                    </label>
                    <input 
                        type={isVisiablePass ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={inputHandler}
                        placeholder="Enter 6 characters or more"
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button className="text-xl cursor-pointer absolute right-2 top-8" type="button" onClick={() => setVisiablePass(!isVisiablePass)}>
                        {isVisiablePass ? (<AiOutlineEyeInvisible/>) : (<AiOutlineEye/>)}
                    </button>
                </div>

                {error && (<div className="w-full px-2 gap-1 bg-red-100 py-2 flex justify-start items-center border border-red-500 mt-4 rounded-md">
                    <IoInformationCircleOutline className="text-lg text-red-500"/>
                    <p className="text-red-500 text-sm">{error}</p>
                </div>)}

                {/* Sign up Button */}
                <button 
                    type="submit" 
                    className="w-full h-10 flex justify-center items-center cursor-pointer mt-4 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
                >
                    {loading ? (<MdLoader/>): "Create Account"}
                </button>
            </form>

            
            {/* OR Divider */}
            <div className="text-center my-4 text-gray-500 text-sm">or signup with</div>

            {/* Social Login Buttons */}
            <div className="flex gap-4">
                <button onClick={googleLoginHandler} className="w-1/2 flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 transition">
                    <FcGoogle className="text-xl"/>
                    Google
                </button>
                <button className="w-1/2 flex items-center justify-center border py-2 rounded-md hover:bg-gray-100 transition">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" className="w-5 h-5 mr-2"/>
                    Facebook
                </button>
            </div>
        </div>
    )
}

export default UserForm