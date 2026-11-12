function matchesPublication(text, year, query, selectedYear) {
  const normalized = value => value.toLowerCase().trim().replace(/\s+/g, ' ');
  return (selectedYear === 'all' || String(year) === selectedYear)
    && normalized(text).includes(normalized(query));
}
if (typeof module !== 'undefined') module.exports = {matchesPublication};
