import { Proxy } from '../types/proxy';
import { CountryStats, CityMarker, ColorScale } from '../types/map';

/**
 * Mapping of country names to ISO 3166-1 alpha-2 codes
 */
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  // Major countries
  'United States': 'US',
  'United Kingdom': 'GB',
  'Russia': 'RU',
  'Germany': 'DE',
  'France': 'FR',
  'China': 'CN',
  'Japan': 'JP',
  'India': 'IN',
  'Brazil': 'BR',
  'Canada': 'CA',
  'Australia': 'AU',
  'Mexico': 'MX',
  'Spain': 'ES',
  'Italy': 'IT',
  'Netherlands': 'NL',
  'The Netherlands': 'NL', // Alternative name
  'Poland': 'PL',
  'Turkey': 'TR',
  'South Korea': 'KR',
  'Indonesia': 'ID',
  'Saudi Arabia': 'SA',
  'Switzerland': 'CH',
  'Sweden': 'SE',
  'Belgium': 'BE',
  'Norway': 'NO',
  'Austria': 'AT',
  'Ireland': 'IE',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Portugal': 'PT',
  'Greece': 'GR',
  'Czech Republic': 'CZ',
  'Romania': 'RO',
  'Vietnam': 'VN',
  'Philippines': 'PH',
  'Bangladesh': 'BD',
  'Pakistan': 'PK',
  'Nigeria': 'NG',
  'Egypt': 'EG',
  'Iran': 'IR',
  'Thailand': 'TH',
  'South Africa': 'ZA',
  'Colombia': 'CO',
  'Argentina': 'AR',
  'Ukraine': 'UA',
  'Algeria': 'DZ',
  'Iraq': 'IQ',
  'Morocco': 'MA',
  'Peru': 'PE',
  'Malaysia': 'MY',
  'Angola': 'AO',
  'Ghana': 'GH',
  'Yemen': 'YE',
  'Nepal': 'NP',
  'Venezuela': 'VE',
  'Madagascar': 'MG',
  'Cameroon': 'CM',
  'North Korea': 'KP',
  'Taiwan': 'TW',
  'Sri Lanka': 'LK',
  'Syria': 'SY',
  'Burkina Faso': 'BF',
  'Mali': 'ML',
  'Chile': 'CL',
  'Kazakhstan': 'KZ',
  'Ecuador': 'EC',
  'Guatemala': 'GT',
  'Cambodia': 'KH',
  'Senegal': 'SN',
  'Chad': 'TD',
  'Somalia': 'SO',
  'Zimbabwe': 'ZW',
  'Guinea': 'GN',
  'Rwanda': 'RW',
  'Benin': 'BJ',
  'Tunisia': 'TN',
  'Bolivia': 'BO',
  'Haiti': 'HT',
  'Cuba': 'CU',
  'Dominican Republic': 'DO',
  'Jordan': 'JO',
  'Azerbaijan': 'AZ',
  'Honduras': 'HN',
  'United Arab Emirates': 'AE',
  'Hungary': 'HU',
  'Tajikistan': 'TJ',
  'Papua New Guinea': 'PG',
  'Serbia': 'RS',
  'Israel': 'IL',
  'Togo': 'TG',
  'Sierra Leone': 'SL',
  'Hong Kong': 'HK',
  'Laos': 'LA',
  'Paraguay': 'PY',
  'Bulgaria': 'BG',
  'Libya': 'LY',
  'Lebanon': 'LB',
  'Nicaragua': 'NI',
  'Kyrgyzstan': 'KG',
  'El Salvador': 'SV',
  'Turkmenistan': 'TM',
  'Singapore': 'SG',
  'Congo': 'CG',
  'Slovakia': 'SK',
  'Oman': 'OM',
  'Palestine': 'PS',
  'Costa Rica': 'CR',
  'Liberia': 'LR',
  'Central African Republic': 'CF',
  'New Zealand': 'NZ',
  'Mauritania': 'MR',
  'Panama': 'PA',
  'Kuwait': 'KW',
  'Croatia': 'HR',
  'Moldova': 'MD',
  'Georgia': 'GE',
  'Eritrea': 'ER',
  'Uruguay': 'UY',
  'Bosnia and Herzegovina': 'BA',
  'Mongolia': 'MN',
  'Armenia': 'AM',
  'Jamaica': 'JM',
  'Qatar': 'QA',
  'Albania': 'AL',
  'Puerto Rico': 'PR',
  'Lithuania': 'LT',
  'Namibia': 'NA',
  'Gambia': 'GM',
  'Botswana': 'BW',
  'Gabon': 'GA',
  'Lesotho': 'LS',
  'North Macedonia': 'MK',
  'Slovenia': 'SI',
  'Guinea-Bissau': 'GW',
  'Latvia': 'LV',
  'Bahrain': 'BH',
  'Equatorial Guinea': 'GQ',
  'Trinidad and Tobago': 'TT',
  'Estonia': 'EE',
  'Timor-Leste': 'TL',
  'Mauritius': 'MU',
  'Cyprus': 'CY',
  'Eswatini': 'SZ',
  'Djibouti': 'DJ',
  'Fiji': 'FJ',
  'Réunion': 'RE',
  'Comoros': 'KM',
  'Guyana': 'GY',
  'Bhutan': 'BT',
  'Solomon Islands': 'SB',
  'Macao': 'MO',
  'Montenegro': 'ME',
  'Luxembourg': 'LU',
  'Western Sahara': 'EH',
  'Suriname': 'SR',
  'Cabo Verde': 'CV',
  'Maldives': 'MV',
  'Malta': 'MT',
  'Brunei': 'BN',
  'Guadeloupe': 'GP',
  'Belize': 'BZ',
  'Bahamas': 'BS',
  'Martinique': 'MQ',
  'Iceland': 'IS',
  'Vanuatu': 'VU',
  'French Guiana': 'GF',
  'Barbados': 'BB',
  'New Caledonia': 'NC',
  'French Polynesia': 'PF',
  'Mayotte': 'YT',
  'Samoa': 'WS',
  'Saint Lucia': 'LC',
  'Guam': 'GU',
  'Curaçao': 'CW',
  'Kiribati': 'KI',
  'Micronesia': 'FM',
  'Grenada': 'GD',
  'Saint Vincent and the Grenadines': 'VC',
  'Aruba': 'AW',
  'Tonga': 'TO',
  'United States Virgin Islands': 'VI',
  'Seychelles': 'SC',
  'Antigua and Barbuda': 'AG',
  'Isle of Man': 'IM',
  'Andorra': 'AD',
  'Dominica': 'DM',
  'Cayman Islands': 'KY',
  'Bermuda': 'BM',
  'Marshall Islands': 'MH',
  'Northern Mariana Islands': 'MP',
  'Greenland': 'GL',
  'American Samoa': 'AS',
  'Saint Kitts and Nevis': 'KN',
  'Faroe Islands': 'FO',
  'Sint Maarten': 'SX',
  'Monaco': 'MC',
  'Turks and Caicos Islands': 'TC',
  'Saint Martin': 'MF',
  'Liechtenstein': 'LI',
  'San Marino': 'SM',
  'Gibraltar': 'GI',
  'British Virgin Islands': 'VG',
  'Caribbean Netherlands': 'BQ',
  'Palau': 'PW',
  'Cook Islands': 'CK',
  'Anguilla': 'AI',
  'Tuvalu': 'TV',
  'Wallis and Futuna': 'WF',
  'Nauru': 'NR',
  'Saint Barthélemy': 'BL',
  'Saint Pierre and Miquelon': 'PM',
  'Montserrat': 'MS',
  'Saint Helena': 'SH',
  'Falkland Islands': 'FK',
  'Niue': 'NU',
  'Tokelau': 'TK',
  'Vatican City': 'VA',
};

/**
 * Mapping of ISO 3166-1 alpha-2 codes to country names
 */
const CODE_TO_COUNTRY_NAME: Record<string, string> = Object.entries(COUNTRY_NAME_TO_CODE).reduce(
  (acc, [name, code]) => {
    acc[code] = name;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Mapping of ISO 3166-1 numeric country IDs to ISO 3166-1 alpha-2 codes
 * 
 * This mapping is used to convert numeric country IDs from TopoJSON data (world-110m.json)
 * to ISO alpha-2 codes for matching with proxy statistics.
 * 
 * The world-110m.json file stores countries with numeric ISO 3166-1 IDs (e.g., "242" for Fiji),
 * but our proxy data uses ISO alpha-2 codes (e.g., "FJ"). This table enables the conversion.
 * 
 * Key examples from the bug:
 * - "242" → "FJ" (Fiji)
 * - "834" → "TZ" (Tanzania)
 * - "643" → "RU" (Russia)
 * - "840" → "US" (United States)
 * - "124" → "CA" (Canada)
 * 
 * Source: ISO 3166-1 standard
 * Coverage: ~250 countries and territories
 */
const NUMERIC_ID_TO_ALPHA2: Record<string, string> = {
  // A
  "004": "AF", // Afghanistan
  "008": "AL", // Albania
  "010": "AQ", // Antarctica
  "012": "DZ", // Algeria
  "016": "AS", // American Samoa
  "020": "AD", // Andorra
  "024": "AO", // Angola
  "028": "AG", // Antigua and Barbuda
  "031": "AZ", // Azerbaijan
  "032": "AR", // Argentina
  "036": "AU", // Australia
  "040": "AT", // Austria
  "044": "BS", // Bahamas
  "048": "BH", // Bahrain
  "050": "BD", // Bangladesh
  "051": "AM", // Armenia
  "052": "BB", // Barbados
  "056": "BE", // Belgium
  "060": "BM", // Bermuda
  "064": "BT", // Bhutan
  "068": "BO", // Bolivia
  "070": "BA", // Bosnia and Herzegovina
  "072": "BW", // Botswana
  "074": "BV", // Bouvet Island
  "076": "BR", // Brazil
  "084": "BZ", // Belize
  "086": "IO", // British Indian Ocean Territory
  "090": "SB", // Solomon Islands
  "092": "VG", // British Virgin Islands
  "096": "BN", // Brunei
  "100": "BG", // Bulgaria
  "104": "MM", // Myanmar
  "108": "BI", // Burundi
  "112": "BY", // Belarus
  "116": "KH", // Cambodia
  "120": "CM", // Cameroon
  "124": "CA", // Canada
  "132": "CV", // Cabo Verde
  "136": "KY", // Cayman Islands
  "140": "CF", // Central African Republic
  "144": "LK", // Sri Lanka
  "148": "TD", // Chad
  "152": "CL", // Chile
  "156": "CN", // China
  "158": "TW", // Taiwan
  "162": "CX", // Christmas Island
  "166": "CC", // Cocos (Keeling) Islands
  "170": "CO", // Colombia
  "174": "KM", // Comoros
  "175": "YT", // Mayotte
  "178": "CG", // Congo
  "180": "CD", // Democratic Republic of the Congo
  "184": "CK", // Cook Islands
  "188": "CR", // Costa Rica
  "191": "HR", // Croatia
  "192": "CU", // Cuba
  "196": "CY", // Cyprus
  "203": "CZ", // Czechia
  "204": "BJ", // Benin
  "208": "DK", // Denmark
  "212": "DM", // Dominica
  "214": "DO", // Dominican Republic
  
  // E
  "218": "EC", // Ecuador
  "222": "SV", // El Salvador
  "226": "GQ", // Equatorial Guinea
  "231": "ET", // Ethiopia
  "232": "ER", // Eritrea
  "233": "EE", // Estonia
  "234": "FO", // Faroe Islands
  "238": "FK", // Falkland Islands
  "239": "GS", // South Georgia and the South Sandwich Islands
  "242": "FJ", // Fiji
  "246": "FI", // Finland
  "248": "AX", // Åland Islands
  "250": "FR", // France
  "254": "GF", // French Guiana
  "258": "PF", // French Polynesia
  "260": "TF", // French Southern Territories
  "262": "DJ", // Djibouti
  "266": "GA", // Gabon
  "268": "GE", // Georgia
  "270": "GM", // Gambia
  "275": "PS", // Palestine
  "276": "DE", // Germany
  "288": "GH", // Ghana
  "292": "GI", // Gibraltar
  "296": "KI", // Kiribati
  "300": "GR", // Greece
  "304": "GL", // Greenland
  "308": "GD", // Grenada
  "312": "GP", // Guadeloupe
  "316": "GU", // Guam
  "320": "GT", // Guatemala
  "324": "GN", // Guinea
  "328": "GY", // Guyana
  "332": "HT", // Haiti
  "334": "HM", // Heard Island and McDonald Islands
  "336": "VA", // Vatican City
  "340": "HN", // Honduras
  "344": "HK", // Hong Kong
  "348": "HU", // Hungary
  "352": "IS", // Iceland
  "356": "IN", // India
  "360": "ID", // Indonesia
  "364": "IR", // Iran
  "368": "IQ", // Iraq
  "372": "IE", // Ireland
  "376": "IL", // Israel
  "380": "IT", // Italy
  "384": "CI", // Côte d'Ivoire
  "388": "JM", // Jamaica
  "392": "JP", // Japan
  "398": "KZ", // Kazakhstan
  "400": "JO", // Jordan
  "404": "KE", // Kenya
  "408": "KP", // North Korea
  "410": "KR", // South Korea
  "414": "KW", // Kuwait
  "417": "KG", // Kyrgyzstan
  "418": "LA", // Laos
  "422": "LB", // Lebanon
  "426": "LS", // Lesotho
  "428": "LV", // Latvia
  "430": "LR", // Liberia
  "434": "LY", // Libya
  "438": "LI", // Liechtenstein
  "440": "LT", // Lithuania
  "442": "LU", // Luxembourg
  "446": "MO", // Macao
  "450": "MG", // Madagascar
  "454": "MW", // Malawi
  "458": "MY", // Malaysia
  "462": "MV", // Maldives
  "466": "ML", // Mali
  "470": "MT", // Malta
  "474": "MQ", // Martinique
  "478": "MR", // Mauritania
  "480": "MU", // Mauritius
  "484": "MX", // Mexico
  "492": "MC", // Monaco
  "496": "MN", // Mongolia
  "498": "MD", // Moldova
  "499": "ME", // Montenegro
  "500": "MS", // Montserrat
  "504": "MA", // Morocco
  "508": "MZ", // Mozambique
  "512": "OM", // Oman
  "516": "NA", // Namibia
  "520": "NR", // Nauru
  "524": "NP", // Nepal
  "528": "NL", // Netherlands
  "531": "CW", // Curaçao
  "533": "AW", // Aruba
  "534": "SX", // Sint Maarten
  "535": "BQ", // Caribbean Netherlands
  "540": "NC", // New Caledonia
  "548": "VU", // Vanuatu
  "554": "NZ", // New Zealand
  "558": "NI", // Nicaragua
  "562": "NE", // Niger
  "566": "NG", // Nigeria
  "570": "NU", // Niue
  "574": "NF", // Norfolk Island
  "578": "NO", // Norway
  "580": "MP", // Northern Mariana Islands
  "581": "UM", // United States Minor Outlying Islands
  "583": "FM", // Micronesia
  "584": "MH", // Marshall Islands
  "585": "PW", // Palau
  "586": "PK", // Pakistan
  "591": "PA", // Panama
  "598": "PG", // Papua New Guinea
  "600": "PY", // Paraguay
  "604": "PE", // Peru
  "608": "PH", // Philippines
  "612": "PN", // Pitcairn
  "616": "PL", // Poland
  "620": "PT", // Portugal
  "624": "GW", // Guinea-Bissau
  "626": "TL", // Timor-Leste
  "630": "PR", // Puerto Rico
  "634": "QA", // Qatar
  "638": "RE", // Réunion
  "642": "RO", // Romania
  "643": "RU", // Russia
  "646": "RW", // Rwanda
  "652": "BL", // Saint Barthélemy
  "654": "SH", // Saint Helena
  "659": "KN", // Saint Kitts and Nevis
  "660": "AI", // Anguilla
  "662": "LC", // Saint Lucia
  "663": "MF", // Saint Martin
  "666": "PM", // Saint Pierre and Miquelon
  "670": "VC", // Saint Vincent and the Grenadines
  "674": "SM", // San Marino
  "678": "ST", // São Tomé and Príncipe
  "682": "SA", // Saudi Arabia
  "686": "SN", // Senegal
  "688": "RS", // Serbia
  "690": "SC", // Seychelles
  "694": "SL", // Sierra Leone
  "702": "SG", // Singapore
  "703": "SK", // Slovakia
  "704": "VN", // Vietnam
  "705": "SI", // Slovenia
  "706": "SO", // Somalia
  "710": "ZA", // South Africa
  "716": "ZW", // Zimbabwe
  "724": "ES", // Spain
  "728": "SS", // South Sudan
  "729": "SD", // Sudan
  "732": "EH", // Western Sahara
  "740": "SR", // Suriname
  "744": "SJ", // Svalbard and Jan Mayen
  "748": "SZ", // Eswatini
  "752": "SE", // Sweden
  "756": "CH", // Switzerland
  "760": "SY", // Syria
  "762": "TJ", // Tajikistan
  "764": "TH", // Thailand
  "768": "TG", // Togo
  "772": "TK", // Tokelau
  "776": "TO", // Tonga
  "780": "TT", // Trinidad and Tobago
  "784": "AE", // United Arab Emirates
  "788": "TN", // Tunisia
  "792": "TR", // Turkey
  "795": "TM", // Turkmenistan
  "796": "TC", // Turks and Caicos Islands
  "798": "TV", // Tuvalu
  "800": "UG", // Uganda
  "804": "UA", // Ukraine
  "807": "MK", // North Macedonia
  "818": "EG", // Egypt
  "826": "GB", // United Kingdom
  "831": "GG", // Guernsey
  "832": "JE", // Jersey
  "833": "IM", // Isle of Man
  "834": "TZ", // Tanzania
  "840": "US", // United States
  "850": "VI", // U.S. Virgin Islands
  "854": "BF", // Burkina Faso
  "858": "UY", // Uruguay
  "860": "UZ", // Uzbekistan
  "862": "VE", // Venezuela
  "876": "WF", // Wallis and Futuna
  "882": "WS", // Samoa
  "887": "YE", // Yemen
  "894": "ZM", // Zambia
};

/**
 * Converts a country name to ISO 3166-1 alpha-2 country code
 * 
 * @param countryName - Country name or existing country code
 * @returns ISO 3166-1 alpha-2 country code (2 uppercase letters), or 'XX' if unknown
 * 
 * Preconditions:
 * - countryName is non-empty string
 * 
 * Postconditions:
 * - Returns ISO 3166-1 alpha-2 country code (2 uppercase letters)
 * - If input is already a code, returns it unchanged
 * - If country name not found, returns 'XX' (unknown)
 */
export function getCountryCode(countryName: string): string {
  // Handle empty or invalid input
  if (!countryName || typeof countryName !== 'string') {
    return 'XX';
  }
  
  // If already a 2-letter code, return it unchanged
  if (/^[A-Z]{2}$/.test(countryName)) {
    return countryName;
  }
  
  // Look up country name in mapping using hasOwnProperty to avoid prototype pollution
  const code = Object.prototype.hasOwnProperty.call(COUNTRY_NAME_TO_CODE, countryName)
    ? COUNTRY_NAME_TO_CODE[countryName]
    : undefined;
  
  // Return code or 'XX' for unknown
  return code || 'XX';
}

/**
 * Converts an ISO 3166-1 alpha-2 country code to full country name
 * 
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns Full country name, or the code itself if not recognized
 * 
 * Preconditions:
 * - countryCode is 2-character string
 * 
 * Postconditions:
 * - Returns full country name
 * - If code not found, returns the code itself
 */
export function getCountryName(countryCode: string): string {
  return CODE_TO_COUNTRY_NAME[countryCode] || countryCode;
}

/**
 * Converts an ISO 3166-1 numeric country ID to ISO 3166-1 alpha-2 code
 * 
 * This function is used to convert numeric country IDs from TopoJSON data (world-110m.json)
 * to ISO alpha-2 codes for matching with proxy statistics.
 * 
 * @param numericId - ISO 3166-1 numeric country ID as a string (e.g., "242" for Fiji)
 * @returns ISO 3166-1 alpha-2 country code (e.g., "FJ"), or 'XX' if not found or invalid
 * 
 * Preconditions:
 * - numericId is a string
 * 
 * Postconditions:
 * - Returns ISO 3166-1 alpha-2 code (2 uppercase letters) if numeric ID is valid and found
 * - Returns 'XX' if numericId is not a numeric string
 * - Returns 'XX' if numericId is not found in the mapping table
 * 
 * Examples:
 * - getCountryCodeFromNumericId("242") → "FJ" (Fiji)
 * - getCountryCodeFromNumericId("834") → "TZ" (Tanzania)
 * - getCountryCodeFromNumericId("643") → "RU" (Russia)
 * - getCountryCodeFromNumericId("999") → "XX" (unknown)
 * - getCountryCodeFromNumericId("abc") → "XX" (not numeric)
 */
export function getCountryCodeFromNumericId(numericId: string): string {
  // Validate input is a non-empty string
  if (!numericId || typeof numericId !== 'string') {
    return 'XX';
  }
  
  // Check if the input is a numeric string (1-3 digits)
  if (!/^\d{1,3}$/.test(numericId)) {
    return 'XX';
  }
  
  // Look up the numeric ID in the mapping table
  const alpha2Code = NUMERIC_ID_TO_ALPHA2[numericId];
  
  // Return the alpha-2 code or 'XX' if not found
  return alpha2Code || 'XX';
}


/**
 * Aggregates proxy data by country
 * 
 * @param proxies - Array of Proxy objects
 * @returns Array of CountryStats sorted by totalProxies descending
 * 
 * Preconditions:
 * - proxies is a valid array of Proxy objects
 * - Each proxy has country field (may be null)
 * 
 * Postconditions:
 * - Returns array of CountryStats
 * - Countries with null country field are excluded
 * - Each CountryStats has correct totals and averages
 * - Array is sorted by totalProxies descending
 */
export function aggregateByCountry(proxies: Proxy[]): CountryStats[] {
  // Step 1: Filter out proxies without country data
  const validProxies = proxies.filter(p => p.country !== null && p.country !== undefined);
  
  // Step 2: Group proxies by country code
  const countryMap = new Map<string, Proxy[]>();
  
  for (const proxy of validProxies) {
    const code = getCountryCode(proxy.country!);
    if (!countryMap.has(code)) {
      countryMap.set(code, []);
    }
    countryMap.get(code)!.push(proxy);
  }
  
  // Step 3: Calculate statistics for each country
  const stats: CountryStats[] = [];
  
  for (const [code, countryProxies] of countryMap) {
    const online = countryProxies.filter(p => p.status === 'online');
    const offline = countryProxies.filter(p => p.status === 'offline');
    const checking = countryProxies.filter(p => p.status === 'checking');
    const unchecked = countryProxies.filter(p => p.status === 'unchecked');
    
    // Calculate average latency from online proxies with non-null latency
    const latencies = online
      .map(p => p.latency)
      .filter((l): l is number => l !== null);
    
    const avgLatency = latencies.length > 0
      ? latencies.reduce((sum, l) => sum + l, 0) / latencies.length
      : null;
    
    stats.push({
      countryCode: code,
      countryName: getCountryName(code),
      totalProxies: countryProxies.length,
      onlineProxies: online.length,
      offlineProxies: offline.length,
      uncheckedProxies: unchecked.length + checking.length, // Include checking in unchecked
      avgLatency,
      proxies: countryProxies
    });
  }
  
  // Step 4: Sort by total proxies descending
  return stats.sort((a, b) => b.totalProxies - a.totalProxies);
}


/**
 * Aggregates proxy data by city with geographic coordinates
 * 
 * @param proxies - Array of Proxy objects
 * @param cityCoordinates - Map of city keys to [longitude, latitude] coordinates
 * @returns Array of CityMarker objects sorted by proxyCount descending
 * 
 * Preconditions:
 * - proxies is a valid array of Proxy objects
 * - cityCoordinates map is loaded from city-coordinates.json
 * - Each proxy has city and country fields (may be null)
 * 
 * Postconditions:
 * - Returns array of CityMarker objects
 * - Only cities with known coordinates are included
 * - Each CityMarker has correct counts
 * - Array is sorted by proxyCount descending
 */
export function aggregateByCities(
  proxies: Proxy[],
  cityCoordinates: Map<string, [number, number]>
): CityMarker[] {
  // Step 1: Filter proxies with both city and country
  const validProxies = proxies.filter(
    p => p.city !== null && p.city !== undefined && p.country !== null && p.country !== undefined
  );
  
  // Step 2: Group by city key (city + country)
  const cityMap = new Map<string, Proxy[]>();
  
  for (const proxy of validProxies) {
    const key = `${proxy.city},${getCountryCode(proxy.country!)}`;
    if (!cityMap.has(key)) {
      cityMap.set(key, []);
    }
    cityMap.get(key)!.push(proxy);
  }
  
  // Step 3: Create markers for cities with known coordinates
  const markers: CityMarker[] = [];
  
  for (const [key, cityProxies] of cityMap) {
    const [city, countryCode] = key.split(',');
    const coords = cityCoordinates.get(key);
    
    // Skip cities without coordinates
    if (!coords) {
      console.warn(`City coordinates not found for: ${key}`);
      continue;
    }
    
    // Validate coordinates are within valid ranges
    const [lon, lat] = coords;
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
      console.warn(`Invalid coordinates for ${key}: [${lon}, ${lat}]`);
      continue;
    }
    
    const online = cityProxies.filter(p => p.status === 'online').length;
    const offline = cityProxies.filter(p => p.status === 'offline').length;
    
    markers.push({
      city,
      countryCode,
      coordinates: coords,
      proxyCount: cityProxies.length,
      onlineCount: online,
      offlineCount: offline
    });
  }
  
  // Step 4: Sort by proxy count descending
  return markers.sort((a, b) => b.proxyCount - a.proxyCount);
}


/**
 * Default color scale for country visualization
 */
export const DEFAULT_COLOR_SCALE: ColorScale = {
  domain: [0, 1, 5, 10, 20],
  range: [
    '#e4e4e7', // Gray for 0 proxies
    '#99f6e4', // Very light teal for 1-4 proxies
    '#5eead4', // Light teal for 5-9 proxies
    '#2dd4bf', // Medium teal for 10-19 proxies
    '#14b8a6', // Ocean teal for 20+ proxies
  ],
};

/**
 * Calculates fill color for a country based on proxy count
 * 
 * @param proxyCount - Number of proxies in the country
 * @param colorScale - Optional color scale (uses default if not provided)
 * @returns Hex color string
 * 
 * Preconditions:
 * - proxyCount >= 0
 * - colorScale has valid domain and range
 * 
 * Postconditions:
 * - Returns valid hex color string
 * - Color intensity increases with proxy count
 */
export function getCountryColor(proxyCount: number, colorScale: ColorScale = DEFAULT_COLOR_SCALE): string {
  if (proxyCount === 0) {
    return colorScale.range[0]; // Gray for no proxies
  }
  
  // Find the appropriate color bucket
  const { domain, range } = colorScale;
  
  for (let i = domain.length - 1; i >= 0; i--) {
    if (proxyCount >= domain[i]) {
      return range[i];
    }
  }
  
  return range[0]; // Fallback to lightest color
}


/**
 * Loads world map TopoJSON data
 * 
 * @returns Promise resolving to TopoJSON Topology object
 * 
 * Preconditions:
 * - world-110m.json file exists in /public/data/
 * - File contains valid TopoJSON data
 * 
 * Postconditions:
 * - Returns parsed Topology object
 * - Throws error if file not found or invalid JSON
 */
export async function loadWorldMap(): Promise<any> {
  try {
    const response = await fetch('/data/world-110m.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load world map: ${response.statusText}`);
    }
    
    const topology = await response.json();
    return topology;
  } catch (error) {
    console.error('Error loading world map:', error);
    throw new Error('Failed to load map data. Please refresh the page.');
  }
}

/**
 * Loads city coordinates data
 * 
 * @returns Promise resolving to Map of city keys to [longitude, latitude]
 * 
 * Preconditions:
 * - city-coordinates.json file exists in /public/data/
 * - File contains valid JSON object with city keys and coordinate arrays
 * 
 * Postconditions:
 * - Returns Map with city keys (format: "City,CC") to [longitude, latitude]
 * - Throws error if file not found or invalid JSON
 */
export async function loadCityCoordinates(): Promise<Map<string, [number, number]>> {
  try {
    const response = await fetch('/data/city-coordinates.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load city coordinates: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Convert object to Map
    const coordinatesMap = new Map<string, [number, number]>();
    for (const [key, coords] of Object.entries(data)) {
      if (Array.isArray(coords) && coords.length === 2) {
        coordinatesMap.set(key, coords as [number, number]);
      }
    }
    
    return coordinatesMap;
  } catch (error) {
    console.error('Error loading city coordinates:', error);
    throw new Error('Failed to load city coordinates. Please refresh the page.');
  }
}
