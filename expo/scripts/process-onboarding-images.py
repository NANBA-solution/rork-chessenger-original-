#!/usr/bin/env python3
"""オンボーディング PNG の黒背景を透過にする（元画像パスを引数で指定）"""
from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image

THRESH = 48
OUT_DIR = Path(__file__).resolve().parent.parent / 'assets' / 'images' / 'onboarding'


def flood_transparent(src: Path, dst: Path) -> None:
    img = Image.open(src).convert('RGBA')
    w, h = img.size
    pixels = img.load()
    visited = [[False] * w for _ in range(h)]

    def is_bg(r: int, g: int, b: int) -> bool:
        return r <= THRESH and g <= THRESH and b <= THRESH

    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    while q:
        x, y = q.popleft()
        if x < 0 or x >= w or y < 0 or y >= h or visited[y][x]:
            continue
        r, g, b, _ = pixels[x, y]
        if not is_bg(r, g, b):
            continue
        visited[y][x] = True
        pixels[x, y] = (r, g, b, 0)
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst, 'PNG')
    print(f'OK {dst}')


def main() -> None:
    if len(sys.argv) < 2:
        print('Usage: process-onboarding-images.py <src1> [src2 ...]')
        print('  Output names: slide-welcome, slide-community, slide-match, slide-connect (in order)')
        sys.exit(1)
    names = ['slide-welcome.png', 'slide-community.png', 'slide-match.png', 'slide-connect.png']
    for i, src in enumerate(sys.argv[1:]):
        out_name = names[i] if i < len(names) else f'slide-{i}.png'
        flood_transparent(Path(src), OUT_DIR / out_name)


if __name__ == '__main__':
    main()
