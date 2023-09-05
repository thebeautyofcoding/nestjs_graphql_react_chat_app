import { gql } from "@apollo/client"

export const CREATE_CHATROOM = gql`
  mutation CreateChatroom($name: String!) {
    createChatroom(name: $name) {
      name
      id
    }
  }
`
