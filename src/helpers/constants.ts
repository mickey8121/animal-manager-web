import app from 'helpers/app';

export enum Language {
  En = 'en',
  De = 'de',
  Fr = 'fr',
  RU = 'ru',
  Nl = 'nl',
}

export const ACCESS_TOKEN_KEY = 'animal-manager-access-token';
export const REFRESH_TOKEN_KEY = 'animal-manager-refresh-token';

export const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Русский', value: 'ru' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Nederlandse', value: 'nl' },
];

export const COUNTRIES = [
  { value: 'AL', label: 'Albania' },
  { value: 'DZ', label: 'Algeria' },
  { value: 'AR', label: 'Argentina' },
  { value: 'AU', label: 'Australia' },
  { value: 'AT', label: 'Austria' },
  { value: 'BH', label: 'Bahrain' },
  { value: 'BY', label: 'Belarus' },
  { value: 'BE', label: 'Belgium' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'BA', label: 'Bosnia and Herzegovina' },
  { value: 'BR', label: 'Brazil' },
  { value: 'BG', label: 'Bulgaria' },
  { value: 'CA', label: 'Canada' },
  { value: 'CL', label: 'Chile' },
  { value: 'CN', label: 'China' },
  { value: 'CO', label: 'Colombia' },
  { value: 'CR', label: 'CostaRica' },
  { value: 'HR', label: 'Croatia' },
  { value: 'CY', label: 'Cyprus' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'DK', label: 'Denmark' },
  { value: 'DO', label: 'Dominican Republic' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'EG', label: 'Egypt' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'EE', label: 'Estonia' },
  { value: 'FI', label: 'Finland' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'GR', label: 'Greece' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'HN', label: 'Honduras' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'HU', label: 'Hungary' },
  { value: 'IS', label: 'Iceland' },
  { value: 'IN', label: 'India' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'IQ', label: 'Iraq' },
  { value: 'IE', label: 'Ireland' },
  { value: 'IL', label: 'Israel' },
  { value: 'IT', label: 'Italy' },
  { value: 'JP', label: 'Japan' },
  { value: 'JO', label: 'Jordan' },
  { value: 'KW', label: 'Kuwait' },
  { value: 'LV', label: 'Latvia' },
  { value: 'LB', label: 'Lebanon' },
  { value: 'LY', label: 'Libya' },
  { value: 'LT', label: 'Lithuania' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'MK', label: 'Macedonia' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'MT', label: 'Malta' },
  { value: 'MX', label: 'Mexico' },
  { value: 'ME', label: 'Montenegro' },
  { value: 'MA', label: 'Morocco' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'NO', label: 'Norway' },
  { value: 'OM', label: 'Oman' },
  { value: 'PA', label: 'Panama' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Peru' },
  { value: 'PH', label: 'Philippines' },
  { value: 'PL', label: 'Poland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'QA', label: 'Qatar' },
  { value: 'RO', label: 'Romania' },
  { value: 'RU', label: 'Russia' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'RS', label: 'Serbia' },
  { value: 'CS', label: 'Serbia and Montenegro' },
  { value: 'SG', label: 'Singapore' },
  { value: 'SK', label: 'Slovakia' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'KR', label: 'South Korea' },
  { value: 'ES', label: 'Spain' },
  { value: 'SD', label: 'Sudan' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'SY', label: 'Syria' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'TH', label: 'Thailand' },
  { value: 'TN', label: 'Tunisia' },
  { value: 'TR', label: 'Turkey' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'YE', label: 'Yemen' },
];

export const HERDS_ROUTE = app.appName === 'sheep' ? 'flocks' : 'herds';
export const IS_ALPACA = app.appName === 'alpaca';

export const PHONE_PLACEHOLDER = '+1 (123) 456 99 00';

const INITIAL_ALPACA_COLORS = [
  'white',
  'beige',
  'lightFawn',
  'darkFawn',
  'mediumBrown',
  'darkBrown',
  'bayBlack',
  'trueBlack',
  'darkSilverGrey',
  'mediumSilverGrey',
  'lightSilverGrey',
  'darkRoseGrey',
  'mediumRoseGrey',
  'lightRoseGrey',
  'pinto',
  'appaloosa',
];
const INITIAL_SHEEP_COLORS = ['white', 'black', 'blackAndWhite'];

export const INITIAL_ANIMAL_COLORS = IS_ALPACA ? INITIAL_ALPACA_COLORS : INITIAL_SHEEP_COLORS;

export const ROWS_PER_PAGE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '25', value: '25' },
  { label: '100', value: '100' },
];

export const BREEDER = 'breeder';
export const BILLING_PLANS = {
  owner: 'Alpaca Owner',
  breeder: 'Alpaca Breeder',
};
