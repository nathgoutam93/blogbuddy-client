const HASURA_ENDPOINT = process.env.REACT_APP_HASURA_ENDPOINT;

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(HASURA_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

const operationsDoc = `
    mutation UpdateUser($userId: String!, $username: String!) {
      update_users_by_pk(_set: {username: $username}, pk_columns: {user_id: $userId}) {
        username
      }
    }
  `;

export default function executeUpdateUser(userId, username) {
  return fetchGraphQL(operationsDoc, "UpdateUser", {
    userId: userId,
    username: username,
  });
}
