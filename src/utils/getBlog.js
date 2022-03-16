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
    query GetBlog($blogId: uuid!) {
      blogs_by_pk(id: $blogId) {
        blog_title
        created_at
        created_by
        data
        id
        ACTIVE_USERS {
          user_id
          username
        }
      }
    }
  `;

export default function GetBlog(blogId, accessToken) {
  return fetchGraphQL(
    operationsDoc,
    "GetBlog",
    { blogId: blogId },
    accessToken
  );
}
