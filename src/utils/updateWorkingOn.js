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
mutation UpdateWorkinOn($userId: String!, $blogId: uuid!) {
    update_users_by_pk(pk_columns: {user_id: $userId}, _set: {working_on: $blogId}) {
    user_id
    working_on
    }
}
`;

export default function UpdateWorkinOn(userId, blogId, accessToken) {
  return fetchGraphQL(
    operationsDoc,
    "UpdateWorkinOn",
    {
      userId: userId,
      blogId: blogId,
    },
    accessToken
  );
}
