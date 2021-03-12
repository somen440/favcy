import { InMemoryCache, makeVar } from "@apollo/client";

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          }
        },
        loggedInName: {
          read() {
            return loggedInNameVar();
          }
        }
      }
    }
  }
});

export const isLoggedInVar = makeVar<boolean>(!!localStorage.getItem('token'))
export const loggedInNameVar = makeVar<String>(localStorage.getItem("name") || '')
