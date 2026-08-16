import importlib.resources as impresources
import json

import aiofiles
from sanic import Sanic
from sanic.response import HTTPResponse, html, redirect, text
from sanic.request import Request
from jinja2 import Environment, PackageLoader, select_autoescape

app = Sanic("cmuwebr_ing")

app.static("/static/", "./static")
for file in ["favicon.ico", "browserconfig.xml"]:
    app.static(f"/{file}", f"./static/{file}", name=file)

env = Environment(
    loader=PackageLoader(__name__),
    autoescape=select_autoescape(),
    enable_async=True,
)

templates = {t: env.get_template(t) for t in ["index.html.jinja"]}

sites_filename = impresources.files(__name__) / ".." / "static" / "sites.json"


async def get_sites():
    async with aiofiles.open(sites_filename, 'rb') as f:
        sites = json.loads(await f.read())
    return sites


@app.get("/")
async def index(request: Request) -> HTTPResponse:
    rendered = await templates["index.html.jinja"].render_async(
        sites=await get_sites())
    return html(rendered)


@app.get("/sites/<id>")
async def site_redirect(request: Request, id: str) -> HTTPResponse:
    sites = await get_sites()

    site = sites.get(id, None)
    if site is None:
        return text("site not found", status=404)

    url = site.get("website", None)
    if url is None:
        return text("sites.json malformed. please contact admin", status=500)

    return redirect(url)


@app.get("/sites/<id>/next")
async def site_next(request: Request, id: str) -> HTTPResponse:
    sites = await get_sites()

    if id not in sites:
        return text("site not found", status=404)

    keys = list(sites.keys())
    index = keys.index(id)
    next_index = (index + 1) % len(keys)
    next_site = sites[keys[next_index]]

    url = next_site.get("website", None)
    if url is None:
        return text("sites.json malformed. please contact admin", status=500)

    return redirect(url)


@app.get("/sites/<id>/prev")
async def site_prev(request: Request, id: str) -> HTTPResponse:
    sites = await get_sites()

    if id not in sites:
        return text("site not found", status=404)

    keys = list(sites.keys())
    index = keys.index(id)
    prev_index = (index - 1) % len(keys)
    prev_site = sites[keys[prev_index]]

    url = prev_site.get("website", None)
    if url is None:
        return text("sites.json malformed. please contact admin", status=500)

    return redirect(url)
