import React from "react"
import ReactDOM from "react-dom/client"

import "./index.css"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import { ApolloProvider } from "@apollo/client"
import { client } from "./apolloClient"
import Home from "./pages/Home.tsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/chatrooms/:id",
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
)
