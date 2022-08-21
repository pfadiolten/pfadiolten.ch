import Page from '@/components/Page/Page'
import UiTitle from '@/components/Ui/UiTitle'
import UserCard from '@/components/User/UserCard'
import UserCardList from '@/components/User/UserCardList'
import useSsrState from '@/hooks/useSsrState'
import Group, { GroupId, parseGroup } from '@/models/Group'
import { parseUser } from '@/models/User'
import { GroupMemberList } from '@/pages/api/groups/[id]/members'
import FetchService from '@/services/FetchService'
import { GetServerSideProps, NextPage } from 'next'
import React, { useMemo } from 'react'

interface Props {
  data: {
    group: Group
    members: GroupMemberList
  }
}

type Query = {
  id: GroupId
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async (ctx) => {
  const id = ctx.params!.id
  const [group, groupError] = await FetchService.get<Group>(`groups/${id}`)
  if (groupError !== null) {
    if (groupError.status === 404) {
      return { notFound: true }
    }
    throw groupError
  }
  const [members, membersError] = await FetchService.get<GroupMemberList>(`groups/${id}/members`)
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
  const [members, setMembers] = useSsrState<GroupMemberList>(() => data.members.map(({ role, members }) => ({
    role,
    members: members.map(parseUser),
  })))

  return (
    <Page title={`${group.name}`}>
      <UiTitle level={1}>
        die {group.name}
      </UiTitle>
      <section>
        <UiTitle level={2}>
          Leitungsteam
        </UiTitle>
        {members.map(({ role, members }, usersI) => (
          <UserCardList key={role.name}>
            {members.map((member, userI) => (
              <UserCard key={member.id} user={member} role={role} onChange={(user) => setMembers((users) => {
                users = [...users]
                users[usersI] = {
                  ...users[usersI],
                  members: [...users[usersI].members],
                }
                users[usersI].members[userI] = user
                return [...users]
              })} />
            ))}
          </UserCardList>
        ))}
      </section>
    </Page>
  )
}
export default Stufe
