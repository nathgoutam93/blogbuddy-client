const HASURA_ENDPOINT = process.env.REACT_APP_HASURA_ENDPOINT;

async function fetchGraphQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(HASURA_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName
    })
  });

  return await result.json();
}

const operationsDoc = `
    mutation CreateNewBlog($userId: String!) {
      insert_blogs_one(object: {created_by: $userId, blog_title: "", blog_subtitle: ""}) {
        id
        created_at
        blog_title
        blog_subtitle
      }
    }
  `;

export default function CreateNewBlog(userId, accessToken) {
  return fetchGraphQL(
    operationsDoc,
    "CreateNewBlog",
    { userId: userId },
    accessToken
  );
}
