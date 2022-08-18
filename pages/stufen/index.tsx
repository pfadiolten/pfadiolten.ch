import Page from '@/components/Page/Page'
import Group, { parseGroup } from '@/models/Group'
import FetchService from '@/services/FetchService'
import { GetServerSideProps, NextPage } from 'next'
import { useMemo } from 'react'

interface Props {
  data: {
    groups: Group[]
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [groups, groupsError] = await FetchService.get<Group[]>('groups')
  if (groupsError !== null) {
    throw groupsError
  }
  return {
    props: {
      data: {
        groups,
      },
    },
  }
}

const Stufen: NextPage<Props> = ({ data }) => {
  const groups = useMemo(() => data.groups.map(parseGroup), [data.groups])
  return (
    <Page title="unsere Stufen">
      {JSON.stringify(groups)}
    </Page>
  )
}
export default Stufen
