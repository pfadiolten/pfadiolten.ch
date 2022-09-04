import Page from '@/components/Page/Page'
import { KitHeading } from '@pfadiolten/react-kit'
import UserCard from '@/components/User/UserCard'
import UserCardList from '@/components/User/UserCardList'
import Group, { allUnits, UnitId } from '@/models/Group'
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
  const id = ctx.params!.id.toLowerCase() as UnitId
  if (!Object.values(UnitId).includes(id)) {
    return { notFound: true }
  }

  const group = allUnits.find((group) => group.id === id)!
  const members = (await UserRepo.listGroup(id))!
  return {
    props: {
      group,
      members,
    },
  }
}

const Stufe: NextPage<Props> = ({ group, members: initialMembers }) => {
  const [members, setMembers] = useState(initialMembers)
  return (
    <Page title={`${group.name}`}>
      <KitHeading level={1}>
        die {group.name}
      </KitHeading>
      <section>
        <KitHeading level={2}>
          Leitungsteam
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
export default Stufe
