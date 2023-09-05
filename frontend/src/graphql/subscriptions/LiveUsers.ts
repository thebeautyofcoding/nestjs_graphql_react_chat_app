import gql from "graphql-tag"

export const LIVE_USERS_SUBSCRIPTION = gql`
  subscription LiveUsersInChatroom($chatroomId: Float!) {
    liveUsersInChatroom(chatroomId: $chatroomId) {
      id
      fullname
      avatarUrl
      email
    }
  }
`
