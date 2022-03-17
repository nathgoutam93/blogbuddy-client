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
    query GetBlog($blogId: uuid!) {
      blogs_by_pk(id: $blogId) {
        id
        blog_title
        blog_subtitle
        created_at
        created_by
        data
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
