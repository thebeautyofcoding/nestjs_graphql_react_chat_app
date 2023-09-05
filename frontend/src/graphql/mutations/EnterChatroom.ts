import { gql } from "@apollo/client"

export const ENTER_CHATROOM = gql`
  mutation EnterChatroom($chatroomId: Float!) {
    enterChatroom(chatroomId: $chatroomId)
  }
`
