declare module 'midata' {
  export interface MidataPeopleResponse {
    people: Array<MidataPerson>
    linked: {
      roles?: Array<{
        id: string
        role_type: string
        label: string
        links: {
          group: string
        }
      }>
      phone_numbers?: Array<{
        id: string
        number: string
        label: string
        public: boolean
      }>
    }
  }

  export interface MidataPerson {
    id: string
    first_name: string
    last_name: string
    nickname: string
    gender: 'm' | 'f' | null
    links: {
      roles?: string[]
      phone_numbers?: string[]
    }
  }
}
