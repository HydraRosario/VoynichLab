# VoynichLab Deployment Notes

The canonical public portal is:

https://voynich-lab.vercel.app/

Do not replace this with an accidental preview or newly linked Vercel project.

## Portal Location

The deployable portal source lives in:

```text
apps/portal/
```

It is currently a static site. `apps/portal/vercel.json` contains static Vercel
configuration only.

## Local Vercel State

Vercel creates local project state under:

```text
apps/portal/.vercel/
```

That directory is local machine state. It must never be committed. The file
`apps/portal/.gitignore` exists only to keep that local state out of Git.

## Safe Deployment Checklist

Before deploying:

1. Confirm the target URL should remain `https://voynich-lab.vercel.app/`.
2. Confirm the local Vercel project is linked to the existing canonical project,
   not to a fresh project created by accident.
3. Run `npm.cmd run research:validate`.
4. Run `npm.cmd run research:build` only when intentionally refreshing public
   portal data.
5. Review `git status --short` before and after build.
6. Deploy the portal source from `apps/portal/`.

If a deployment command reports a new project URL, stop and inspect Vercel
linkage before publishing it as canonical.

