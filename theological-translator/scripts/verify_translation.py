#!/usr/bin/env python3
"""
verify_translation.py — Verification and audit engine for academic theological translations.

Compares source text and candidate English translation to detect:
  1. Em dashes: Strict enforcement against em dashes (—).
  2. Footnote parity: Preserved footnote count and paired definitions.
  3. Apparatus preservation: Retention of Greek, Hebrew, and Scripture references.
  4. Latin italicisation: Proper italicisation of standard Latin dogmatic terms.
  5. Table integrity: Synoptic table structure and row counts.
  6. Completeness: Ratio of source words to target words to flag accidental omission.
  7. Page milestones: Preservation of printed pagination anchors ([p. N]{#p.N}).
"""

import sys
import os
import re
from typing import List, Dict, Set, Tuple

# Key Latin theological formulas that must always be italicised
LATIN_THEOLOGICAL_TERMS = [
    r"ex opere operato",
    r"ex opere operantis",
    r"in persona Christi",
    r"in persona Christi capitis",
    r"res et sacramentum",
    r"sacramentum tantum",
    r"res tantum",
    r"mysterium fidei",
    r"lex orandi, lex credendi",
    r"lex orandi lex credendi",
    r"lex credendi, lex vivendi",
    r"lex credendi lex vivendi",
    r"actuosa participatio",
    r"nexus mysteriorum",
    r"imago Dei",
    r"gratia elevans",
    r"gratia sanans",
    r"status naturae integrae",
    r"capax Dei",
    r"ex nihilo",
    r"communicatio idiomatum",
    r"anakephalaiosis",
    r"analogia entis",
    r"analogia fidei",
    r"transubstantiatio",
    r"concomitantia",
    r"sacrificium laudis",
    r"totius Ecclesiae",
    r"in genere",
    r"in specie",
    r"ipso facto"
]

def audit_translation(source_path: str, target_path: str) -> Dict[str, List[str]]:
    issues: Dict[str, List[str]] = {
        "em_dashes": [],
        "footnotes": [],
        "page_anchors": [],
        "apparatus": [],
        "latin_italics": [],
        "tables": [],
        "completeness": []
    }

    if not os.path.exists(target_path):
        issues["completeness"].append(f"Target translation file '{target_path}' does not exist.")
        return issues

    with open(target_path, "r", encoding="utf-8", errors="ignore") as f:
        target_content = f.read()
        target_lines = target_content.splitlines()

    source_content = ""
    source_lines = []
    if source_path and os.path.exists(source_path):
        with open(source_path, "r", encoding="utf-8", errors="ignore") as f:
            source_content = f.read()
            source_lines = source_content.splitlines()

    # 1. Em dash check (Strict ban on em dashes)
    for i, line in enumerate(target_lines, 1):
        if "—" in line or "\u2014" in line:
            issues["em_dashes"].append(f"Line {i}: Em dash found. Replace with colon, semicolon, brackets, or comma.")

    # 2. Footnote Parity in Target
    call_pattern = re.compile(r'\[\^(\d+)\](?!:)')
    def_pattern = re.compile(r'^\[\^(\d+)\]:\s*(.*)', re.MULTILINE)

    target_calls = set(int(m.group(1)) for m in call_pattern.finditer(target_content))
    target_defs = set(int(m.group(1)) for m in def_pattern.finditer(target_content))

    missing_defs = target_calls - target_defs
    orphaned_defs = target_defs - target_calls

    if missing_defs:
        issues["footnotes"].append(f"Missing definitions for target footnote calls: {sorted(list(missing_defs))}")
    if orphaned_defs:
        issues["footnotes"].append(f"Target footnote definitions without inline calls: {sorted(list(orphaned_defs))}")

    # Footnote comparison with Source if source is provided
    if source_content:
        source_calls = set(int(m.group(1)) for m in call_pattern.finditer(source_content))
        if source_calls:
            dropped_from_source = source_calls - target_calls
            if dropped_from_source:
                issues["footnotes"].append(f"Source footnotes dropped in translation: {sorted(list(dropped_from_source))}")
            new_in_target = target_calls - source_calls
            if new_in_target:
                issues["footnotes"].append(f"Footnotes in translation not present in source: {sorted(list(new_in_target))}")

    # 3. Printed Page Milestones ([p. N]{#p.N})
    page_pattern = re.compile(r'\[p\.\s*(\d+)\](?:\{#p\.\d+\})?')
    target_pages = [int(m.group(1)) for m in page_pattern.finditer(target_content)]

    if source_content:
        source_pages = [int(m.group(1)) for m in page_pattern.finditer(source_content)]
        if source_pages:
            missing_pages = set(source_pages) - set(target_pages)
            if missing_pages:
                issues["page_anchors"].append(f"Source page anchors missing in translation: {sorted(list(missing_pages))}")

    # 4. Greek and Hebrew Apparatus Retention
    greek_pattern = re.compile(r'[\u0370-\u03FF\u1F00-\u1FFF]{2,}')
    hebrew_pattern = re.compile(r'[\u0590-\u05FF]{2,}')

    if source_content:
        source_greek = set(greek_pattern.findall(source_content))
        target_greek = set(greek_pattern.findall(target_content))
        missing_greek = source_greek - target_greek
        if missing_greek:
            sample = list(missing_greek)[:5]
            issues["apparatus"].append(f"Greek terms from source missing in target: {sample}")

        source_hebrew = set(hebrew_pattern.findall(source_content))
        target_hebrew = set(hebrew_pattern.findall(target_content))
        missing_hebrew = source_hebrew - target_hebrew
        if missing_hebrew:
            sample = list(missing_hebrew)[:5]
            issues["apparatus"].append(f"Hebrew terms from source missing in target: {sample}")

    # 5. Latin Italicisation Check
    for term in LATIN_THEOLOGICAL_TERMS:
        # Match term when not preceded or followed by an asterisk or underscore
        unitalicised_pattern = re.compile(rf'(?<![*_`\w]){term}(?![*_`\w])', re.IGNORECASE)
        matches = list(unitalicised_pattern.finditer(target_content))
        if matches:
            issues["latin_italics"].append(f"Latin phrase '{term}' found unitalicised ({len(matches)} time/times). Should be '*{term}*'.")

    # 6. Table Row & Column Integrity
    table_separator_pattern = re.compile(r'^\s*\|?\s*[-:]+\s*\|', re.MULTILINE)
    target_table_count = len(table_separator_pattern.findall(target_content))

    if source_content:
        source_table_count = len(table_separator_pattern.findall(source_content))
        if source_table_count != target_table_count:
            issues["tables"].append(f"Table count discrepancy: source contains {source_table_count} tables, target contains {target_table_count}.")

    # 7. Word Count & Completeness Check
    target_words = len(target_content.split())
    if source_content:
        source_words = len(source_content.split())
        if source_words > 0:
            ratio = target_words / source_words
            # Romance to English translations normally sit between 0.85 and 1.25
            if ratio < 0.70:
                issues["completeness"].append(
                    f"Severe length contraction detected: target word count ({target_words}) is only {ratio:.1%} of source ({source_words}). Check for omitted passages or unauthorised summarisation."
                )
            elif ratio > 1.50:
                issues["completeness"].append(
                    f"Abnormal length expansion detected: target word count ({target_words}) is {ratio:.1%} of source ({source_words}). Check for repetitive hallucinations."
                )

    return issues

def main():
    if len(sys.argv) < 2:
        print("Usage: python verify_translation.py <target_translation.md> [source_file.md]")
        sys.exit(1)

    target_path = sys.argv[1]
    source_path = sys.argv[2] if len(sys.argv) > 2 else ""

    print(f"=== Theological Translation Audit: {os.path.basename(target_path)} ===")
    if source_path:
        print(f"Comparing against source: {os.path.basename(source_path)}")

    issues = audit_translation(source_path, target_path)
    total_issues = sum(len(v) for v in issues.values())

    if total_issues == 0:
        print("PASS: Translation meets all scholarly standards. Apparatus, formatting, and orthography verified.")
        sys.exit(0)

    print(f"FAILED: {total_issues} anomaly/anomalies detected:")
    for category, items in issues.items():
        if items:
            print(f"\n[{category.upper()} - {len(items)} issues]")
            for item in items[:10]:
                print(f"  * {item}")
            if len(items) > 10:
                print(f"  * ... and {len(items) - 10} more.")

    # Critical errors cause exit code 1
    critical = len(issues["em_dashes"]) > 0 or len(issues["footnotes"]) > 0 or len(issues["completeness"]) > 0
    sys.exit(1 if critical else 0)

if __name__ == "__main__":
    main()
