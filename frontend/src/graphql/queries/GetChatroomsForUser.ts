import { gql } from "@apollo/client"

export const GET_CHATROOMS_FOR_USER = gql`
  query GetChatroomsForUser($userId: Float!) {
    getChatroomsForUser(userId: $userId) {
      id
      name
      messages {
        id
        content
        createdAt
        user {
          id
          fullname
        }
      }
      users {
        avatarUrl
        id
        fullname
        email
      }
    }
  }
`
