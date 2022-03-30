async function fetchGraphQL(operationsDoc, variables, token) {
  const result = await fetch("https://api.hashnode.com", {
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables
    })
  });

  return await result.json();
}

const operationsDoc = `
mutation PublishOnHashnode($title: String!, $markdown: String!){
  createStory(input: { 
    title: $title, 
    contentMarkdown: $markdown,
    tags: [],
  }){
		success
    message
    post{
      _id
      slug
      author{
        _id
        username
      }
    }
  }
}`;

export default function PostToHashnode(input, accessToken) {
  return fetchGraphQL(operationsDoc, input, accessToken);
}
