import Page from '@/components/Page/Page'
import UiTitle from '@/components/Ui/UiTitle'
import Group, { parseGroup } from '@/models/Group'
import GroupRepo from '@/repos/GroupRepo'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useMemo } from 'react'

interface Props {
  data: {
    groups: Group[]
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const groups = await GroupRepo.list()
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
      <UiTitle level={1}>
        unsere Stufen
      </UiTitle>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <Link href={`/stufen/${group.id}`}>
              {group.name}
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  )
}
export default Stufen
