import Page from '@/components/Page/Page'
import UiClientOnly from '@/components/Ui/UiClientOnly'
import UiIcon from '@/components/Ui/UiIcon'
import UiTitle from '@/components/Ui/UiTitle'
import UserCard from '@/components/User/UserCard'
import UserCardList from '@/components/User/UserCardList'
import useSsrState from '@/hooks/useSsrState'
import { CommitteeId, GroupId } from '@/models/Group'
import User from '@/models/User'
import { compareUsers, mapUserFromMidata } from '@/repos/UserRepo'
import theme from '@/theme-utils'
import { createInMemoryCache } from '@/utils/InMemoryCache'
import { MidataPeopleResponse, MidataPerson } from 'midata'
import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import styled from 'styled-components'

interface Props {
  contactInfo: ContactInfo
}

interface ContactInfo {
  als: Contact[]
  president: Contact
}

interface Contact {
  user: User
  firstName: string
  lastName: string
  phoneNumber: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const contactInfo = await cache.resolve(async () => ({
    als: await fetchALs(),
    president: await fetchPresident(),
  }))
  return {
    props: {
      contactInfo,
    },
  }
}

const cache = createInMemoryCache<ContactInfo>(86_400_000) // 1d

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

const fetchALs = async (): Promise<Contact[]> => {
  const midataResponse = await fetch(`https://db.scout.ch/de/groups/5993/people.json?token=${process.env.MIDATA_ACCESS_TOKEN}&range=deep`)
  const data: MidataPeopleResponse = await midataResponse.json()
  return (await Promise.all(data.people.map((midataPerson) => mapMidataPersonToContact(midataPerson, data))))
  .sort((a, b) => compareUsers(a.user, b.user))
}

const fetchPresident = async (): Promise<Contact> => {
  const midataResponse = await fetch(`https://db.scout.ch/de/groups/5395/people.json?token=${process.env.MIDATA_ACCESS_TOKEN}&filters[role][role_type_ids]=39&range=deep`)
  const data: MidataPeopleResponse = await midataResponse.json()
  if (data.people.length === 0) {
    throw new Error('president not found in MiData')
  }
  return mapMidataPersonToContact(data.people[0], data)
}

const mapMidataPersonToContact = async (midataPerson: MidataPerson, data: MidataPeopleResponse): Promise<Contact> => {
  const phoneNumber = data.linked.phone_numbers?.find((midataPhoneNumber) => (
    midataPhoneNumber.public && midataPhoneNumber.label === 'Mobil' && midataPerson.links.phone_numbers?.includes(midataPhoneNumber.id)
  ))
  return {
    user: await mapUserFromMidata(midataPerson, data),
    firstName: midataPerson.first_name,
    lastName: midataPerson.last_name,
    phoneNumber: phoneNumber?.number ?? null,
  }
}
