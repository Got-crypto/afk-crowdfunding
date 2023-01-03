import React, { useEffect, useState } from 'react'
import { useStateContext } from '../context'

import { DisplayCampaigns } from '../components'

const Home = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [campaigns, setCampaigns] = useState([])

  console.log('campaigns', campaigns)

  const { address, contract, getCampaigns } = useStateContext()

  useEffect(()=> {
    const fetchCampaigns = async () => {
      setIsLoading(true)
      if (contract) {
        const data = await getCampaigns()
        setCampaigns(data)
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [contract, address])  

  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Home