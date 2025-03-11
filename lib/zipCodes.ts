// List of valid US ZIP codes from major metropolitan areas
const validZipCodes = [
  // New York City
  "10001", "10002", "10003", "10016", "10019",
  // Los Angeles
  "90001", "90012", "90024", "90045", "90210",
  // Chicago
  "60601", "60602", "60603", "60604", "60605",
  // San Francisco
  "94102", "94103", "94104", "94105", "94117",
  // Boston
  "02108", "02109", "02110", "02111", "02113",
  // Seattle
  "98101", "98102", "98103", "98104", "98105",
  // Austin
  "78701", "78702", "78703", "78704", "78705",
  // Denver
  "80202", "80203", "80204", "80205", "80206"
];

export function getRandomZipCode(): string {
  const randomIndex = Math.floor(Math.random() * validZipCodes.length);
  return validZipCodes[randomIndex];
} 