import MemberCard from '@/components/Member/MemberCard'
import MemberCardList from '@/components/Member/MemberCardList'
import Page from '@/components/Page/Page'
import UiTitle from '@/components/Ui/UiTitle'
import useSsrState from '@/hooks/useSsrState'
import Group, { GroupId, parseGroup } from '@/models/Group'
import { parseMember } from '@/models/Member'
import { GroupMemberList } from '@/pages/api/groups/[id]/members'
import FetchService from '@/services/FetchService'
import { also } from '@/utils/control-flow'
import { GetServerSideProps, NextPage } from 'next'
import React, { EventHandler, useMemo, useState } from 'react'

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
    members: members.map(parseMember),
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
        {members.map(({ role, members }, membersI) => (
          <MemberCardList key={role.name}>
            {members.map((member, memberI) => (
              <MemberCard key={member.id} member={member} role={role} onChange={(member) => setMembers((members) => {
                members = [...members]
                members[membersI] = {
                  ...members[membersI],
                  members: [...members[membersI].members],
                }
                members[membersI].members[memberI] = member
                return [...members]
              })} />
            ))}
          </MemberCardList>
        ))}
      </section>
    </Page>
  )
}
export default Stufe
