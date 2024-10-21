

module.exports = {
    /**
     * 
     * @param {string} key --type
     * @returns {string | undefined}
     */
    getArgV: function (key) {
        if (!key) {
            return;
        }

        const args = process.argv;

        if (!args || !Array.isArray(args) || args.length === 0) {
            return;
        }

        for (const arg of args) {
            if (arg.toLowerCase().startsWith(key.toLowerCase() + '=')) {
                return arg.slice(key.length + 1, arg.length).trim('"').trim("'");
            }
        }
    },

    /**
     * 
     * @param {string} key --dedbug
     * @returns {boolean}
     */
    isHasArg: function (key) {
        if (!key) {
            return false;
        }

        const args = process.argv;

        if (!args || !Array.isArray(args) || args.length === 0) {
            return false;
        }

        for (const arg of args) {
            if (arg.toLowerCase() === key.toLowerCase() || arg.toLowerCase().startsWith(key.toLowerCase() + '=')) {
                return true;
            }
        }

        return false;
    },

    /**
     * 
     * @returns {number}
     */
    nextHourTimestamp: function () {
        const moment = require('moment-timezone');

        const nextHourStr = `${moment().tz('Asia/Shanghai').add(1, 'h').format('yyyy-MM-DDTHH')}:00:00.000+0800`;

        return moment(nextHourStr).toDate().getTime()
    }
}