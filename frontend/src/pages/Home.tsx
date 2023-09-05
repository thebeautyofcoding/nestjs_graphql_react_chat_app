import React from "react"
import MainLayout from "../layouts/MainLayout"
import Sidebar from "../components/Sidebar"
import ProtectedRoutes from "../components/ProtectedRoutes"
import AuthOverlay from "../components/AuthOverlay"
import ProfileSettings from "../components/ProfileSettings"
import RoomList from "../components/RoomList"
import { Flex } from "@mantine/core"
import AddChatroom from "../components/AddChatroom"
import JoinRoomOrChatwindow from "../components/JoinRoomOrChatwindow"
function Home() {
  return (
    <MainLayout>
      <div
        style={{
          position: "absolute",
        }}
      >
        <AuthOverlay />
        <ProfileSettings />
        <Sidebar />
        <ProtectedRoutes>
          <AddChatroom />
          <Flex direction={{ base: "column", md: "row" }}>
            <RoomList />
            <JoinRoomOrChatwindow />
          </Flex>
        </ProtectedRoutes>
      </div>
    </MainLayout>
  )
}

export default Home
