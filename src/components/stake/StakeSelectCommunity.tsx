import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { AiOutlineCheck } from 'react-icons/ai'
import useTranslation from '../../hooks/useTranslation'
import EnsAvatar from '../shared/ens/EnsAvatar'
import EnsName from '../shared/ens/EnsName'
import { searchVar } from '../shared/layout/LayoutSearch'

interface StakeSelectCommunityProps {
  communityAddress?: `0x${string}`
}

export default function StakeSelectCommunity({ communityAddress }: StakeSelectCommunityProps) {
  const { t } = useTranslation()

  const [select, setSelect] = useState(
    <Button onClick={() => searchVar(true)}>{t('selectCommunity')}</Button>
  )

  useEffect(() => {
    if (communityAddress) {
      setSelect(
        <CommunitySelected>
          <EnsAvatar large address={communityAddress} />
          <Verified>
            <EnsName large address={communityAddress} />
            <AiOutlineCheck fontSize={14} />
          </Verified>
        </CommunitySelected>
      )
    }
  }, [communityAddress])

  return <Container>{select}</Container>
}

const { Container, CommunitySelected, Verified, Button } = {
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

    transition: background-color 0.1s ease;

    cursor: default;

    span:first-child {
      align-self: flex-start;

      font-size: ${({ theme }) => theme.font.size[15]};

      color: ${({ theme }) => theme.color.black};
    }
    span:last-child {
      font-size: ${({ theme }) => theme.font.size[14]};
      color: ${({ theme }) => theme.color.black};
      display: flex;
      align-items: center;
    }
  `,
  CommunitySelected: styled.div`
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    gap: ${({ theme }) => theme.size[12]};
    cursor: default;
  `,
  Verified: styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.size[8]};
    color: ${({ theme }) => theme.color.whatsapp[600]};
  `,
  Button: styled.button`
    height: 32px;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.size[4]};

    font-size: ${({ theme }) => theme.font.size[14]};
    color: ${({ theme }) => theme.color.primary};
    background-color: ${({ theme }) => theme.color.whiteAlpha[300]};
    border: none;
    border-radius: ${({ theme }) => theme.size[16]};
    padding: 0 ${({ theme }) => theme.size[16]};
    transition: background-color 0.1s ease;
    box-shadow: ${({ theme }) => theme.shadow[100]};

    &:hover {
      background-color: ${({ theme }) => theme.color.whiteAlpha[800]};
    }
  `
}
