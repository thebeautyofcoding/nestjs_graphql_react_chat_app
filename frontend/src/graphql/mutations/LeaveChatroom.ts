import { gql } from "@apollo/client"
export const LEAVE_CHATROOM = gql`
  mutation LeaveChatroom($chatroomId: Float!) {
    leaveChatroom(chatroomId: $chatroomId)
  }
`
