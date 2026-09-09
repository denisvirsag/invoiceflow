

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


<!-- BEGIN: ui-ux-rule -->
For frontend/UI/UX requests, ALWAYS activate `ui-ux-pro-max` skill.
<!-- END: ui-ux-rule -->

<!-- BEGIN: network-hosting-rule -->
When requested to publish or host the project on the network, always use the command:
`npm run dev -- --hostname 0.0.0.0`
<!-- END: network-hosting-rule -->

