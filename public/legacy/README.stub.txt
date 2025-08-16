This folder holds the static legacy assets used for pixel-perfect marketing parity.

Expected files you will copy in:
- public/legacy/styles.css
- public/legacy/index.fragment.html
- public/legacy/login.fragment.html
- public/legacy/img/**        (images referenced by the fragments)
- public/legacy/fonts/**      (any custom fonts, optional)

IMPORTANT:
- Use ROOT-RELATIVE paths in HTML, e.g. href="/legacy/styles.css", src="/legacy/img/hero.png".
- Do NOT include <script> tags in fragments; the Next.js app provides scripts.
