import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import ChatWindow from "./Chatwindow"
import { Flex, Text } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

function JoinRoomOrChatwindow() {
  const { id } = useParams<{ id: string }>()

  const [content, setContent] = React.useState<string | React.ReactNode>("")

  useEffect(() => {
    if (!id) {
      setContent("Please choose a room")
    } else {
      setContent(<ChatWindow />)
    }
  }, [setContent, id])

  return (
    <Flex h="100vh" align={"center"} justify={"center"}>
      <Text ml={!id ? "xl" : "none"} size={!id ? "xl" : ""}>
        {content}
      </Text>
    </Flex>
  )
}

export default JoinRoomOrChatwindow
