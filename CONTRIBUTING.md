# 👨‍🔧How to Contribute

- Take a look at the existing [Issues](https://github.com/nathgoutam93/blogbuddy-client/issues) or [create a new issue](https://github.com/nathgoutam93/blogbuddy-client/issues/new/choose)!
- [Fork](https://github.com/nathgoutam93/blogbuddy-client/fork) the Repo and install the dependencies.
- create a new branch for any issue that you might willing to work on.
- make your valuable changes and finally, commit your work.
- Create a **[Pull Request](https://github.com/nathgoutam93/blogbuddy-client/compare)** (_PR_), which will be promptly reviewed and given suggestions for improvements if needed.
- Adding screenshots or screen captures to your Pull Request is a +1.

# 🤷‍♂️HOW TO INSTALL

## Prerequisites

Before installation, please make sure you have already installed the following tools:

- [Git](https://git-scm.com/downloads)
- [NodeJs](https://nodejs.org/en/download/)

## Installation

👉 Start by making a [fork](https://github.com/nathgoutam93/blogbuddy-client/fork) of the repository.

👉 Clone your new fork of the repository:

```bash
git clone https://github.com/<your-github-username>/blogbuddy-client
```

👉 Navigate to the new project directory:

```bash
cd blogbuddy-client
```

👉 install dependencies

```bash
npm install
```

👉 Add a `.env` file with following env variables

```
REACT_APP_AUTH0_DOMAIN=<YOUR-AUTH0-DOMAIN>
REACT_APP_AUTH0_CLIENT_ID=<YOUR-AUTH0-CLIENT-ID>
REACT_APP_AUTH0_AUDIENCE=blogbuddy-hasura
REACT_APP_SERVER_HOST=localhost:5000 
REACT_APP_SERVER_ENDPOINT=http://localhost:5000
REACT_APP_HASURA_ENDPOINT=<YOUR-HASURA-ENDPOINT>
```

👉 Also fork the blogbuddy-server repo [fork](https://github.com/nathgoutam93/blogbuddy-server/fork)

👉 Clone your new fork of the repository:

```bash
git clone https://github.com/<your-github-username>/blogbuddy-server
```

👉 Navigate to the new project directory:

```bash
cd blogbuddy-server
```

👉 install dependencies

```bash
npm install
```

👉 Run

```bash
npm start
```
👉 Once the server starts listeing on PORT 5000

👉 Navigate to the client project directory:

```bash
cd blogbuddy-client
```
👉 and Run

```bash
npm start
```

## 🤷‍♀️HOW TO MAKE A PULL REQUEST:

Follow the above Installation setup, then

👉 Set upstream command:

```bash
git remote add upstream https://github.com/nathgoutam93/blogbuddy-client.git
```

👉 Create a new branch:

```bash
git checkout -b YourBranchName
```

👉 Sync your fork or your local repository with the origin repository:

- In your forked repository, click on "Fetch upstream"
- Click "Fetch and merge"

😎 Alternatively, Git CLI way to Sync forked repository with origin repository:

```bash
git fetch upstream

git merge upstream/main
```

📃 [Github Docs](https://docs.github.com/en/github/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-on-github) for Syncing

👉 Make your changes to the source code.

👉 Stage your changes and commit:

```bash
git add .
git commit -m "<your_commit_message>"
```

👉 Push your local commits to the remote repository:

```bash
git push origin YourBranchName
```

👉 Create a [Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)!

🎉🎊 **Congratulations!** You've made your first contribution to [**Blogbuddy**](https://github.com/nathgoutam93/blogbuddy-client/graphs/contributors)! 🙌
