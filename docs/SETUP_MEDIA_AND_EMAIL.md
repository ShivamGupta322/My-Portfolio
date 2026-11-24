# Adding project images, resumes and email

Three things the site needs from you before launch. None of them need code changes.

---

## 1. Project images

### Where they go

Drop files into **`public/projects/<slug>/`**, one folder per project. The site finds them automatically, by file name:

| File name | What it is | Shown in |
|---|---|---|
| `phone-1`, `phone-2`, … | Phone screenshots, **one per highlight** | Phone mockup in the featured stage (it changes screen as you scroll), grid card, case-study hero and "The screens" gallery |
| `desktop-1`, `desktop-2`, … | **Single-screen** desktop screenshots (what fits in the browser window), one per highlight | Browser mockup in the stage (cross-fades as you scroll), grid card, case-study hero and gallery |
| `desktop` *(alternative)* | One **full-page** capture (any height) | Scrolls inside the browser mockup as you scroll the stage. Used only when there are no `desktop-N` files |
| `cover` *(optional)* | A promo image or banner | Replaces the mockups on the grid card and case-study hero (for a mobile app without phone screens) |
| `gallery-1`, `gallery-2`, … *(optional)* | Any extra screenshots | "The screens" section of the case study |

- Any of **`.webp` `.avif` `.png` `.jpg` `.jpeg`** works. WebP is smallest.
- Numbering decides order: `phone-1`, `phone-2`, … (not `phone-01`).
- By default highlight 1 shows screen 1, highlight 2 shows screen 2, and so on, cycling if there are fewer screens than highlights. To pick a screen for a highlight, set `screen: <0-based index>` on it in `src/content/projects.ts` (the same index picks `phone-N` and `desktop-N`).
- Desktop screens fill a 2:1 window, cropped from the top, so 1920×920-style screenshots fit with almost no crop.
- A web + mobile project with only desktop screens shows the browser alone (no placeholder phone).
- Files with other names are ignored, and `npm run check:content` tells you about them.
- Until a project has images, its mockups show the branded **"UI preview"** placeholders.

### What's in place

| Project | Files | Notes |
|---|---|---|
| Fitizen | `phone-1…5`, `desktop-1…5` | feed · messages · WhatsApp link preview · expanded feed · login; web home · profile · video page · app download · login |
| Vela Meet | `desktop-1…2` | home, meeting (shown for the Jitsi and AWS highlights). Add `phone-N` to bring the phone back |
| Wingtrill | `phone-1…4`, `desktop-1…4` | home · personal · workspace · features, on both. The phone shots had no status bar, so they were padded at the top to sit below the island |
| FitExGo | `phone-1…3` | calories intake · home · explore |
| PhysioCare | `desktop-1…5`, `gallery-1…2` | home · all doctors · Razorpay checkout (phone number blurred) · video consultation booking · live exercise training; gallery: speciality filters, services. An admin or doctor panel screen would give the last step its own image |
| MolBhaav | `cover` | promo banner. Add `phone-1…3` (calculator, expenses, a translated screen) for the phone mockup |
| Social Media Post Scheduler | `desktop-1` | |
| Groceries | `desktop-1` | optional `desktop-2` (cart / checkout), `desktop-3` (admin panel) |

**Backend systems**: `order-processing-system`, `voip-telephony`, `nearby`. These use the animated architecture diagrams, so no images are required. Optional `gallery-N` for real evidence: a Prometheus / Grafana dashboard, Kafka UI, test or load-test terminal output. Optional `cover` replaces the diagram thumbnail on the grid card.

> Company products (Scramble Apps, Shivsys, Techvision): make sure you're allowed to publish screenshots. Blur customer data.

### How to capture well

- **Phone:** take a normal device screenshot (any modern resolution, e.g. 1080×2340 or 1179×2556). Crop out nothing; the mockup adds the frame and island.
- **Phone, browser-made:** a screenshot from a browser's device mode has no status bar, so its top sits under the island. Prefer a real device screenshot, or leave space at the top.
- **Desktop:** capture the page only, without the browser tabs, address bar or Windows taskbar (or crop them out).
- **Desktop screens:** a normal screenshot of the browser viewport (about 1920×920 at full width). For a single full-page `desktop` instead: DevTools (`F12`) → `Ctrl+Shift+P` → **"Capture full size screenshot"**.
- **Size:** convert to WebP if you can (e.g. squoosh.app). Aim for phone shots under ~400 KB and full pages under ~1 MB. Next.js also resizes and re-encodes everything it serves.

### Check your work

```powershell
npm run check:content
```

It prints a table of every project's images (phone and desktop screen counts, cover, gallery), lists projects still on UI previews, and warns about misnamed files. Then `npm run dev` and look at the Work section and `/projects/<slug>`.

*(Advanced: you can also set paths explicitly in `src/content/projects.ts` → `media: { … }`; explicit paths win over discovered files.)*

---

## 2. Resumes

Both resumes are served from **Google Drive** (shared "Anyone with the link"), set in `src/content/profile.ts` → `resume`. Links use Drive's direct-download form, so clicking downloads the PDF without leaving the site:

```
https://drive.google.com/uc?export=download&id=<file id>
```

The file id is the part between `/d/` and `/view` in a Drive share link.

- **Updating a resume:** in Drive, right-click the file → **File information → Manage versions → Upload new version**. The link stays the same, so no code change is needed. (Uploading a new file instead gives a new id; paste it into `profile.ts`.)
- Keep sharing on "Anyone with the link", or visitors get a Google sign-in page.
- `npm run check:links` confirms both links still download.
- They're linked from the nav, hero, mobile menu, contact section and footer.

---

## 3. Contact form email (Resend)

Until this is set up, the form still works: visitors get a ready-to-send email in their own mail app. With Resend, messages arrive in your inbox directly, with **Reply** going to the visitor.

### Quick setup (about 5 minutes, no domain needed)

1. Create a free account at **resend.com**, signing up with the inbox you want messages in (e.g. your Gmail).
2. **API Keys → Create API key** (permission: *Sending access*). Copy the key (it starts with `re_`). You only see it once.
3. In the project folder, create **`.env.local`** (copy `.env.example`) and fill in:
   ```
   RESEND_API_KEY=re_your_key_here
   CONTACT_TO_EMAIL=the-email-you-signed-up-with@gmail.com
   CONTACT_FROM_EMAIL=
   ```
   Leave `CONTACT_FROM_EMAIL` empty for now: Resend's test sender `onboarding@resend.dev` works without a domain, **but only delivers to the email you signed up with**, which is exactly what a contact form needs.
4. Test it:
   ```powershell
   npm run test:email
   ```
   It sends one email with the same settings as the form and explains any error. Then run `npm run dev` and send yourself a message through the form.

`.env.local` is git-ignored. Never commit it or paste the key anywhere public.

### Recommended before launch: send from your own domain

Better deliverability and a professional sender:

1. Resend → **Domains → Add domain** → `devshivam.online`.
2. Add the DNS records Resend shows (SPF/DKIM, usually TXT and MX/CNAME) at your domain registrar. Wait for **Verified**.
3. Set `CONTACT_FROM_EMAIL="Portfolio <hello@devshivam.online>"` and run `npm run test:email` again.

### On Vercel (at deploy time)

Project → **Settings → Environment Variables**: add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (if set) and `NEXT_PUBLIC_SITE_URL=https://www.devshivam.online`, then redeploy.
