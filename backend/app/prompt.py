def build_prompt(category: str | None, keywords: str) -> str:
    trimmed = keywords.strip()
    suffix = "Respond with only the joke, no commentary."

    if category and trimmed:
        return f"Tell me a {category} joke about {trimmed}. {suffix}"
    if category:
        return f"Tell me a {category} joke. {suffix}"
    if trimmed:
        return f"Tell me a joke about {trimmed}. {suffix}"
    return f"Tell me a random joke. {suffix}"
