import React, { createContext, useContext } from "react";

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react'

import { ethers } from 'ethers'

const StateContext = createContext()

export const StateContextProvider = ({children}) => {
    const { contract } = useContract('0x8EfD1Acc1a7e735D8acB832B2FD3429F7e4Dd5e7')

    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign')
    const address = useAddress()
    const connect = useMetamask()

    const publishCampaign = async (form) => {
        try {
            const data = await createCampaign([
                address, 
                form.title, 
                form.description, 
                form.target, 
                new Date(form.deadline).getTime(),
                form.image
            ])

            console.log('contract data', data)
        } catch (error) {
            console.log('error contract call', error)
        }


    }

    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns')

        const parsedCampaigns = campaigns.map((campaign, index) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            image: campaign.image,
            amountCollected: ethers.utils.formatEther(campaign.amountCollected, toString()),
            pId: index
        }))

        return parsedCampaigns
    }

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns()

        const filteredCampaigns = allCampaigns.filter( campaign => campaign.owner === address )

        return filteredCampaigns
    }

    const donate = async (pId, amount) => {
        return await contract.call('donateCampaign', pId, { value: ethers.utils.parseEther(amount) })
    }

    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', pId)
        const numberOfDonations = donations[0].length

        const parsedDonations = []

        for( let i = 0; i < numberOfDonations; i++ ){
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }

        return parsedDonations
    }

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                createCampaign: publishCampaign,
                connect,
                getCampaigns,
                donate,
                getUserCampaigns,
                getDonations,
            }}
        >
            {children}
        </StateContext.Provider>
    )

}

export const useStateContext = () => useContext(StateContext)