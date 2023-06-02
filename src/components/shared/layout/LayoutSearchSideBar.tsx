import Fuse from 'fuse.js'
import Link from 'next/link'
import { useState } from 'react'
import styled from 'styled-components'

import useCommunities from '../../../hooks/subgraphs/useCommunities'

import useSearchCommunities from '../../../hooks/subgraphs/useSearchCommunities'
import useTranslation from '../../../hooks/useTranslation'
import EnsAvatar from '../ens/EnsAvatar'
import EnsName from '../ens/EnsName'
import { Drawer } from 'antd'
import { AiOutlineArrowLeft, AiOutlineSearch } from 'react-icons/ai'
import useSearchDrawer from '@/hooks/useSearchDrawer'

export default function LayoutSearchDrawer() {
  const { isOpen, setOpenSearchDrawer } = useSearchDrawer()
  const [text, setText] = useState<string>('')
  const { t } = useTranslation()

  const { communities, communitiesIsLoading } = useCommunities()
  const { searchCommunities } = useSearchCommunities()

  const options = {
    includeScore: true,
    keys: [
      {
        name: 'address',
        weight: 1
      },
      {
        name: 'name',
        weight: 2
      }
    ],
    threshold: 0.3
  }

  const fuse = new Fuse(searchCommunities, options)

  const result = fuse.search(text).map(community => community.item)

  const onChange = (text: string) => {
    setText(text)
  }

  return (
    <DrawerContainer
      placement='right'
      size='default'
      onClose={() => setOpenSearchDrawer(false)}
      mask={true}
      open={isOpen}
    >
      <Container>
        <Header>
          <CloseIcon onClick={() => setOpenSearchDrawer(false)} />
          <InputSearchContainer>
            <SearchIcon />
            <InputSearch
              type='text'
              value={text}
              placeholder={t('searchCommunity')}
              onChange={e => onChange(e.target.value)}
              className={`${isOpen ? 'active' : ''}`}
            />
          </InputSearchContainer>
        </Header>
        {isOpen && (
          <DropdownMenu isOpen>
            {!communitiesIsLoading &&
              text.length > 0 &&
              result.length > 0 &&
              result.map(community => (
                <Link href={`/stake/deposit/${community.address}`} key={community.address}>
                  <DropdownMenuItem key={community.address} onClick={() => setOpenSearchDrawer(false)}>
                    <EnsAvatar address={community.address} />
                    <EnsName address={community.address} />
                  </DropdownMenuItem>
                </Link>
              ))}

            {!communitiesIsLoading &&
              text.length === 0 &&
              communities.map(community => (
                <Link href={`/stake/deposit/${community.address}`} key={community.address}>
                  <DropdownMenuItem key={community.address} onClick={() => setOpenSearchDrawer(false)}>
                    <EnsAvatar address={community.address} />
                    <EnsName address={community.address} />
                  </DropdownMenuItem>
                </Link>
              ))}
            {!communitiesIsLoading && text.length > 0 && result.length === 0 && (
              <NotFound>{t('emptyCommunity')}</NotFound>
            )}
            {communitiesIsLoading && text.length > 0 && <Loading>{t('loading')}</Loading>}
          </DropdownMenu>
        )}
      </Container>
    </DrawerContainer>
  )
}

const {
  DrawerContainer,
  InputSearchContainer,
  SearchIcon,
  Container,
  Header,
  DropdownMenu,
  InputSearch,
  DropdownMenuItem,
  NotFound,
  Loading,
  CloseIcon
} = {
  DrawerContainer: styled(Drawer)`
    background-color: ${({ theme }) => theme.color.whiteAlpha[800]} !important;

    .ant-drawer-header.ant-drawer-header-close-only {
      display: none;
    }

    .ant-drawer-body {
      width: calc(100vw);
      display: flex;
      flex-direction: column;
      gap: ${({ theme }) => theme.size[24]};
      padding: ${({ theme }) => theme.size[24]};
    }
  `,
  Container: styled.div`
    width: 100%;
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    height: 32px;
  `,
  Header: styled.header`
    display: flex;
    gap: ${({ theme }) => theme.size[16]};
    align-items: center;
  `,
  CloseIcon: styled(AiOutlineArrowLeft)`
    font-size: 18px;
    color: ${({ theme }) => theme.color.primary};
  `,
  InputSearchContainer: styled.div`
    width: 100%;
    position: relative;
  `,
  SearchIcon: styled(AiOutlineSearch)`
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.color.primary};
  `,
  InputSearch: styled.input`
    width: 100% !important;
    display: grid;
    grid-template-columns: 1fr;

    width: auto;
    height: 32px;
    font-size: ${({ theme }) => theme.font.size[14]};
    color: ${({ theme }) => theme.color.primary};
    background-color: ${({ theme }) => theme.color.whiteAlpha[600]};
    border: none;
    border-radius: ${({ theme }) => theme.size[16]};
    padding: 0 16px;
    padding-left: 30px;
    transition: background-color 0.1s ease;
    box-shadow: ${({ theme }) => theme.shadow[100]};
    padding-top: 0;

    &:hover {
      background-color: ${({ theme }) => theme.color.whiteAlpha[800]};
    }

    &:focus {
      background-color: ${({ theme }) => theme.color.whiteAlpha[800]};
      color: ${({ theme }) => theme.color.primary};
      border: none;
      outline: none;
    }

    &.active {
      background-color: ${({ theme }) => theme.color.whiteAlpha[800]};
    }

    &::-webkit-input-placeholder {
      color: ${({ theme }) => theme.color.primary};
    }
  `,
  DropdownMenu: styled.div<{ isOpen: boolean }>`
    width: 100%;
    height: auto;
    display: grid;
    gap: ${({ theme }) => theme.size[12]};
    grid-template-columns: 1fr;
  `,
  DropdownMenuItem: styled.div`
    display: grid;
    grid-template-columns: 24px auto;
    align-items: center;
    text-decoration: none;
    gap: ${({ theme }) => theme.size[8]};
    font-size: ${({ theme }) => theme.font.size[14]};
    color: ${({ theme }) => theme.color.primary};

    padding: ${({ theme }) => theme.size[4]} 0px;
  `,
  NotFound: styled.div`
    display: grid;
    place-items: center;

    font-size: ${({ theme }) => theme.font.size[14]};
    color: ${({ theme }) => theme.color.primary};
    cursor: default;
  `,
  Loading: styled.div`
    display: grid;
    grid-template-columns: 1fr;
    font-size: ${({ theme }) => theme.font.size[14]};
    color: ${({ theme }) => theme.color.secondary};
  `
}
