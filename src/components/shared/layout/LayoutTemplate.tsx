import { ReactNode } from 'react'
import styled from 'styled-components'
import LayoutFooter from './LayoutFooter'
import Header from './LayoutHeader'

interface LayoutTemplateProps {
  children: ReactNode
}
export default function LayoutTemplate({ children }: LayoutTemplateProps) {
  return (
    <Container>
      <Wrapper>
        <Content>
          <Header />
          <Body>{children}</Body>
        </Content>
      </Wrapper>
      <LayoutFooter />
    </Container>
  )
}

const { Container, Wrapper, Content, Body } = {
  Container: styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 60px;
    gap: 24px;
    min-height: 100vh;
    /* Todo! Temp, remove later */
    min-width: ${({ theme }) => theme.breakpoints.lg};
  `,
  Wrapper: styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: minmax(320px, ${({ theme }) => theme.breakpoints.xl});
    justify-content: center;
    place-items: start center;
    /* Todo! Temp, remove later */
    min-width: ${({ theme }) => theme.breakpoints.lg};
  `,
  Content: styled.div`
    display: grid;
    grid-template-columns: minmax(320px, ${({ theme }) => theme.breakpoints.xl});
    padding: ${props => props.theme.size[24]};
    gap: 48px;
    /* Todo! Temp, remove later */
    min-width: ${({ theme }) => theme.breakpoints.lg};
  `,
  Body: styled.div`
    display: grid;
    grid-template-columns: minmax(320px, ${({ theme }) => theme.breakpoints.xl});
    gap: ${props => props.theme.size[32]};
    justify-content: center;
    place-items: center;
  `
}
