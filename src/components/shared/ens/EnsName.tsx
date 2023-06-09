import styled from 'styled-components'

import { useEffect, useState } from 'react'
import useEns from '../../../hooks/useEns'

import { truncateAddress, truncateText } from '../../../services/truncate'
import SkeletonLoading from '../icons/SkeletonLoading'

type EnsNameProps = {
  address: `0x${string}`
  large?: boolean
  larger?: boolean
  slice?: number
}

export default function EnsName({ address, large, larger, slice }: EnsNameProps) {
  const { name, nameLoading } = useEns(address)

  const text = <Text className={large ? 'large' : ''}>{truncateAddress(address)}</Text>

  const [nameEl, setNameEl] = useState(text)

  useEffect(() => {
    if (nameLoading && !larger && !large) {
      setNameEl(<SkeletonLoading width={140} height={14} />)
    } else if (nameLoading && large) {
      setNameEl(<SkeletonLoading width={140} height={15} />)
    } else if (nameLoading && larger) {
      setNameEl(<SkeletonLoading width={140} height={22} />)
    } else if (name) {
      setNameEl(
        <Text large={large} larger={larger}>
          {slice ? truncateText(name, slice) : name}
        </Text>
      )
    } else {
      setNameEl(
        <Text large={large} larger={larger}>
          {truncateAddress(address)}
        </Text>
      )
    }
  }, [address, large, larger, name, nameLoading, slice])

  return nameEl
}

const { Text } = {
  Text: styled.span<{ large?: boolean; larger?: boolean }>`
    font-size: ${({ theme }) => theme.font.size[14]};
    color: ${({ theme }) => theme.color.black};
    border: 0;
    padding: 0;
    margin: 0;
    display: grid;
    align-items: center;

    ${({ large, theme }) =>
      large &&
      `
      font-size: ${theme.font.size[15]};
    `}

    ${({ larger, theme }) => {
      return (
        larger &&
        `
      font-size: ${theme.font.size[22]} !important;
    `
      )
    }}
  `
}
