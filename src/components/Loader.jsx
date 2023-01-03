import { loader } from '../assets'

export default function Loader(){
    return (
        <div className='fixed inset-0 z-10 h-screen bg-black opacity-70 flex items-center justify-center flex-col '>
            <img src={loader} alt='loader' className='w-[100px] h-[100px] object-contain ' />

            <p className='mt-[20px] text-white font-epilogue font-bold text-[20px] text-center '>
                Transaction is in progress <br /> Please wait...
            </p>
        </div>
    )
}