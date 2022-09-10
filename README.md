# Neighborhood Pet Manager

Let's build a full-stack web application for managing all the pets in your neighborhood. This is the repo to follow along with [a tutorial series](https://www.youtube.com/watch?v=wqyHGQlZcws) where we'll learn how to combine these great tools:

- [Remix](https://remix.run/docs)
- [Prisma](https://www.prisma.io/docs/)
- [Postgres](https://www.postgresql.org/)

You can catch the series on the Linode YouTube channel here: https://www.youtube.com/watch?v=wqyHGQlZcws

## Prerequisites

This is not a web dev 101 course. You should already be familiar with Git, Node, HTML, JavaScript, and React. You also will want to have these installed on your machine:

- [Git](https://git-scm.com/)
- [Node](https://nodejs.org/en/)
- A code editor like [VS Code](https://code.visualstudio.com/)
- A database visualizer like [DBeaver](https://dbeaver.io/) (Optional)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

You'll also need a Postgres database running. If you're comfortable with docker, you can get a local instance running locally with this command:

```sh
docker run -d --name=postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres
```
