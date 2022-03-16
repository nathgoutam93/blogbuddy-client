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
    mutation CreateNewBlog($userId: String!) {
      insert_blogs_one(object: {created_by: $userId, blog_title: "new Blog"}) {
        id
        created_at
        blog_title
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
