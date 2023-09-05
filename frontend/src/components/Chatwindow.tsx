import React, { useEffect, useState } from "react"

import {
  TextInput,
  Image,
  Button,
  Paper,
  useMantineTheme,
  Flex,
  Avatar,
  Tooltip,
  ScrollArea,
  Divider,
  Card,
  Text,
  List,
} from "@mantine/core"
import { useDropzone } from "react-dropzone"
import { useMutation, useQuery, useSubscription } from "@apollo/client"
import { SEND_MESSAGE } from "../graphql/mutations/SendMessage"
import { IconMichelinBibGourmand } from "@tabler/icons-react"
import { useParams } from "react-router-dom"
import {
  GetMessagesForChatroomQuery,
  GetUsersOfChatroomQuery,
  LiveUsersInChatroomSubscription,
  Message,
  NewMessageSubscription,
  SendMessageMutation,
  User,
  UserStartedTypingSubscription,
  UserStoppedTypingSubscription,
} from "../gql/graphql"
import { GET_MESSAGES_FOR_CHATROOM } from "../graphql/queries/GetMessagesForChatroom"
import { useUserStore } from "../stores/userStore"

import { NEW_MESSAGE_SUBSCRIPTION } from "../graphql/subscriptions/NewMessage"

import OverlappingAvatars from "./OverlappingAvatars"
import { USER_STARTED_TYPING_SUBSCRIPTION } from "../graphql/subscriptions/UserStartedTyping"
import { USER_STOPPED_TYPING_SUBSCRIPTION } from "../graphql/subscriptions/UserStoppedTyping"
import { LIVE_USERS_SUBSCRIPTION } from "../graphql/subscriptions/LiveUsers"
import { ENTER_CHATROOM } from "../graphql/mutations/EnterChatroom"
import { LEAVE_CHATROOM } from "../graphql/mutations/LeaveChatroom"
import { GET_USERS_OF_CHATROOM } from "../graphql/queries/GetUsersOfChatroom"
import { GET_CHATROOMS_FOR_USER } from "../graphql/queries/GetChatroomsForUser"
import { useMediaQuery } from "@mantine/hooks"
import { USER_STARTED_TYPING_MUTATION } from "../graphql/mutations/UserStartedTypingMutation"
import { USER_STOPPED_TYPING_MUTATION } from "../graphql/mutations/UserStoppedTypingMutation"
import MessageBubble from "./MessageBubble"
function Chatwindow() {
  const [messageContent, setMessageContent] = useState("")
  const [sendMessage] = useMutation<SendMessageMutation>(SEND_MESSAGE)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]

      if (file) {
        setSelectedFile(file) // You are saving the binary file now
      }
    },
    //
  })
  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null
  const { id } = useParams<{ id: string }>()
  const user = useUserStore((state) => state)
  const { data: typingData } = useSubscription<UserStartedTypingSubscription>(
    USER_STARTED_TYPING_SUBSCRIPTION,
    {
      variables: {
        chatroomId: parseInt(id!),
        userId: user.id,
      },
    }
  )
  const { data: stoppedTypingData } =
    useSubscription<UserStoppedTypingSubscription>(
      USER_STOPPED_TYPING_SUBSCRIPTION,
      {
        variables: { chatroomId: parseInt(id!), userId: user.id },
      }
    )
  const [userStartedTypingMutation] = useMutation(
    USER_STARTED_TYPING_MUTATION,
    {
      onCompleted: () => {
        console.log("User started typing")
      },
      variables: { chatroomId: parseInt(id!) },
    }
  )
  const [userStoppedTypingMutation] = useMutation(
    USER_STOPPED_TYPING_MUTATION,
    {
      onCompleted: () => {
        console.log("User stopped typing")
      },
      variables: { chatroomId: parseInt(id!) },
    }
  )

  const [typingUsers, setTypingUsers] = useState<User[]>([])

  useEffect(() => {
    const user = typingData?.userStartedTyping
    if (user && user.id) {
      setTypingUsers((prevUsers) => {
        if (!prevUsers.find((u) => u.id === user.id)) {
          return [...prevUsers, user]
        }
        return prevUsers
      })
    }
  }, [typingData])

  const typingTimeoutsRef = React.useRef<{ [key: number]: NodeJS.Timeout }>({})

  useEffect(() => {
    const user = stoppedTypingData?.userStoppedTyping
    if (user && user.id) {
      clearTimeout(typingTimeoutsRef.current[user.id])
      setTypingUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id))
    }
  }, [stoppedTypingData])

  const userId = useUserStore((state) => state.id)

  const handleUserStartedTyping = async () => {
    await userStartedTypingMutation()

    if (userId && typingTimeoutsRef.current[userId]) {
      clearTimeout(typingTimeoutsRef.current[userId])
    }
    if (userId) {
      typingTimeoutsRef.current[userId] = setTimeout(async () => {
        setTypingUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        )
        await userStoppedTypingMutation()
      }, 2000)
    }
  }

  const { data: liveUsersData, loading: liveUsersLoading } =
    useSubscription<LiveUsersInChatroomSubscription>(LIVE_USERS_SUBSCRIPTION, {
      variables: {
        chatroomId: parseInt(id!),
      },
    })

  const [liveUsers, setLiveUsers] = useState<User[]>([])

  useEffect(() => {
    if (liveUsersData?.liveUsersInChatroom) {
      setLiveUsers(liveUsersData.liveUsersInChatroom)
    }
  }, [liveUsersData?.liveUsersInChatroom])
  const [enterChatroom] = useMutation(ENTER_CHATROOM)
  const [leaveChatroom] = useMutation(LEAVE_CHATROOM)
  const chatroomId = parseInt(id!)

  const handleEnter = async () => {
    await enterChatroom({ variables: { chatroomId } })
      .then((response) => {
        if (response.data.enterChatroom) {
          console.log("Successfully entered chatroom!")
        }
      })
      .catch((error) => {
        console.error("Error entering chatroom:", error)
      })
  }

  const handleLeave = async () => {
    await leaveChatroom({ variables: { chatroomId } })
      .then((response) => {
        if (response.data.leaveChatroom) {
          console.log("Successfully left chatroom!")
        }
      })
      .catch((error) => {
        console.error("Error leaving chatroom:", error)
      })
  }

  const [isUserPartOfChatroom, setIsUserPartOfChatroom] =
    useState<() => boolean | undefined>()

  const { data: dataUsersOfChatroom } = useQuery<GetUsersOfChatroomQuery>(
    GET_USERS_OF_CHATROOM,
    {
      variables: {
        chatroomId: chatroomId,
      },
    }
  )

  useEffect(() => {
    setIsUserPartOfChatroom(() =>
      dataUsersOfChatroom?.getUsersOfChatroom.some((user) => user.id === userId)
    )
  }, [dataUsersOfChatroom?.getUsersOfChatroom, userId])

  useEffect(() => {
    handleEnter()
    if (liveUsersData?.liveUsersInChatroom) {
      setLiveUsers(liveUsersData.liveUsersInChatroom)
      setIsUserPartOfChatroom(() =>
        dataUsersOfChatroom?.getUsersOfChatroom.some(
          (user) => user.id === userId
        )
      )
    }
  }, [chatroomId])

  useEffect(() => {
    window.addEventListener("beforeunload", handleLeave)
    return () => {
      window.removeEventListener("beforeunload", handleLeave)
    }
  }, [])

  useEffect(() => {
    handleEnter()
    if (liveUsersData?.liveUsersInChatroom) {
      setLiveUsers(liveUsersData.liveUsersInChatroom)
    }

    return () => {
      handleLeave()
    }
  }, [chatroomId])

  const scrollAreaRef = React.useRef<HTMLDivElement | null>(null)

  const { data, loading } = useQuery<GetMessagesForChatroomQuery>(
    GET_MESSAGES_FOR_CHATROOM,
    {
      variables: {
        chatroomId: chatroomId,
      },
    }
  )

  const [messages, setMessages] = useState<Message[]>([])
  useEffect(() => {
    if (data?.getMessagesForChatroom) {
      setMessages(data.getMessagesForChatroom)
    }
  }, [data?.getMessagesForChatroom])

  const handleSendMessage = async () => {
    await sendMessage({
      variables: {
        chatroomId: chatroomId,
        content: messageContent,
        image: selectedFile,
      },
      refetchQueries: [
        {
          query: GET_CHATROOMS_FOR_USER,
          variables: {
            userId: userId,
          },
        },
      ],
    })
    setMessageContent("")
    setSelectedFile(null)
  }
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      console.log("Scrolling to bottom")
      const scrollElement = scrollAreaRef.current
      console.log(scrollElement.scrollHeight, scrollElement.clientHeight)
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: "smooth",
      })
    }
  }
  useEffect(() => {
    if (data?.getMessagesForChatroom) {
      const uniqueMessages = Array.from(
        new Set(data.getMessagesForChatroom.map((m) => m.id))
      ).map((id) => data.getMessagesForChatroom.find((m) => m.id === id))
      setMessages(uniqueMessages as Message[])
      scrollToBottom()
    }
  }, [data?.getMessagesForChatroom])

  const { data: dataSub } = useSubscription<NewMessageSubscription>(
    NEW_MESSAGE_SUBSCRIPTION,
    {
      variables: { chatroomId },
    }
  )

  useEffect(() => {
    scrollToBottom()
    if (dataSub?.newMessage) {
      if (!messages.find((m) => m.id === dataSub.newMessage?.id)) {
        setMessages((prevMessages) => [...prevMessages, dataSub.newMessage!])
      }
    }
  }, [dataSub?.newMessage, messages])
  const isMediumDevice = useMediaQuery("(max-width: 992px)")
  return (
    <Flex
      maw={isMediumDevice ? "calc(100vw - 100px)" : "calc(100vw - 550px)"}
      justify={"center"}
      ml={isMediumDevice ? "100px" : "0"}
      h={"100vh"}
    >
      {!liveUsersLoading && isUserPartOfChatroom ? (
        <Card withBorder shadow="xl" p={0} w={"100%"}>
          <Flex direction={"column"} pos={"relative"} h={"100%"} w={"100%"}>
            <Flex direction={"column"} bg={"#f1f1f0"}>
              <Flex
                direction={"row"}
                justify={"space-around"}
                align={"center"}
                my="sm"
              >
                <Flex direction={"column"} align={"start"}>
                  <Text mb="xs" c="dimmed" italic>
                    Chat with
                  </Text>
                  {dataUsersOfChatroom?.getUsersOfChatroom && (
                    <OverlappingAvatars
                      users={dataUsersOfChatroom.getUsersOfChatroom}
                    />
                  )}
                </Flex>
                <Flex
                  direction={"column"}
                  justify={"space-around"}
                  align={"start"}
                >
                  <List w={150}>
                    <Text mb="xs" c="dimmed" italic>
                      Live users
                    </Text>

                    {liveUsersData?.liveUsersInChatroom?.map((user) => (
                      <Flex
                        key={user.id}
                        pos="relative"
                        w={25}
                        h={25}
                        my={"xs"}
                      >
                        <Avatar
                          radius={"xl"}
                          size={25}
                          src={user.avatarUrl ? user.avatarUrl : null}
                        />

                        <Flex
                          pos="absolute"
                          bottom={0}
                          right={0}
                          w={10}
                          h={10}
                          bg="green"
                          style={{ borderRadius: 10 }}
                        ></Flex>
                        <Text ml={"sm"}>{user.fullname}</Text>
                      </Flex>
                    ))}
                  </List>
                </Flex>
              </Flex>
              <Divider size={"sm"} w={"100%"} />
            </Flex>
            <ScrollArea
              viewportRef={scrollAreaRef}
              h={"70vh"}
              offsetScrollbars
              type="always"
              w={isMediumDevice ? "calc(100vw - 100px)" : "calc(100vw - 550px)"}
              p={"md"}
            >
              {loading ? (
                <Text italic c="dimmed">
                  Loading...
                </Text>
              ) : (
                messages.map((message) => {
                  return (
                    <MessageBubble
                      key={message?.id}
                      message={message}
                      currentUserId={userId || 0}
                    />
                  )
                })
              )}
            </ScrollArea>

            <Flex
              style={{
                width: "100%",
                position: "absolute",
                bottom: 0,
                backgroundColor: "#f1f1f0",
              }}
              direction="column"
              bottom={0}
              align="start"
            >
              <Divider size={"sm"} w={"100%"} />
              <Flex
                w={"100%"}
                mx={"md"}
                my={"xs"}
                align="center"
                justify={"center"}
                direction={"column"}
                pos="relative"
                p={"sm"}
              >
                <Flex
                  pos="absolute"
                  bottom={50}
                  direction="row"
                  align="center"
                  bg="#f1f1f0"
                  style={{
                    borderRadius: 5,
                    boxShadow: "0px 0px 5px 0px #000000",
                  }}
                  p={typingUsers.length === 0 ? 0 : "sm"}
                >
                  <Avatar.Group>
                    {typingUsers.map((user) => (
                      <Tooltip key={user.id} label={user.fullname}>
                        <Avatar
                          radius={"xl"}
                          src={user.avatarUrl ? user.avatarUrl : null}
                        />
                      </Tooltip>
                    ))}
                  </Avatar.Group>

                  {typingUsers.length > 0 && (
                    <Text italic c="dimmed">
                      is typing...
                    </Text>
                  )}
                </Flex>

                <Flex
                  w={"100%"}
                  mx={"md"}
                  px={"md"}
                  align="center"
                  justify={"center"}
                >
                  <Flex {...getRootProps()} align="center">
                    {selectedFile && (
                      <Image
                        mr="md"
                        width={"50"}
                        height={"50"}
                        src={previewUrl}
                        alt="Preview"
                        radius={"md"}
                      />
                    )}
                    <Button leftIcon={<IconMichelinBibGourmand />}></Button>
                    <input {...getInputProps()} />
                  </Flex>
                  <TextInput
                    onKeyDown={handleUserStartedTyping}
                    style={{ flex: 0.7 }}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.currentTarget.value)}
                    placeholder="Type your message..."
                    rightSection={
                      <Button
                        onClick={handleSendMessage}
                        color="blue"
                        leftIcon={<IconMichelinBibGourmand />}
                      >
                        Send
                      </Button>
                    }
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      ) : (
        <></>
      )}
    </Flex>
  )
}

export default Chatwindow
