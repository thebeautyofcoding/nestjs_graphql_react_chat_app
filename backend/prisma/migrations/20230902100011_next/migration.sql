/*
  Warnings:

  - You are about to drop the `ChatroomUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatroomUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatroomUsers" DROP CONSTRAINT "ChatroomUsers_chatroomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatroomUsers" DROP CONSTRAINT "ChatroomUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ChatroomUsers" DROP CONSTRAINT "_ChatroomUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatroomUsers" DROP CONSTRAINT "_ChatroomUsers_B_fkey";

-- DropTable
DROP TABLE "ChatroomUsers";

-- DropTable
DROP TABLE "_ChatroomUsers";
