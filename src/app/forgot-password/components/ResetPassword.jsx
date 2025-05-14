"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import UpdatePassword from './UpdatePassword';
import apiHandler from '@/utils/apiHandler';
import { useSearchParams } from 'next/navigation';

const ResetPassword = () => {
    const searchParams = useSearchParams();
      const resetToken = searchParams.get("resetToken");
      const email = searchParams.get("email");
    const [isSentMail, setIsSentMail] = useState(false);
    const [apiError, setApiError] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    async function submitEmail(data) {
        setApiError('');
        let res = await apiHandler(`/settings/reset-password?email=${data.email}`);
        if(res.success){
            setIsSentMail(true);
            reset();
        }
        else{
            setApiError(res.message);
        }
    }

    useEffect(() => {
        if(email){
            submitEmail({email});
        }
    },[email]);

    if (isSentMail) {
        return (
            <div className='w-full h-[90vh] flex justify-center items-center bg-gray-100'>
                <div className='bg-white shadow-md rounded-lg p-8 gap-4 w-96 text-center'>
                    <h2 className='text-2xl font-semibold mb-4 text-green-600'>Email Sent Successfully</h2>
                    <p className='text-gray-700'>
                        We've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password.
                    </p>
                    <p className='text-sm text-gray-500 mt-4'>
                        If you don’t receive the email within a few minutes, please check your spam folder or try again.
                    </p>
                </div>
            </div>
        );
    }

    if(resetToken){
        return <UpdatePassword resetToken={resetToken}/>
    }

    return (
        <div className='w-full h-[90vh] p-2 md:p-4 flex justify-center items-center bg-gray-100'>
            <form onSubmit={handleSubmit(submitEmail)} className='bg-white shadow-md rounded-lg p-4 md:p-6 lg:p-8 gap-4 w-96 flex flex-col'>
                <h1 className='text-center text-xl md:text-2xl'>Reset Your Password</h1>
                {apiError && <div className='py-1 px-2 border rounded-sm border-red-500 text-red-500 text-sm'>{apiError}</div>}
                <div>
                    <label className="text-gray-700 text-sm font-medium">Email<span className='text-red-500'>*</span></label>
                    <input
                        type='email'
                        {...register("email", { required: true })}
                        className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-purple-500'}`}
                    />
                    {errors.email && <span className='text-red-500 text-sm'>This field is required</span>}
                </div>

                <input
                    type='submit'
                    className="w-full h-10 flex justify-center items-center cursor-pointer mt-4 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
                    value={isSubmitting ? "please wait..." : "submit"}
                    disabled={isSubmitting}
                />
            </form>
        </div>
    )
}

export default ResetPassword