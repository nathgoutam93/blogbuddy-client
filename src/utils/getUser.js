async function fetchGraphQL(operationsDoc, operationName, variables, token) {
  const result = await fetch("https://legal-cod-63.hasura.app/v1/graphql", {
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
        working_on
        Blogs(limit: 5) {
          blog_title
          created_at
          data
          id
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
