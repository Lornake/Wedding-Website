#!/usr/bin/env python3
"""
Converts a .docx file into the site's FAQ-card HTML and splices it into a
target HTML page between the markers:

    <!-- CONTENT:START -->
    ...generated content goes here...
    <!-- CONTENT:END -->

Usage:
    python3 build_content.py content/faq.docx faq.html
    python3 build_content.py content/instructions.docx instructions.html

Conventions for editing the .docx file:
  - Use Word's "Heading 2" style for each question / section title.
    Everything after it (until the next Heading 2) becomes that
    section's body.
  - Bold, italics, and lists in the .docx are preserved automatically.
  - To embed raw HTML (e.g. an <iframe> or a styled <a> tag), wrap it in
    double square brackets, typed as plain text in the document, e.g.:
        [[<a href="https://example.com">click here</a>]]
    Anything inside [[ ]] is inserted into the page verbatim, unescaped.
"""

import html
import re
import subprocess
import sys
from pathlib import Path

from bs4 import BeautifulSoup

START_MARKER = "<!-- CONTENT:START -->"
END_MARKER = "<!-- CONTENT:END -->"

RAW_HTML_PATTERN = re.compile(r"\[\[(.*?)\]\]", re.DOTALL)


def docx_to_raw_html(docx_path: Path) -> str:
    result = subprocess.run(
        ["pandoc", str(docx_path), "-f", "docx", "-t", "html", "--wrap=none"],
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout


def unescape_raw_html_markers(fragment_html: str) -> str:
    """Turn [[<literal html>]] markers back into real, unescaped HTML."""

    def _decode(match: "re.Match[str]") -> str:
        return html.unescape(match.group(1))

    return RAW_HTML_PATTERN.sub(_decode, fragment_html)


def group_into_cards(raw_html: str) -> str:
    """Group each Heading 2 + following content into a .faq-item card."""
    soup = BeautifulSoup(raw_html, "html.parser")
    top_level = [el for el in soup.contents if getattr(el, "name", None)]

    cards = []
    intro_parts = []
    current_title = None
    current_body = []

    def flush():
        if current_title is not None:
            body_html = "".join(str(el) for el in current_body).strip()
            cards.append(
                f'    <div class="faq-item">\n'
                f'      <h2 class="faq-question">{current_title}</h2>\n'
                f'      <div class="faq-answer">{body_html}</div>\n'
                f"    </div>"
            )

    for el in top_level:
        if el.name == "h2":
            flush()
            current_title = el.decode_contents().strip()
            current_body = []
        elif current_title is None:
            intro_parts.append(str(el))
        else:
            current_body.append(el)

    flush()

    intro_html = "".join(intro_parts).strip()
    pieces = []
    if intro_html:
        pieces.append(f'    <div class="rsvp-intro">{intro_html}</div>')
    pieces.extend(cards)

    return "\n".join(pieces) if pieces else "    <p>No content yet — edit the .docx and push.</p>"


def splice(target_html_path: Path, generated_block: str) -> None:
    text = target_html_path.read_text(encoding="utf-8")
    if START_MARKER not in text or END_MARKER not in text:
        raise SystemExit(
            f"Could not find {START_MARKER} / {END_MARKER} markers in {target_html_path}"
        )
    before, rest = text.split(START_MARKER, 1)
    _, after = rest.split(END_MARKER, 1)
    new_text = f"{before}{START_MARKER}\n{generated_block}\n    {END_MARKER}{after}"
    target_html_path.write_text(new_text, encoding="utf-8")


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    docx_path = Path(sys.argv[1])
    target_html_path = Path(sys.argv[2])

    raw_html = docx_to_raw_html(docx_path)
    raw_html = unescape_raw_html_markers(raw_html)
    generated_block = group_into_cards(raw_html)
    splice(target_html_path, generated_block)
    print(f"Updated {target_html_path} from {docx_path}")


if __name__ == "__main__":
    main()
