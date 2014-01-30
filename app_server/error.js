/**
 * @param errorCode errorCode
 * @param userMessage (optional) a descriptive message for the user, if omitted, 
 *   the default message related to the errorCode is returned instead.
 * @param errorObj further tech/dev info, arbitrary data
 */
exports.error = function(errorCode, errorObj, userMessage) {

	var errorCodes = {
		1000: "Wrong credentials"
	};

	return {
		errorCode: errorCode,
		errorObj: errorObj,
		userMessage: userMessage ? userMessage : errorCodes[errorCode]
	};

};
