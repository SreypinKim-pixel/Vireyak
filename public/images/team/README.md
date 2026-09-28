# Team & mentor photos

The six team photos and the mentor portrait are **bundled with the site** from
`components/about/image/` and imported at the top of `data/team.js`, so the
browser receives a hashed, cache-friendly URL for each one.

| Person           | File             | Role                      |
| ---------------- | ---------------- | ------------------------- |
| Srorng Sokcheat  | `Mentor.PNG`     | Project Mentor            |
| Kim Sreypin      | `Pin-Leader.JPG` | Home Page Developer       |
| Leang Seavminh   | `Seavminh.jpg`   | Sign Up Page Developer    |
| Keo Hengleap     | `HengLeap.png`   | Login Page Developer      |
| Sok Chanpanha    | `Panha.JPG`      | Navbar & Footer Developer |
| Koem Longhuy     | `Longhuy.jpg`    | Custom 404 Page Developer |
| Chhom Nadaraguel | `Raguel.png`     | About Page Developer      |

Any of `.jpg`, `.jpeg`, `.png`, or `.webp` works. To change a photo, replace that
file — keep the file name, or update the matching `import` in `data/team.js`. No
component changes are needed.

## Optional: serving a photo from `public/`

`photo` in `data/team.js` also accepts a plain path for a file dropped in this
folder, for example `photo: "/images/team/member-1.jpg"`. The path starts at
`/images/...` — the `public` part is never written in the URL. While `photo` is
`null`, or if a file is missing or misnamed, the card shows an initials
placeholder on a coloured tile instead, so the page never breaks and never shows
a broken-image icon.

The mentor is presented in the highlighted card **above** the six-member
interactive gallery, using the portrait `components/about/image/Mentor.PNG`, so
the mentor reads as the profile the team panels sit under. That file is a JPEG
image saved with a `.PNG` name — browsers read the real format from the bytes, so
it renders normally; re-exporting it as a true PNG would only make it larger.

## Photo guidance

- Aim for a **square or portrait** image, roughly **800x800** to **1200x1600**
  pixels.
- Photos fill a square frame with `object-cover` anchored to the **top** edge, so
  head-and-shoulders framing with the face in the upper half works best.
- Keep files under about 300 KB each by exporting as JPEG at quality 80, or use
  WebP. `Seavminh.jpg` (3.5 MB), `HengLeap.png` (2.0 MB), and `Raguel.png`
  (1.9 MB) are well over that and slow the About page down; re-export those at a
  smaller size when you get a chance.
- Only use photos you have permission to publish. Ask each person to confirm
  they are happy for their photo to appear on the site.
