#!/usr/bin/env python3
"""Local static server for development.

Avoids `python3 -m http.server`, whose CLI evaluates os.getcwd() at import
time — that call is blocked in some sandboxes. Here the directory is passed
explicitly, so the current working directory is never consulted.
"""
import os
import sys
import http.server
import socketserver
from functools import partial

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8766


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # never cache during development, or edits appear not to land
        self.send_header('Cache-Control', 'no-store, max-age=0')
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write('%s - %s\n' % (self.address_string(), fmt % args))


def main():
    socketserver.TCPServer.allow_reuse_address = True
    handler = partial(Handler, directory=HERE)
    with socketserver.TCPServer(('127.0.0.1', PORT), handler) as httpd:
        sys.stderr.write('serving %s on http://127.0.0.1:%d\n' % (HERE, PORT))
        sys.stderr.flush()
        httpd.serve_forever()


if __name__ == '__main__':
    main()
