# cmuwebr.ing

This is a webring for me and my group of friends from CMU! Invite-only, make a
PR/issue if you think you should be on this list.

## Adding Your Site

To `static/sites.json`, add an entry that looks like:

```json
{
    ...
    "YOUR_ID": {
        "title": "Your Name",
        "website": "https://example.com"
    },
    ...
}
```

The position in the file will determine who your neighbors are.

Then, on your site, insert the following snippet somewhere visible:

```html
<a href="https://cmuwebr.ing/sites/YOUR_ID/prev">Prev</a>
<a href="https://cmuwebr.ing/">Part of The CMU Webring</a>
<a href="https://cmuwebr.ing/sites/YOUR_ID/next">Next</a>
```

Exact styling/text is up to you, just be sure to have both prev & next links!

_Thank you for being a part of the CMU Webring_

## Running

In this directory, run:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Then:

1. Symlink `cmuwebr.ing.nginx` into your nginx `sites-enabled` directory
2. Symlink `cmuwebr.ing.service` into your systemd configuration directory.
3. Enable both `nginx.service` and `cmuwebr.ing.service`
4. You're done!

## Running in AWS Lambda
