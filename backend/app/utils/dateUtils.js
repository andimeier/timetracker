/**
 * Utility class for date/datetime handling.
 * @module dateUtils
 * @type {exports}
 */
var moment = require('moment');


/**
 * Returns the Epoch timestamp of Monday of the given week, 00:00:00. The week is given in
 * ISO format as year/ISO week number.
 * @method startOfWeek
 * @param week {String} week in the format YYYYWW (YYYY ... year, WW ... ISO week number)
 * @return {Number} Monday 00:00 of the given week
 */
exports.startOfWeek = function(week) {

	if (week.length == 6 && week.match(/^\d\d\d\d\d\d/)) {

		// week given in the format YYYYWW (YYYY ... year, WW ... ISO nr of week)
		var year = week.substr(0, 4);
		var week = week.substr(4, 2);
		var start = moment().isoWeekYear(year).isoWeek(week).isoWeekday(1).startOf('day');
	} else {
		throw new Exception('Unrecognized week format [%s], should be YYYYWW', week);
	}

	return start.valueOf()
}

/**
 * Calculates the week in which the given date lies and returns the Epoch timestamp of Monday
 * of this given week, 00:00:00.
 * @method startOfWeekFromDate
 * @param day {String} some date in the format YYYYMMDD
 * @return {Number} Monday 00:00 of the week containing the given date
 */
exports.startOfWeekFromDate = function(day) {

	if (day.match(/^\d\d\d\d\d\d\d\d/)) {
		// date specified as a date value somewhere in the week
		var year = day.substr(0, 4);
		var month = day.substr(4, 2);
		var mday = day.substr(6, 2);
		var start = moment([year, month - 1, mday]).isoWeekday(1);
	} else {
		throw new Exception('Unrecognized date format [%s], should be YYYYMMDD', day);
	}

	return start.valueOf()
};

/**
 * "Inflates" the date time value, that means, converts the compact, internal
 * date/time format into the standard, human-readable format YYYY-MM-DD'T'hh:mm:ss.
 * @param comp  {String} a compact, internal date time value, either in the form.
 * If a time portion is given, it will be considered. But this can be overridden
 * by specifying 'onlyDate'.
 *   yyyymmddThhmmss (15 characters long) or yyyymmdd (8 characters long)
 * @param onlyDate {Boolean} if true, the time part will be truncated, only the
 *   date value will be considered. The returned value will be in the format
 *   YYYY-MM-DD
 * @returns {String/null} the converted value, either as date/time value
 *   "YYYY-MM-DD hh:mm:ss" or as date value "YYYY-MM-DD".
 *   If the date time string is not recognized, null will be returned
 */
exports.inflateDateTime = function(comp, onlyDate) {
	var result = null;
	if (comp) {
		if (comp.length === 15 && comp.match(/^\d\d\d\d\d\d\d\dT\d\d\d\d\d\d$/) && !onlyDate) {
			// yyyymmddThhmmss
			result = comp.replace(/^(....)(..)(..)T(..)(..)(..)$/, '$1-$2-$3T$4:$5:$6');
		} else if ((comp.length === 8) || (comp.length === 15 && onlyDate)) {
			// yyyymmdd
			result = comp.replace(/^(....)(..)(..).*$/, '$1-$2-$3');
		} else {
			logger.error('Illegal argument for inflateDateTime: [comp]');
		}
	}
	return result;
}