import ApolloClient from 'apollo-boost'
import fetch from 'node-fetch'

import { setContext } from 'apollo-link-context'
import { createHttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

const loginQuery = gql`
  mutation authenticate($email:String!,$password:String!) {
    authenticate(input: { email: $email, password: $password}) {
      jwtToken
    }
  }
`

let jwt = null

const httpLink = createHttpLink({
  fetch: fetch,
  uri: 'http://localhost:5000/graphql'
})

const middlewareLink = setContext(() => ({
  headers: {
    authorization: jwt
  }
}))

// use with apollo-client
const link = middlewareLink.concat(httpLink)

const client = new ApolloClient({
  link: link
})

export function login (email, password) {
  client.query({
    query: loginQuery,
    variables: {
      email: email,
      password: password
    }
  })
    .then(data => console.log('login', data))
    .catch(error => console.warn(error))
}
