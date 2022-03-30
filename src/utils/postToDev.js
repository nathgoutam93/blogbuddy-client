export default async function PostToDev(input, token) {
  const result = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": `${token}`
    },
    data: JSON.stringify({ article: input })
  });

  return await result.json();
}
