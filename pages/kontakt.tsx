import Page from '@/components/Page/Page'
import UiClientOnly from '@/components/Ui/UiClientOnly'
import UiIcon from '@/components/Ui/UiIcon'
import UiTitle from '@/components/Ui/UiTitle'
import UserCard from '@/components/User/UserCard'
import UserCardList from '@/components/User/UserCardList'
import useSsrState from '@/hooks/useSsrState'
import { CommitteeId, GroupId } from '@/models/Group'
import { Contact, ContactInfo } from '@/pages/api/contact'
import FetchService from '@/services/FetchService'
import theme from '@/theme-utils'
import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import styled from 'styled-components'

interface Props {
  contactInfo: ContactInfo
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
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
  const [als, setAls] = useSsrState(contactInfo.als)
  const [president, setPresident] = useSsrState(contactInfo.president)
  return (
    <Page title="Kontakt">
      <UiTitle level={1}>
        Kontakt
      </UiTitle>
      <ContactList>
        {als.map((contact, i) => (
          <ContactCard
            key={contact.user.id}
            group="als"
            contact={contact}
            onChange={(contact) => setAls((als) => {
              als = [...als]
              als[i] = contact
              return als
            })}
          />
        ))}
        <ContactCard contact={president} group={CommitteeId.VORSTAND} onChange={setPresident} />
      </ContactList>
    </Page>
  )
}
export default Kontakt

interface ContactCardProps {
  contact: Contact
  group: GroupId
  onChange: (contact: Contact) => void
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, group, onChange: pushChange }) => {
  return (
    <UserCard
      key={contact.user.id}
      user={contact.user}
      group={group}
      title={(
        <React.Fragment>
          {contact.firstName} {contact.lastName} v/o {contact.user.name}
        </React.Fragment>
      )}
      onChange={(user) => pushChange({ ...contact, user })}
    >
      <UiClientOnly>{() => (
        <React.Fragment>
          <ContactDetail>
            <UiIcon name="email" />
            <a href={`mailto:${contact.user.name.toLowerCase()}@pfadiolten.ch`}>
              {contact.user.name.toLowerCase()}@pfadiolten.ch
            </a>
          </ContactDetail>
          {contact.phoneNumber !== null && (
            <ContactDetail>
              <UiIcon name="phone" />
              {contact.phoneNumber}
            </ContactDetail>
          )}
        </React.Fragment>
      )}</UiClientOnly>
    </UserCard>
  )
}

const ContactList = styled(UserCardList)`
  ${theme.media.md.min} {
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(3)};
  }
`
const ContactDetail = styled.div`
  :not(:first-child) {
    margin-top: ${theme.spacing(0.5)};
  }
  
  ${UiIcon} {
    margin-right: ${theme.spacing(1)};
  }
`
