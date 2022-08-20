import MemberCard from '@/components/Member/MemberCard'
import MemberCardList from '@/components/Member/MemberCardList'
import Page from '@/components/Page/Page'
import UiClientOnly from '@/components/Ui/UiClientOnly'
import UiIcon from '@/components/Ui/UiIcon'
import UiTitle from '@/components/Ui/UiTitle'
import useSsrState from '@/hooks/useSsrState'
import { Role } from '@/models/Group'
import { Contact, ContactInfo } from '@/pages/api/contact'
import FetchService from '@/services/FetchService'
import theme from '@/theme-utils'
import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import styled from 'styled-components'

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
            key={contact.member.id}
            contact={contact}
            role={{ name: 'Abteilungsleitung' }}
            onChange={(contact) => setAls((als) => {
              als = [...als]
              als[i] = contact
              return als
            })}
          />
        ))}
        <ContactCard contact={president} role={{ name: 'Vereinspräsident' }} onChange={setPresident} />
      </ContactList>
    </Page>
  )
}
export default Kontakt

interface ContactCardProps {
  contact: Contact
  role: Role
  onChange: (contact: Contact) => void
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, role, onChange: pushChange }) => {
  return (
    <MemberCard
      key={contact.member.id}
      member={contact.member}
      title={(
        <React.Fragment>
          {contact.firstName} {contact.lastName} v/o {contact.member.name}
        </React.Fragment>
      )}
      role={role}
      onChange={(member) => pushChange({ ...contact, member })}
    >
      <UiClientOnly>{() => (
        <React.Fragment>
          <ContactDetail>
            <UiIcon name="email" />
            <a href={`mailto:${contact.member.name.toLowerCase()}@pfadiolten.ch`}>
              {contact.member.name.toLowerCase()}@pfadiolten.ch
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
    </MemberCard>
  )
}

const ContactList = styled(MemberCardList)`
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
