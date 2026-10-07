#!/usr/bin/env python3
"""Inline engine.js, data.js, and frequency.js into a single self-contained
dist/index.html.

The multi-file version is what GitHub Pages serves (it needs the separate
service worker). The Artifact needs everything in one file, so this folds the
scripts in and drops the PWA-only tags that would 404 there.
"""
import io, os, re

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(HERE, 'app')
DIST = os.path.join(HERE, 'dist')


def read(name):
    with io.open(os.path.join(APP, name), encoding='utf-8') as f:
        return f.read()


def main():
    html = read('index.html')

    for src in ('engine.js', 'data.js', 'frequency.js'):
        tag = '<script src="%s"></script>' % src
        if tag not in html:
            raise SystemExit('could not find %s in index.html' % tag)
        html = html.replace(tag, '<script>\n' + read(src) + '\n</script>')

    # PWA files are not published alongside the Artifact
    html = html.replace('<link rel="manifest" href="manifest.json">\n', '')
    html = re.sub(r'\s*<link rel="apple-touch-icon"[^>]*>\n', '\n', html)

    os.makedirs(DIST, exist_ok=True)
    out = os.path.join(DIST, 'index.html')
    with io.open(out, 'w', encoding='utf-8') as f:
        f.write(html)

    if '<script src=' in html:
        raise SystemExit('external script tag survived inlining')
    print('wrote %s (%.1f KB)' % (out, os.path.getsize(out) / 1024.0))


if __name__ == '__main__':
    main()
