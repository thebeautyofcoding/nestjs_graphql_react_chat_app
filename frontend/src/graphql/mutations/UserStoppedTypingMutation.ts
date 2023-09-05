import { gql } from "@apollo/client"

export const USER_STOPPED_TYPING_MUTATION = gql`
  mutation UserStoppedTypingMutation($chatroomId: Float!) {
    userStoppedTypingMutation(chatroomId: $chatroomId) {
      id
      fullname
      email
    }
  }
`
