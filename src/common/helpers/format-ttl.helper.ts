import { UserLang } from "@prisma/client";

/**
 * An enumeration of supported time unit keys.
 */
enum TimeUnitKey {
    DAYS = 'days',
    HOURS = 'hours',
    MINUTES = 'minutes',
    SECONDS = 'seconds',
    MILLISECONDS = 'milliseconds',
}

/**
 * A mapping of time unit keys to their corresponding strings in English (EN).
 */
const TIME_UNITS_EN = {
    [TimeUnitKey.DAYS]: 'days',
    [TimeUnitKey.HOURS]: 'hours',
    [TimeUnitKey.MINUTES]: 'minutes',
    [TimeUnitKey.SECONDS]: 'seconds',
    [TimeUnitKey.MILLISECONDS]: '< 1 minute',
};

/**
 * A mapping of time unit keys to their corresponding strings in Spanish (ES).
 */
const TIME_UNITS_ES = {
    [TimeUnitKey.DAYS]: 'días',
    [TimeUnitKey.HOURS]: 'horas',
    [TimeUnitKey.MINUTES]: 'minutos',
    [TimeUnitKey.SECONDS]: 'segundos',
    [TimeUnitKey.MILLISECONDS]: '< 1 minuto',
};

/**
 * A Map that associates a user language (@prisma/client.UserLang) with its corresponding time unit translation object.
 */
const timeUnitMap = new Map<UserLang, Object>([
    [UserLang.EN, TIME_UNITS_EN],
    [UserLang.ES, TIME_UNITS_ES],
]);

/**
 * The number of seconds in a minute.
 */
const MINUTE_IN_SECONDS = 60;

/**
 * An array of time unit objects, each containing a unit key and its conversion factor in seconds.
 */
const timeUnits = [
    { unit: TimeUnitKey.DAYS, conversion: MINUTE_IN_SECONDS * 60 * 24 },
    { unit: TimeUnitKey.HOURS, conversion: MINUTE_IN_SECONDS * 60 },
    { unit: TimeUnitKey.MINUTES, conversion: MINUTE_IN_SECONDS },
];

/**
 * Formats a duration in seconds into a human-readable string based on the provided user language.
 *
 * @param {number} seconds - The duration in seconds.
 * @param {UserLang} lang - The user's preferred language (@prisma/client.UserLang).
 * @returns {string} The formatted duration string.
 * @throws {Error} If the provided duration is negative.
 */
export default function formatTTL(seconds: number, lang: UserLang): string {
    // Retrieve the time unit translations for the user's language
    const translation = timeUnitMap.get(lang);

    // Validate input
    if (seconds < 0) {
        throw new Error("Duration cannot be negative");
    }

    // Find the appropriate time unit and calculate the value
    for (const unit of timeUnits) {
        if (seconds >= unit.conversion) {
            const value = Math.floor(seconds / unit.conversion);
            return `${value} ${translation[unit.unit]}`;
        }
    }

    // If no matching unit is found, return the translation for milliseconds (less than a minute)
    return translation[TimeUnitKey.MILLISECONDS];
}
