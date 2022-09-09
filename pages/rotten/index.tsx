import Page from '@/components/Page/Page'
import { allRotten } from '@/models/Group'
import { KitHeading } from '@pfadiolten/react-kit'
import { NextPage } from 'next'
import Link from 'next/link'

const Rotten: NextPage = () => {
  return (
    <Page title="unsere Rotten">
      <KitHeading level={1}>
        unsere Rotten
      </KitHeading>
      <ul>
        {allRotten.map((group) => (
          <li key={group.id}>
            <Link href={`/rotten/${group.id}`}>
              {group.name}
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  )
}
export default Rotten
