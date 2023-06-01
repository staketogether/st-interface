import { gql } from '@apollo/client'

export const queryCommunitiesDelegations = gql`
  query CommunitiesDelegations {
    communities(orderBy: rewardsShares, orderDirection: desc, where: { active: true }) {
      address
      delegatedShares
      rewardsShares
      delegatedBalance
      receivedDelegationsCount
    }
  }
`
