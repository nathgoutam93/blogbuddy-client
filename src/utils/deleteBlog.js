const HASURA_ENDPOINT = process.env.REACT_APP_HASURA_ENDPOINT;

async function fetchGraphQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(HASURA_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName
    })
  });

  return await result.json();
}

const operationsDoc = `
    mutation DeleteBlog($id: uuid!) {
      delete_blogs_by_pk(id: $id) {
        id
      }
    }
  `;

export default function DeleteBlog(id, accessToken) {
  return fetchGraphQL(operationsDoc, "DeleteBlog", { id: id }, accessToken);
}
