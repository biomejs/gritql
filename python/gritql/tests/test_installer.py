from pathlib import Path
from unittest.mock import patch, MagicMock

import pytest

from gritql.installer import find_install


def test_find_install_existing_grit() -> None:
    with patch("shutil.which", return_value="/usr/local/bin/grit"):
        assert find_install() == Path("/usr/local/bin/grit")


@pytest.mark.parametrize(
    "platform,machine,triple",
    [
        ("darwin", "arm64", "aarch64-apple-darwin"),
        ("linux", "x86_64", "x86_64-unknown-linux-gnu"),
        ("win32", "x86_64", "x86_64-pc-windows-msvc"),
    ],
)
def test_find_install_download_grit(platform: str, machine: str, triple: str) -> None:
    with (
        patch("shutil.which", return_value=None),
        patch("sys.platform", platform),
        patch("platform.machine", return_value=machine),
        patch("httpx.Client") as mock_client,
        patch("tarfile.open"),
        patch("os.chmod"),
    ):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.iter_bytes.return_value = [b"mock_data"]
        mock_client.return_value.__enter__.return_value.get.return_value = mock_response

        result = find_install()
        assert isinstance(result, Path)
        assert result.name == "grit"

        # Test the URL that is called
        expected_url = f"https://github.com/getgrit/gritql/releases/latest/download/grit-{triple}.tar.gz"
        mock_client.return_value.__enter__.return_value.get.assert_called_once_with(
            expected_url, follow_redirects=True
        )
