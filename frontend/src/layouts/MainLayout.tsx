import { Flex } from "@mantine/core"

const MainLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <Flex>
      <Flex>{children}</Flex>
    </Flex>
  )
}

export default MainLayout
