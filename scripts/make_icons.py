#!/usr/bin/env python3
"""Generate the PWA icons. Standard library only — no Pillow.

Draws a bold "V", white on the app's aubergine, full-bleed (iOS masks the
icon to a squircle itself). No accent mark: an accent over a V isn't French.
Anti-aliased by supersampling 4x4 per pixel.
"""
import zlib, struct, os

BG   = (123, 63, 114)     # --accent, aubergine
INK  = (246, 249, 253)
SS   = 4                  # supersample factor


def seg_dist(px, py, ax, ay, bx, by):
    """Distance from point to line segment."""
    dx, dy = bx - ax, by - ay
    d2 = dx * dx + dy * dy
    t = 0.0 if d2 == 0 else max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / d2))
    cx, cy = ax + t * dx, ay + t * dy
    return ((px - cx) ** 2 + (py - cy) ** 2) ** 0.5


# Unit-square geometry: the two arms of the V, centred vertically.
SHAPES = [
    (0.255, 0.255, 0.500, 0.745, 0.085),   # left arm
    (0.745, 0.255, 0.500, 0.745, 0.085),   # right arm
]


def covered(x, y):
    for ax, ay, bx, by, r in SHAPES:
        if seg_dist(x, y, ax, ay, bx, by) <= r:
            return True
    return False


def render(size):
    rows = []
    for py in range(size):
        row = bytearray()
        for px in range(size):
            hits = 0
            for sy in range(SS):
                for sx in range(SS):
                    x = (px + (sx + 0.5) / SS) / size
                    y = (py + (sy + 0.5) / SS) / size
                    if covered(x, y):
                        hits += 1
            a = hits / float(SS * SS)
            for i in range(3):
                row.append(int(round(BG[i] * (1 - a) + INK[i] * a)))
        rows.append(bytes(row))
    return rows


def write_png(path, size, rows):
    raw = b''.join(b'\x00' + r for r in rows)

    def chunk(tag, data):
        return (struct.pack('>I', len(data)) + tag + data +
                struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff))

    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(raw, 9))
    png += chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(png)


def main():
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out = os.path.join(here, 'app', 'icons')
    os.makedirs(out, exist_ok=True)
    for size in (180, 192, 512):
        path = os.path.join(out, 'icon-%d.png' % size)
        write_png(path, size, render(size))
        print('wrote %s (%d bytes)' % (path, os.path.getsize(path)))


if __name__ == '__main__':
    main()
