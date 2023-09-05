import { gql } from "@apollo/client"

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($fullname: String!, $file: Upload) {
    updateProfile(fullname: $fullname, file: $file) {
      id
      fullname
      avatarUrl
    }
  }
`
