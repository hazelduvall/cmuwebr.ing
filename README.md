# cmuwebr.ing

This is a webring for me and my group of friends from CMU! Invite-only, make a
PR/issue if you think you should be on this list.

## Adding Your Site

To `lib/lambda-handler/sites.json`, add an entry that looks like:

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

## Deploying to AWS Lambda

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template
