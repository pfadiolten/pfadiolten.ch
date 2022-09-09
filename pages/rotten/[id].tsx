import Page from '@/components/Page/Page'
import { KitHeading } from '@pfadiolten/react-kit'
import UserCard from '@/components/User/UserCard'
import UserCardList from '@/components/User/UserCardList'
import Group, { allGroups, allRotten, allUnits, RottenId, UnitId } from '@/models/Group'
import User from '@/models/User'
import UserRepo from '@/repos/UserRepo'
import { GetServerSideProps, NextPage } from 'next'
import React, { useState } from 'react'

interface Props {
  group: Group
  members: User[]
}

type Query = {
  id: UnitId
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async (ctx) => {
  const id = ctx.params!.id.toLowerCase() as RottenId
  const group = allRotten.find((group) => group.id === id)
  if (group === undefined) {
    return { notFound: true }
  }
  const members = (await UserRepo.listGroup(id))!
  return {
    props: {
      group,
      members,
    },
  }
}

const Rotte: NextPage<Props> = ({ group, members: initialMembers }) => {
  const [members, setMembers] = useState(initialMembers)
  return (
    <Page title={`${group.name}`}>
      <KitHeading level={1}>
        die {group.name}
      </KitHeading>
      <section>
        <KitHeading level={2}>
          Team
        </KitHeading>
        <UserCardList>
          {members.map((member, i) => (
            <UserCard
              key={member.id}
              user={member}
              group={group.id}
              onChange={(member) => setMembers((members) => {
                members = [...members]
                members[i] = member
                return members
              })}
            />
          ))}
        </UserCardList>
      </section>
    </Page>
  )
}
export default Rotte
