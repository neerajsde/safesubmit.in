"use client"
import apiHandler from '@/utils/apiHandler';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";

const UpdatePassword = ({resetToken}) => {
    const [apiError, setApiError] = useState('');
    const [success, setSucess] = useState('');
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    async function submitData(data) {
        setApiError('');
        setSucess('');
        if(data.password !== data.confPass){
            setApiError("Password doesn't match");
            return;
        }

        let payload = {
            email: data.email,
            password: data.password
        }
        let res = await apiHandler(`/settings/reset-password?resetToken=${resetToken}`, "PUT", false, payload);
        if(res.success){
            setSucess(res.message);
            reset();
        }
        else{
            setApiError(res.message);
        }
    }

  return (
    <div className='w-full min-h-[90vh] py-8 flex justify-center items-center bg-gray-100'>
        <form onSubmit={handleSubmit(submitData)} className='bg-white shadow-md rounded-lg p-8 gap-4 w-96 flex flex-col'>
            <h1 className='text-center text-2xl'>Reset Password</h1>
            <div >
                <label className="text-gray-700 text-sm font-medium">Email<span className='text-red-500'>*</span></label>
                <input
                    type='email'
                    {...register("email", { required: true })}
                    className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-purple-500'}`}
                />
                {errors.email && <span className='text-red-500 text-sm'>This field is required</span>}
            </div>

            <div >
                <label className="text-gray-700 text-sm font-medium">New Password<span className='text-red-500'>*</span></label>
                <input
                    type='password'
                    {...register("password", { required: true })}
                    className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-500' : 'focus:ring-purple-500'}`}
                />
                {errors.password && <span className='text-red-500 text-sm'>This field is required</span>}
            </div>

            <div >
                <label className="text-gray-700 text-sm font-medium">Conform Password<span className='text-red-500'>*</span></label>
                <input
                    type='password'
                    {...register("confPass", { required: true })}
                    className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.confPass ? 'focus:ring-red-500' : 'focus:ring-purple-500'}`}
                />
                {errors.confPass && <span className='text-red-500 text-sm'>This field is required</span>}
            </div>

            {apiError && <div className='py-1 px-2 border rounded-sm border-red-500 text-red-500 text-sm'>{apiError}</div>}
            {success && <div className='py-1 px-2 border rounded-sm border-green-500 text-green-500 text-sm'>{success}</div>}

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

export default UpdatePassword