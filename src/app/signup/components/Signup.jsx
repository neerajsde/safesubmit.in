"use client"
import React, { useState } from 'react'
import UserForm from './UserForm';
import OtpForm from './OtpForm';

const Signup = () => {
    const [isSentOtp, setIsSendOtp] = useState(false);
    const [formData, setFormData] = useState({
        username:"",
        email:"",
        password:""
    });

    if(isSentOtp){
        return (
            <OtpForm
                formData={formData} 
                setIsSendOtp={setIsSendOtp}
            />
        )
    }

    return (
        <UserForm 
            formData={formData} 
            setFormData={setFormData}
            setIsSendOtp={setIsSendOtp}
        />
    )
}

export default Signup