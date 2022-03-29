export class AuthenticationDocuments {
  static fakeLogin: string = `
    mutation ($id: String!, $phoneNumber: String!) {
        fakeLogin(input: {
          id: $id,
          phoneNumber: $phoneNumber
        }) {
          accessToken
          refreshToken
        }
    }
    `;
}
