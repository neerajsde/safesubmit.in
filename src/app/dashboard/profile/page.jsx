import MainProfile from "@/components/dashboard/profile/MainProfile";

export const metadata = {
    title: "Dahboard - Profile",
    description: "Generated by create next app",
};

export default function settings(){
    return (
        <div className='w-full p-2 md:p-4 min-h-screen'>
            <MainProfile/>
        </div>
    )
}