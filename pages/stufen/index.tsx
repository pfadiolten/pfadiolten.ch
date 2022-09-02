import Page from '@/components/Page/Page'
import UiTitle from '@/components/Ui/UiTitle'
import { allUnits } from '@/models/Group'
import { NextPage } from 'next'
import Link from 'next/link'

const Stufen: NextPage = () => {
  return (
    <Page title="unsere Stufen">
      <UiTitle level={1}>
        unsere Stufen
      </UiTitle>
      <ul>
        {allUnits.map((group) => (
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
