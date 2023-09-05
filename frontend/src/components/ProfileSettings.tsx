import React, { useState } from "react"
import { useGeneralStore } from "../stores/generalStore"
import { useUserStore } from "../stores/userStore"
import { useForm } from "@mantine/form"
import { useMutation } from "@apollo/client"
import { UPDATE_PROFILE } from "../graphql/mutations/UpdateUserProfile"
import {
  Avatar,
  Button,
  FileInput,
  Flex,
  Group,
  Modal,
  TextInput,
} from "@mantine/core"
import { IconEditCircle } from "@tabler/icons-react"

function ProfileSettings() {
  const isProfileSettingsModalOpen = useGeneralStore(
    (state) => state.isProfileSettingsModalOpen
  )
  const toggleProfileSettingsModal = useGeneralStore(
    (state) => state.toggleProfileSettingsModal
  )
  const profileImage = useUserStore((state) => state.avatarUrl)
  const updateProfileImage = useUserStore((state) => state.updateProfileImage)
  const fullname = useUserStore((state) => state.fullname)
  const updateUsername = useUserStore((state) => state.updateUsername)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const imagePreview = imageFile ? URL.createObjectURL(imageFile) : null

  const fileInputRef = React.useRef<HTMLButtonElement>(null)

  const form = useForm({
    initialValues: {
      fullname: fullname,
      profileImage: profileImage,
    },
    validate: {
      fullname: (value: string) =>
        value.trim().length >= 3
          ? null
          : "Username must be at least 3 characters",
    },
  })

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    variables: {
      fullname: form.values.fullname,
      file: imageFile,
    },
    // run liveUsersInChatroom subscription after mutation is completed

    onCompleted: (data) => {
      updateProfileImage(data.updateProfile.avatarUrl)
      updateUsername(data.updateProfile.fullname)
    },
  })
  const handleSave = async () => {
    if (form.validate().hasErrors) return
    await updateProfile().then(() => {
      toggleProfileSettingsModal()
    })
  }
  return (
    <Modal
      opened={isProfileSettingsModalOpen}
      onClose={toggleProfileSettingsModal}
      title="Profile Settings"
    >
      <form onSubmit={form.onSubmit(() => handleSave())}>
        <Group
          pos="relative"
          w={100}
          h={100}
          style={{ cursor: "pointer" }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Avatar
            src={imagePreview || profileImage || null}
            alt="Profile"
            h={100}
            w={100}
            radius={100}
          />
          <IconEditCircle
            color="black"
            size={20}
            style={{
              position: "absolute",
              top: 50,
              right: -10,
              background: "white",
              border: "1px solid black",
              padding: 5,
              borderRadius: 100,
            }}
          />
          <FileInput
            ref={fileInputRef}
            style={{ display: "none" }}
            pos={"absolute"}
            accept="image/*"
            placeholder="Upload new image"
            onChange={(file) => setImageFile(file)}
          />
        </Group>
        <TextInput
          style={{ marginTop: 20 }}
          label="Username"
          {...form.getInputProps("fullname")}
          onChange={(event) => {
            form.setFieldValue("fullname", event.currentTarget.value)
          }}
          error={form.errors.fullname}
        />
        <Flex gap="md" mt="sm">
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={toggleProfileSettingsModal} variant="link">
            Cancel
          </Button>
        </Flex>
      </form>
    </Modal>
  )
}

export default ProfileSettings
