#!/usr/bin/env python3
"""Regenerate publish/ from app/ — the exact files uploaded to GitHub Pages.

Replaces hand-copying: publish/ previously drifted from app/ because nothing
kept the two in sync. Run this after any change to app/'s shell files.
"""
import os
import shutil

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(HERE, 'app')
PUBLISH = os.path.join(HERE, 'publish')

SHELL = ('index.html', 'engine.js', 'data.js', 'frequency.js', 'manifest.json', 'sw.js', 'icons')


def main():
    if os.path.isdir(PUBLISH):
        shutil.rmtree(PUBLISH)
    os.makedirs(PUBLISH)

    for name in SHELL:
        src = os.path.join(APP, name)
        dst = os.path.join(PUBLISH, name)
        if os.path.isdir(src):
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)
        print('copied %s' % name)


if __name__ == '__main__':
    main()
