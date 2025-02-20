class DateHandler {
  dateStringWithoutTimezone(date) {
    const formatedDate = new Date(date);
    const tzoffset = formatedDate.getTimezoneOffset() * 60000;
    return new Date(formatedDate.valueOf() - tzoffset).toISOString();
  }
}

module.exports = DateHandler;
