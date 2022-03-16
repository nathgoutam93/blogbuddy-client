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
  mutation UpdateBlog($blogId: uuid!, $blogTitle: String!, $data: String!) {
    update_blogs_by_pk(pk_columns: {id: $blogId}, _set: {blog_title: $blogTitle, data: $data}) {
      data
      blog_title
    }
  }
`;

export default function UpdateBlog(blogId, blogTitle, data, accessToken) {
  return fetchGraphQL(
    operationsDoc,
    "UpdateBlog",
    { blogId: blogId, blogTitle: blogTitle, data: data },
    accessToken
  );
}
