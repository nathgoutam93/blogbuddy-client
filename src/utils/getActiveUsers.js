const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;

// fetch all active users working on this Blog Id
export default async function getActiveUsers(blogId, peerId) {
  const res = await fetch(`${SERVER_ENDPOINT}/saveUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      blogId: blogId,
      userId: peerId
    })
  });
  const result = await res.json();
  return result.users;
}
