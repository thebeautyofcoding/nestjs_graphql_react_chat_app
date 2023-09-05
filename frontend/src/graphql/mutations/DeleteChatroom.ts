import { gql } from "@apollo/client"

export const DELETE_CHATROOM = gql`
  mutation DeleteChatroom($chatroomId: Float!) {
    deleteChatroom(chatroomId: $chatroomId)
  }
`
