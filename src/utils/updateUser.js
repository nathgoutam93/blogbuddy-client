async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch("undefined", {
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
    mutation UpdateUser($userId: String!) {
      update_users_by_pk(_set: {username: "", working_on: ""}, pk_columns: {user_id: $userId}) {
        username
        working_on
      }
    }
  `;

export default function executeUpdateUser(userId) {
  return fetchGraphQL(operationsDoc, "UpdateUser", { userId: userId });
}
