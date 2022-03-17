const HASURA_ENDPOINT = process.env.REACT_APP_HASURA_ENDPOINT;

async function fetchGraphQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(HASURA_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

const operationsDoc = `
    query GetUser($userId: String!) {
      users_by_pk(user_id: $userId) {
        user_id
        username
        Blogs(limit: 5) {
          id
          blog_title
          blog_subtitle
          created_at
        }
      }
    }
  `;

export default function fetchGetUser(userId, accessToken) {
  return fetchGraphQL(
    operationsDoc,
    "GetUser",
    { userId: userId },
    accessToken
  );
}
