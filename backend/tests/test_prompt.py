import pytest
from app.prompt import build_prompt

SUFFIX = "Respond with only the joke, no commentary."

def test_random_when_no_category_or_keywords():
    assert build_prompt(None, "") == f"Tell me a random joke. {SUFFIX}"

def test_category_only():
    assert build_prompt("Dad Jokes", "") == f"Tell me a Dad Jokes joke. {SUFFIX}"

def test_keywords_only():
    assert build_prompt(None, "santa, reindeer") == f"Tell me a joke about santa, reindeer. {SUFFIX}"

def test_both_category_and_keywords():
    assert build_prompt("Puns", "cheese") == f"Tell me a Puns joke about cheese. {SUFFIX}"

def test_whitespace_keywords_treated_as_empty():
    assert build_prompt(None, "   ") == f"Tell me a random joke. {SUFFIX}"
