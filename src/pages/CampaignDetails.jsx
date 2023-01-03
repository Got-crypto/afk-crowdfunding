import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useStateContext } from '../context'
import { CustomButton, CountBox } from '../components'
import { calculateBarPercentage, daysLeft } from '../utils'
import { thirdweb } from '../assets'


const CampaignDetails = () => {

  const { state } = useLocation()

  const { getDonations, contract, address, donate, getCampaigns } = useStateContext()

  const [isLoading, setIsLoading] = useState()
  const [amount, setAmount] = useState('')
  const [donators, setDonators] = useState([])
  const [userCampaigns, setUserCampaigns] = useState([])

  const remainingDays = daysLeft(state.deadline)

  useEffect(()=>{
    const fetchDonators = async () => {
      const response = await getDonations(state.pId)

      const allCampaigns = await getCampaigns()

      const usercampaigns = allCampaigns.filter( campaign => campaign.owner === state.owner )

      setUserCampaigns(usercampaigns)

      setDonators(response)
    }

    if( contract ) fetchDonators()
  }, [contract, address])

  const handleDonate = async () => {
    setIsLoading(true)

    await donate(state.pId, amount)

    setIsLoading(false)
  }

  return (
    <div>
      {isLoading && 'Loading...'}
      <div className='w-full flex md:flex-row flex-col mt-10 gap-[30px] '>
        <div className='flex-1 flex-col'>
          <img src={state.image} alt='campaign' className='w-full h-[410px] object-cover rounded-xl ' />
          <div className='relative w-full h-[5px] bg-[#3a3a43] mt-2 ' >
              <div className='absolute h-full bg-[#4acd8d] ' style={{width:`${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%'}} >

              </div>
          </div>
        </div>
        <div className='flex md:w-[150px] w-full flex-wrap justify-center gap-[30px] '>
          <CountBox title='Days Left' value={remainingDays} />
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
          <CountBox title="Total Backers" value={donators?.length} />
        </div>
      </div>
      <div className='mt-[60px] flex lg:flex-row flex-col gap-5 '>
        <div className='flex-[2] flex flex-col gap-[40px] '>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase ">Creator</h4>

            <div className='mt-[20px] flex flex-row items-center flex-wrap gap-[14px] '>
              <div className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer '>
                <img src={thirdweb} alt='user' className='w-[60%] h-[60%] object-contain ' />
              </div>
              <div>
                <h4 className='font-epilogue font-semibold text-[14px] text-white  break-all'>{state.owner}</h4>
                <p className='mt-[4px] font-epilogue font-normal text-[12px] text-[#808191] '>
                  {userCampaigns.length} {userCampaigns.length > 1 || userCampaigns.length === 0 ? 'Campaigns' : 'Campaign'}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase ">story</h4>

             <div className='mt-[20px]'>
               <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>{state.description}</p>
             </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase ">donators</h4>

             <div className='mt-[20px] flex flex-col gap-4'>
              {donators.length > 0 ? donators.map((item, index)=>(
                <div key={`${item.donator}-${index}`} className='flex justify-between items-center gap-4 '>
                  <p className='font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break all '>
                    {index + 1}. {item.donator}
                  </p>
                  <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break all '>
                    {item.donation}
                  </p>
                </div>
              )) : (
                 <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>No donators yet. Be the first one!</p>
              ) }
             </div>
          </div>
        </div>
        <div className='flex-1 '>
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase ">fund</h4>

          <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px] '>
            <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191] '>
              Fund the campaign
            </p>
            <div className='mt-[30px] '>
              <input 
                type='number'
                placeholder='ETH 0.1'
                step='0.01'
                className='w-full py-[10px] sm:px-[20px] px-[15px] outline-none botder-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px] '
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
              <div className='my-[20px] p-4 bg-[#13131a] rounded-[10px] '>
                <h4 className='font-epilogue font-semibold text-[14px] leading-[22px] text-white '>Back it because you believe in it.</h4>
                <p className='mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191] '>Support the project for no reward, just because it speaks to you.</p>
              </div>
              <CustomButton
                  btnType='button'
                  title='Fund Campign'
                  styles='w-full bg-[#8c6dfd]'
                  handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails