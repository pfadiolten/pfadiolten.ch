import Page from '@/components/Page/Page'
import UiTitle from '@/components/Ui/UiTitle'
import UserCard from '@/components/User/UserCard'
import UserCardList from '@/components/User/UserCardList'
import Group, { UnitId } from '@/models/Group'
import User from '@/models/User'
import GroupRepo from '@/repos/GroupRepo'
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
  const id = ctx.params!.id
  if (!Object.values(UnitId).includes(id)) {
    return { notFound: true }
  }

  const group = await GroupRepo.find(id)
  if (group === null) {
    return { notFound: true }
  }
  const members = await UserRepo.listGroup(id)
  if (members === null) {
    return { notFound: true }
  }
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
      <UiTitle level={1}>
        die {group.name}
      </UiTitle>
      <section>
        <UiTitle level={2}>
          Leitungsteam
        </UiTitle>
        <UserCardList>
          {members.map((member, i) => (
            <UserCard key={member.id} user={member} role={member.roles.find((role) => role.groupId === group.id)} onChange={(member) => setMembers((members) => {
              members = [...members]
              members[i] = member
              return members
            })} />
          ))}
        </UserCardList>
      </section>
    </Page>
  )
}
export default Stufe
