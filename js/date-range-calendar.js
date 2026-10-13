(() => {
  let flexGroups = 0;

  // Exact / ±1 / ±3 days. Radios keep the choice in the form data; each calendar gets its own group name.
  window.dateFlexibilityMarkup = (name = `dateFlex${(flexGroups += 1)}`) => `
      <div class="date-range-calendar__flexibility" role="radiogroup" aria-label="Date flexibility">
        <label><input type="radio" name="${name}" value="0" checked><span>Exact dates</span></label>
        <label><input type="radio" name="${name}" value="1"><span>± 1 day</span></label>
        <label><input type="radio" name="${name}" value="3"><span>± 3 days</span></label>
      </div>`;

  window.createDateRangeCalendar = ({
    title = "Choose your travel dates",
    applyText = "Choose dates",
  } = {}) => {
    const calendar = document.createElement("div");
    calendar.className = "date-range-calendar";
    calendar.innerHTML = `
      <p>${title}</p>
      <div class="date-range-calendar__months">
        <button type="button" class="date-range-calendar__nav" data-calendar-prev aria-label="Previous month"><span class="ui-chevron ui-chevron--left" aria-hidden="true"></span></button>
        <div data-calendar-month></div><div data-calendar-month></div>
        <button type="button" class="date-range-calendar__nav" data-calendar-next aria-label="Next month"><span class="ui-chevron ui-chevron--right" aria-hidden="true"></span></button>
      </div>
      ${window.dateFlexibilityMarkup("dateFlex")}
      <button type="button" class="date-range-calendar__apply" data-calendar-apply>${applyText}</button>`;
    return calendar;
  };
})();
