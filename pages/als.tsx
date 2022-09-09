import Page from '@/components/Page/Page'
import UserCard from '@/components/User/UserCard'
import UserCardList from '@/components/User/UserCardList'
import { als, CommitteeId, UnitId, vorstand } from '@/models/Group'
import User from '@/models/User'
import UserRepo from '@/repos/UserRepo'
import { KitHeading } from '@pfadiolten/react-kit'
import { GetServerSideProps, NextPage } from 'next'
import React, { useState } from 'react'

interface Props {
  members: User[]
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const members = (await UserRepo.listGroup('als'))!
  return {
    props: {
      members,
    },
  }
}

const ALs: NextPage<Props> = ({ members: initialMembers }) => {
  const group = als
  const [members, setMembers] = useState(initialMembers)
  return (
    <Page title="Abteilungsleitung">
      <KitHeading level={1}>
        die Abteilungsleitung
      </KitHeading>
      <section>
        <KitHeading level={2}>
          Besetzung
        </KitHeading>
        <UserCardList>
          {members.map((member, i) => (
            <UserCard
              key={member.id}
              user={member}
              group={group.id}
              onChange={(member) => setMembers((members) => {
                members = [...members]
                members[i] = member
                return members
              })}
            />
          ))}
        </UserCardList>
      </section>
    </Page>
  )
}
export default ALs