import { gql } from "@apollo/client"

export const GET_MESSAGES_FOR_CHATROOM = gql`
  query GetMessagesForChatroom($chatroomId: Float!) {
    getMessagesForChatroom(chatroomId: $chatroomId) {
      id
      content
      imageUrl
      createdAt
      user {
        id
        fullname
        email
        avatarUrl
      }
      chatroom {
        id
        name
        users {
          id
          fullname
          email
          avatarUrl
        }
      }
    }
  }
`
