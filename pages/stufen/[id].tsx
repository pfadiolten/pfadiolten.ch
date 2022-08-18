import Page from '@/components/Page/Page'
import UiTitle from '@/components/Ui/UiTitle'
import Group, { GroupId, parseGroup } from '@/models/Group'
import { parseMember } from '@/models/Member'
import { GroupMemberList } from '@/pages/api/groups/[id]/members'
import FetchService from '@/services/FetchService'
import { GetServerSideProps, NextPage } from 'next'
import { useMemo } from 'react'

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
  const members: GroupMemberList = useMemo(() => data.members.map(({ role, members }) => ({
    role,
    members: members.map(parseMember),
  })), [data.members])

  return (
    <Page title={`${group.name}`}>
      <UiTitle level={1}>
        die {group.name}
      </UiTitle>
      {JSON.stringify(group)}
      <br />
      {JSON.stringify(members)}
    </Page>
  )
}
export default Stufe
