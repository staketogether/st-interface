import { Account } from './Account'
import { Delegation } from './Delegation'

export type Pool = {
  id: string
  account: Account
  active: boolean
  delegatedShares: string
  rewardsShares: string
  delegations: Delegation[]
  receivedDelegationsCount: bigint
} & ENSPool

export type ENSPool = {
  address: `0x${string}`
  name?: string
  avatar?: string
}
