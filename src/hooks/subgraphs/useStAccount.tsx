import { useQuery } from '@apollo/client'
import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { queryAccount } from '../../queries/queryAccount'
import { Account } from '../../types/Account'
import { Delegation } from '../../types/Delegation'
import usePooledEthByShares from '@/hooks/usePooledEthByShares'

export default function useStAccount(address: `0x${string}`) {
  const [account, setAccount] = useState<Account | undefined>(undefined)
  const [accountIsLoading, setAccountIsLoading] = useState<boolean>(false)
  const [accountSentDelegationsCount, setAccountSentDelegationsCount] = useState<number>(0)
  const [accountDelegations, setAccountDelegations] = useState<Delegation[]>([])
  const [accountBalance, setAccountBalance] = useState<BigNumber>(BigNumber.from(0))
  const [accountRewardsBalance, setAccountRewardsBalance] = useState<BigNumber>(BigNumber.from(0))

  const { data, loading } = useQuery<{ account: Account }>(queryAccount, {
    variables: { id: address.toLowerCase() }
  })

  const { balance } = usePooledEthByShares(account?.shares)

  useEffect(() => {
    const account = data?.account
    const originalBalance = BigNumber.from(account?.originalBalance || '0')
    setAccount(account)
    setAccountDelegations(account?.delegations || [])
    setAccountSentDelegationsCount(account?.sentDelegationsCount || 0)
    setAccountBalance(BigNumber.from(balance))
    setAccountRewardsBalance(BigNumber.from(balance).sub(originalBalance) || BigNumber.from(0))
  }, [balance, data])

  useEffect(() => {
    setAccountIsLoading(loading)
  }, [loading, setAccountIsLoading])

  return {
    account,
    accountBalance,
    accountRewardsBalance,
    accountDelegations,
    accountSentDelegationsCount,
    accountIsLoading
  }
}
