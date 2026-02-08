function search(input, searchEngine) {
    try {
        return new URL(input).toString();
    } catch (err) {
    }

    if (input.includes(".") && !input.includes(" ")) {
        return "https://" + input;
    }

    return searchEngine.replace("%s", encodeURIComponent(input));
}