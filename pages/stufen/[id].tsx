import Page from '@/components/Page/Page'
import UiTitle from '@/components/Ui/UiTitle'
import UserCard from '@/components/User/UserCard'
import UserCardList from '@/components/User/UserCardList'
import useSsrState from '@/hooks/useSsrState'
import Group, { GroupId, parseGroup, UnitId } from '@/models/Group'
import User, { parseUser } from '@/models/User'
import FetchService from '@/services/FetchService'
import { GetServerSideProps, NextPage } from 'next'
import React, { useMemo } from 'react'

interface Props {
  data: {
    group: Group
    members: User[]
  }
}

type Query = {
  id: UnitId
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async (ctx) => {
  const id = ctx.params!.id
  if (!Object.values(UnitId).includes(id)) {
    return { notFound: true }
  }

  const [group, groupError] = await FetchService.get<Group>(`groups/${id}`)
  if (groupError !== null) {
    if (groupError.status === 404) {
      return { notFound: true }
    }
    throw groupError
  }
  const [members, membersError] = await FetchService.get<User[]>(`groups/${id}/users`)
  if (membersError !== null) {
    throw membersError
  }
  return {
    props: {
      data: {
        group,
        members,
      },
    },
  }
}

const Stufe: NextPage<Props> = ({ data }) => {
  const group = useMemo(() => parseGroup(data.group), [data.group])
  const [members, setMembers] = useSsrState(() => data.members.map(parseUser))

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
