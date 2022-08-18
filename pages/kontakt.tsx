import Page from '@/components/Page/Page'
import UiTitle from '@/components/Ui/UiTitle'
import Group from '@/models/Group'
import { ContactInfo } from '@/pages/api/contact'
import { GroupMemberList } from '@/pages/api/groups/[id]/members'
import FetchService from '@/services/FetchService'
import { GetServerSideProps, NextPage } from 'next'

interface Props {
  contactInfo: ContactInfo
}


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const [contactInfo, contactInfoError] = await FetchService.get<ContactInfo>('contact')
  if (contactInfoError !== null) {
    throw contactInfoError
  }
  return {
    props: {
      contactInfo,
    },
  }
}

const Kontakt: NextPage<Props> = ({ contactInfo }) => {
  return (
    <Page title="Kontakt">
      <UiTitle level={1}>
        Kontakt
      </UiTitle>
      {JSON.stringify(contactInfo)}
    </Page>
  )
}
export default Kontakt
