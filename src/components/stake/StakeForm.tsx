import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { globalConfig } from '../../config/global'

import { ethers } from 'ethers'
import { useDebounce } from 'usehooks-ts'
import useDeposit from '../../hooks/contracts/useDeposit'
import useEthBalanceOf from '../../hooks/contracts/useEthBalanceOf'
import useWithdraw from '../../hooks/contracts/useWithdraw'
import useStAccount from '../../hooks/subgraphs/useStAccount'
import useTranslation from '../../hooks/useTranslation'
import { truncateEther } from '../../services/truncateEther'
import StakeButton from './StakeButton'
import StakeFormInput from './StakeInput'
import chainConfig from '@/config/chain'
import { useNetwork, useSwitchNetwork } from 'wagmi'

type StakeFormProps = {
  type: 'deposit' | 'withdraw'
  accountAddress: `0x${string}`
  poolAddress: `0x${string}`
}

export function StakeForm({ type, accountAddress, poolAddress }: StakeFormProps) {
  const { fee } = globalConfig
  const { t } = useTranslation()
  const { accountBalance } = useStAccount(accountAddress)
  const cethBalance = useEthBalanceOf(accountAddress)

  const [amount, setAmount] = useState<string>('')
  const debouncedAmount = useDebounce(amount, 1000)

  const inputAmount = debouncedAmount || '0'

  const {
    deposit,
    isSuccess: depositSuccess,
    isLoading: depositLoading
  } = useDeposit(inputAmount, accountAddress, poolAddress)

  const {
    withdraw,
    isLoading: withdrawLoading,
    isSuccess: withdrawSuccess
  } = useWithdraw(inputAmount, accountAddress, poolAddress)

  const rewardsFee = truncateEther(fee.protocol.mul(100).toString())

  const isLoading = depositLoading || withdrawLoading
  const isSuccess = depositSuccess || withdrawSuccess

  const balance = type === 'deposit' ? cethBalance : accountBalance.toString()
  const actionLabel = type === 'deposit' ? t('form.deposit') : t('form.withdraw')
  const balanceLabel = type === 'deposit' ? t('eth.symbol') : t('lsd.symbol')
  const receiveLabel = type === 'deposit' ? t('lsd.symbol') : t('eth.symbol')

  const balanceBigNumber = ethers.utils.parseEther(truncateEther(balance, 6))
  const AmountBigNumber = ethers.utils.parseEther(amount || '0')
  const insufficientFunds = AmountBigNumber.gt(balanceBigNumber)
  const errorLabel = (insufficientFunds && t('form.insufficientFunds')) || ''

  const chain = chainConfig()
  const { chain: walletChainId } = useNetwork()
  const isWrongNetwork = chain.chainId !== walletChainId?.id
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: chain.chainId
  })

  useEffect(() => {
    if (isSuccess) {
      setAmount('')
    }
  }, [isSuccess])

  const handleActionButton = () => {
    if (isWrongNetwork && switchNetworkAsync) {
      switchNetworkAsync()
      return
    }
    if (type === 'deposit') {
      return deposit()
    }
    withdraw()
  }

  const handleLabelButton = () => {
    if (isWrongNetwork) {
      return `${t('switch')} ${chain.name.charAt(0).toUpperCase() + chain.name.slice(1)}`
    }
    if (insufficientFunds) {
      return errorLabel
    }
    return actionLabel
  }

  return (
    <StakeContainer>
      <StakeFormInput
        value={amount}
        onChange={value => setAmount(value)}
        balance={balance}
        symbol={balanceLabel}
        disabled={isWrongNetwork || isLoading}
        purple={type === 'withdraw'}
        hasError={insufficientFunds}
      />
      <StakeButton
        isLoading={isLoading}
        onClick={handleActionButton}
        label={handleLabelButton()}
        purple={type === 'withdraw'}
        disabled={insufficientFunds}
      />
      <StakeInfo>
        <span>
          {`${t('youReceive')} ${amount || '0'}`}
          <span>{`${receiveLabel}`}</span>
        </span>
        {type === 'deposit' && (
          <div>
            <span>{`${t('rewardsFee')}: ${rewardsFee}%`}</span>
          </div>
        )}
      </StakeInfo>
    </StakeContainer>
  )
}

const { StakeContainer, StakeInfo } = {
  StakeContainer: styled.div`
    display: grid;
    gap: ${({ theme }) => theme.size[16]};
  `,
  StakeInfo: styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0px ${({ theme }) => theme.size[12]};
    font-size: ${({ theme }) => theme.size[12]};

    > span {
      height: 12px;
      display: flex;
      gap: 4px;

      > span {
      }
    }

    > div {
      display: flex;
      gap: ${({ theme }) => theme.size[8]};
    }
  `
}
