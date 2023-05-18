import { useEffect, useState } from 'react'
import styled from 'styled-components'

import useTranslation from '../../hooks/useTranslation'
import EnsAvatar from '../shared/ens/EnsAvatar'
import EnsName from '../shared/ens/EnsName'

interface StakeSelectCommunityProps {
  communityAddress?: `0x${string}`
}

export default function StakeSelectCommunity({ communityAddress }: StakeSelectCommunityProps) {
  const { t } = useTranslation()

  const [select, setSelect] = useState(
    <SelectCommunity>
      <span>{t('selectCommunity')}</span>
    </SelectCommunity>
  )

  useEffect(() => {
    if (communityAddress) {
      setSelect(
        <CommunitySelected>
          <EnsAvatar address={communityAddress} />
          <EnsName address={communityAddress} />
        </CommunitySelected>
      )
    }
  }, [communityAddress])

  return <Container>{select}</Container>
}

const { Container, SelectCommunity, CommunitySelected } = {
  Container: styled.button`
    display: grid;
    grid-template-columns: 1fr;
    height: 32px;

    align-items: center;
    justify-content: flex-start;

    font-size: ${({ theme }) => theme.font.size[14]};
    color: ${({ theme }) => theme.color.primary};
    background-color: ${({ theme }) => theme.color.transparent};
    border: none;
    border-radius: ${({ theme }) => theme.size[16]};
    padding: 0 ${({ theme }) => theme.size[12]};
    transition: background-color 0.1s ease;
    cursor: default;

    span:first-child {
      align-self: flex-start;

      font-size: ${({ theme }) => theme.font.size[14]};

      color: ${({ theme }) => theme.color.black};
    }
    span:last-child {
      font-size: ${({ theme }) => theme.font.size[14]};
      color: ${({ theme }) => theme.color.black};
      display: flex;
      align-items: center;
    }
  `,
  SelectCommunity: styled.div`
    padding: 0 8px;
    display: grid;
    grid-template-columns: auto auto;
    gap: 8px;
    cursor: default;
  `,
  CommunitySelected: styled.div`
    padding: 0 8px;
    display: grid;
    grid-template-columns: auto auto;
    gap: 8px;
    cursor: default;
  `
}
