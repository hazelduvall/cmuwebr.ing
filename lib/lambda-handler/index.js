const sites = require("./sites.json");

const index = async () => {
  const body = `<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="The Unofficial CMU Webring" />
    <title>cmuwebr.ing</title>
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/static/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/static/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/static/favicon-16x16.png"
    />
    <link rel="manifest" href="/static/site.webmanifest" />
    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="theme-color" content="#ffffff" />
  </head>
  <body>
    <h1>The CMU Webring</h1>
    <p>
      This is a webring for a bunch of CMU alums who are all friends!!
    </p>
    <ul>
      ${Object.values(sites)
        .map(
          (site) => `
      <li>
        ${site.title} - <a href="${site.website}">${site.website}</a>
      </li>
      `
        )
        .join("")}
    </ul>
  </body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body,
  };
};

const BAD_REQUEST = {
  statusCode: 400,
  body: '{ "error": "bad request" }',
};

const NOT_FOUND = (info) => ({
  statusCode: 404,
  body: JSON.stringify(
    {
      error: "site not found",
      info,
    },
    null,
    2
  ),
});

const redirect = async (id) => {
  const site = sites[id];
  if (!site) {
    return NOT_FOUND(id);
  }

  return {
    statusCode: 302,
    headers: {
      Location: site.website,
    },
  };
};

const next = async (id) => {
  const id_list = Object.keys(sites);
  const index = id_list.indexOf(id);
  if (index < 0) {
    return NOT_FOUND(id);
  }
  const next_id = id_list[(index + 1) % id_list.length];
  return await redirect(next_id);
};

const prev = async (id) => {
  const id_list = Object.keys(sites);
  const index = id_list.indexOf(id);
  if (index < 0) {
    return NOT_FOUND(id);
  }
  const prev_id = id_list[(index - 1 + id_list.length) % id_list.length];
  return await redirect(prev_id);
};

exports.handler = async ({ path, httpMethod }) => {
  if (httpMethod !== "GET") {
    return BAD_REQUEST;
  }

  if (path === "/") {
    return await index();
  }

  const id_match = path.match(/^\/sites\/([\w]+)$/)?.[1];
  if (id_match) {
    return await redirect(id_match);
  }

  const next_match = path.match(/^\/sites\/([\w]+)\/next$/)?.[1];
  if (next_match) {
    return await next(next_match);
  }

  const prev_match = path.match(/^\/sites\/([\w]+)\/prev$/)?.[1];
  if (prev_match) {
    return await prev(prev_match);
  }

  return NOT_FOUND(`bad path: ${path}`);
};
