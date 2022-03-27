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
  mutation UpdateBlog($blogId: uuid!, $blogTitle: String!, $blogSubTitle: String!, $data: String!) {
    update_blogs_by_pk(pk_columns: {id: $blogId}, _set: {blog_title: $blogTitle, blog_subtitle: $blogSubTitle, data: $data}) {
      blog_title
      blog_subtitle
      data
    }
  }
`;

export default function UpdateBlog(
  blogId,
  blogTitle,
  blogSubTitle,
  data,
  accessToken
) {
  return fetchGraphQL(
    operationsDoc,
    "UpdateBlog",
    {
      blogId: blogId,
      blogTitle: blogTitle,
      blogSubTitle: blogSubTitle,
      data: data
    },
    accessToken
  );
}
