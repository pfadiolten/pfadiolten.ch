import Page from '@/components/Page/Page'
import UiTitle from '@/components/Ui/UiTitle'
import Group, { GroupType } from '@/models/Group'
import GroupRepo from '@/repos/GroupRepo'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

interface Props {
  groups: Group[]
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const groups = await GroupRepo.list({ type: GroupType.UNIT })
  return {
    props: {
      groups,
    },
  }
}

const Stufen: NextPage<Props> = ({ groups }) => {
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
