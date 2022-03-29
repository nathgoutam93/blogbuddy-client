async function fetchGraphQL(operationsDoc, variables, token) {
  const result = await fetch("https://api.hashnode.com", {
    headers: {
      Authorization: token
    },
    method: "POST",
    data: {
      query: operationsDoc,
      variables: variables
    }
  });

  return await result.json();
}

const operationsDoc = `
    mutation createStory($input: CreateStoryInput!){ createStory(input: $input) { code success message }}`;

export default function PostToHashnode(input, accessToken) {
  return fetchGraphQL(
    operationsDoc,
    {
      input: input
    },
    accessToken
  );
}
