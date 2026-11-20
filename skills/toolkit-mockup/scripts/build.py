#!/usr/bin/env python3
"""Assemble one self-contained mockup HTML file.

Usage:
    python build.py content.js out.html

content.js sets window.MOCKUP (see references/config.md). The engine CSS and JS and the shell are
read from ../assets. Python standard library only. Run with python -I if the folder holding the
content file is untrusted.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "assets")


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    content_path, out_path = sys.argv[1], sys.argv[2]
    content = read(content_path)
    if "window.MOCKUP" not in content:
        print("content file must set window.MOCKUP")
        return 1
    if "</script" in content.lower():
        print("content file must not contain the text </script")
        return 1
    title = "Mockup"
    marker = "title:"
    i = content.find(marker)
    if i >= 0:
        q = content[i + len(marker):].lstrip()
        if q[:1] in ("'", '"'):
            end = q.find(q[0], 1)
            if end > 0:
                title = q[1:end]
    shell = read(os.path.join(ASSETS, "shell.html"))
    html = (shell.replace("{{TITLE}}", title)
                 .replace("{{CSS}}", read(os.path.join(ASSETS, "engine.css")))
                 .replace("{{CONTENT}}", content)
                 .replace("{{ENGINE}}", read(os.path.join(ASSETS, "engine.js"))))
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("wrote %s (%d bytes)" % (out_path, len(html.encode("utf-8"))))
    return 0


if __name__ == "__main__":
    sys.exit(main())
