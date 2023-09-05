import { gql } from "@apollo/client"

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatroomId: Float!, $content: String!, $image: Upload) {
    sendMessage(chatroomId: $chatroomId, content: $content, image: $image) {
      id
      content
      imageUrl
      user {
        id
        fullname
        email
      }
    }
  }
`
