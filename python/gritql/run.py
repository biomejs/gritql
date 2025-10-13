from __future__ import annotations

import subprocess
import sys

from typing import Sequence

from .installer import find_install


def run_cli(args: Sequence[str]) -> int:
    """Runs the Grit CLI"""
    cli_path = find_install()
    print("Running GritQL pattern with args:", cli_path, *args, file=sys.stderr)
    code = subprocess.run([str(cli_path), *args])
    return code.returncode


def apply_pattern(
    pattern_or_name: str, args: Sequence[str], grit_dir: str | None = None
) -> int:
    """Applies a GritQL pattern to the Grit CLI"""
    final_args = ["apply", pattern_or_name, *args]
    if grit_dir:
        final_args.append("--grit-dir")
        final_args.append(grit_dir)
    return run_cli(final_args)


if __name__ == "__main__":
    run_cli(sys.argv[1:])
