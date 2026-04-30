export async function getAvailability(title: string, platforms: string[]) {
  const fallbackProvider = "JustWatch";
  const fallback = {
    provider: fallbackProvider,
    availability: [fallbackProvider],
    watchUrl: `https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}`
  };

  if (!process.env.WATCHMODE_API_KEY) {
    return fallback;
  }

  try {
    const search = new URLSearchParams({
      apiKey: process.env.WATCHMODE_API_KEY,
      search_field: "name",
      search_value: title
    });
    const searchResponse = await fetch(`https://api.watchmode.com/v1/search/?${search.toString()}`);
    if (!searchResponse.ok) return fallback;

    const searchData = (await searchResponse.json()) as { title_results?: Array<{ id: number }> };
    const watchmodeId = searchData.title_results?.[0]?.id;
    if (!watchmodeId) return fallback;

    const sourcesResponse = await fetch(
      `https://api.watchmode.com/v1/title/${watchmodeId}/sources/?apiKey=${process.env.WATCHMODE_API_KEY}`
    );
    if (!sourcesResponse.ok) return fallback;

    const sources = (await sourcesResponse.json()) as Array<{ name?: string; web_url?: string; type?: string }>;
    const preferred =
      sources.find((source) => source.name && platforms.includes(source.name) && source.type === "sub") ||
      sources.find((source) => source.name && platforms.includes(source.name)) ||
      sources[0];
    const filteredSources = platforms.length
      ? sources.filter((source) => source.name && platforms.includes(source.name))
      : sources;
    const names = filteredSources
      .map((source) => source.name)
      .filter((name): name is string => Boolean(name))
      .slice(0, 3);

    return {
      provider: preferred?.name || fallback.provider,
      availability: names.length ? names : [preferred?.name || fallback.provider],
      watchUrl: preferred?.web_url || fallback.watchUrl
    };
  } catch {
    return fallback;
  }
}
