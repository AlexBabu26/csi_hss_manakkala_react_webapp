# Vercel Blob storage – list, upload, download

Some images (e.g. site logo) are served from **Vercel Blob**. The app allows that origin in `client/next.config.ts` (`*.public.blob.vercel-storage.com`).

## 1. Get a Blob token

- Open [Vercel Dashboard](https://vercel.com) → your project → **Storage** → **Blob**.
- Create or open the store (e.g. `3dkj7nxtnweewnby`).
- Create a **Read-Write** token and copy it.

Set it locally (root `.env` or shell):

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
```

## 2. List blobs (Vercel CLI)

From the repo root, with the project linked (`vercel link` if needed):

```bash
# List up to 100 blobs (default 10)
vercel blob list --limit 100

# Only blobs under a prefix (e.g. images)
vercel blob list --prefix images/ --limit 100

# Paginate with cursor from previous run
vercel blob list --cursor <cursor> --limit 100
```

If the CLI is not using the right project/token, pass the token explicitly:

```bash
vercel blob list --limit 100 --rw-token $BLOB_READ_WRITE_TOKEN
```

## 3. Upload a file (Vercel CLI)

```bash
# Upload with default pathname (filename only)
vercel blob put ./path/to/image.jpg

# Upload with a specific pathname in the store
vercel blob put ./hero.png --pathname images/hero.png

# Optional: add random suffix to avoid overwriting
vercel blob put ./photo.jpg --pathname images/photo.jpg --add-random-suffix
```

## 4. Download all blobs to the repo

The CLI has no “download all” command. Use the script that lists blobs and downloads each file into a local folder:

```bash
# From repo root; requires BLOB_READ_WRITE_TOKEN in .env
npm run blob:download
```

Files are written under `./blob-backup/` (pathnames preserved). To use another folder:

```bash
BLOB_BACKUP_DIR=./my-backup npm run blob:download
```

## 5. Summary

| Action   | Command / script |
|----------|-------------------|
| List     | `vercel blob list [--limit 100] [--prefix images/]` |
| Upload   | `vercel blob put <local-file> [--pathname store/path]` |
| Download | `npm run blob:download` (uses `scripts/vercel-blob-download.mjs`) |
