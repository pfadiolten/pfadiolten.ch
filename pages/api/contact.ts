import Member from '@/models/Member'
import { createDefaultUserData } from '@/models/UserData'
import UserDataRepo from '@/repos/UserDataRepo'
import ApiService, { ApiResponse } from '@/services/ApiService'
import StringHelper from '@/utils/helpers/StringHelper'
import { createInMemoryCache } from '@/utils/InMemoryCache'
import { MidataPeopleResponse, MidataPerson } from 'midata'

export interface ContactInfo {
  als: Contact[]
  president: Contact
}

export interface Contact {
  member: Member
  phoneNumber: string | null
}

export default ApiService.handleREST({
  async get(req, res: ApiResponse<ContactInfo>) {
    return res.status(200).json(await cache.resolve(async () => ({
      als: await fetchALs(),
      president: await fetchPresident(),
    })))
  },
})

const cache = createInMemoryCache<ContactInfo>(86_400_000) // 1d

const fetchALs = async (): Promise<Contact[]> => {
  const midataResponse = await fetch(`https://db.scout.ch/de/groups/5993/people.json?token=${process.env.MIDATA_ACCESS_TOKEN}`)
  const data: MidataPeopleResponse = await midataResponse.json()
  return Promise.all(data.people.map((midataPerson) => mapMidataPersonToContact(midataPerson, data)))
}

const fetchPresident = async (): Promise<Contact> => {
  const midataResponse = await fetch(`https://db.scout.ch/de/groups/5395/people.json?token=${process.env.MIDATA_ACCESS_TOKEN}&filters[role][role_type_ids]=39`)
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
  const id = StringHelper.encode64(midataPerson.id)
  return {
    member: {
      id,
      firstName: midataPerson.first_name,
      lastName: midataPerson.last_name,
      scoutName: StringHelper.nullable(midataPerson.nickname),
      userData: await UserDataRepo.find(id) ?? createDefaultUserData(id),
    },
    phoneNumber: phoneNumber?.number ?? null,
  }
}
