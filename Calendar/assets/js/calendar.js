var Calendar = function () {
    this._createElement = function (elementString, className, textContent) {
        var element = document.createElement(elementString);
        if (className !== '') element.className = className;
        element.textContent = textContent || '';
        return element;
    };

    this.date = {
        month: new Date().getMonth(),
        day: new Date().getDate(),
        year: new Date().getFullYear()
    }

    this.getDate = function () {
        return new Date((this.date.month + 1) + '/' + this.date.day + '/' + this.date.year);
    };

    this.setDate = function (date) {
        var date = new Date(date);

        this.date = {
            month: date.getMonth(),
            day: date.getDate(),
            year: date.getFullYear()
        }
    }

    this.getDayName = function () {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[this.getDate().getDay()];
    };

    this.getMonthName = function () {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[this.date.month];
    };

    this.getNumberOfDays = function () {
        return new Date(this.date.year, this.date.month + 1, 0).getDate();
    };

    this.getFirstDayInMonth = function () {
        return new Date(this.date.year, this.date.month, 1).getDay();
    };
};

Calendar.prototype.render = function (element) {
    var $this = this;

    //#region Create Layout Elements
    var calendarWrapper = document.querySelector(element);
    calendarWrapper.className += 'calendar-wrapper';

    var dateDisplayWrapper = $this._createElement('div', 'date-display-wrapper'),
        dayName = $this._createElement('div', 'day-name', $this.getDayName()),
        dayNumber = $this._createElement('div', 'day-number', $this.date.day),
        dayNumberPages = $this._createElement('div', 'day-number-pages'); //for styling
    dateDisplayWrapper.appendChild(dayName);
    dateDisplayWrapper.appendChild(dayNumber);
    dateDisplayWrapper.appendChild(dayNumberPages);

    var calendarDisplayWrapper = $this._createElement('div', 'calendar-display-wrapper');

    var navigationWrapper = $this._createElement('div', 'navigation-wrapper'),
        previousMonth = $this._createElement('div', 'previous-month nav-button', '<'),
        monthYear = $this._createElement('div', 'month-year', $this.getMonthName() + ' ' + $this.date.year),
        nextMonth = $this._createElement('div', 'next-month nav-button', '>');
    navigationWrapper.appendChild(previousMonth);
    navigationWrapper.appendChild(monthYear);
    navigationWrapper.appendChild(nextMonth);

    previousMonth.addEventListener('click', navigate);
    nextMonth.addEventListener('click', navigate);

    var dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    var calendarTable = $this._createElement('table', 'calendar-table'),
        calendarTableHeader = $this._createElement('tr', 'day-labels'),
        calendarTableBody = $this._createElement('tbody', '');
    for (var i = 0; i < dayLabels.length; i++) {
        var th = $this._createElement('th', '', dayLabels[i]);
        calendarTableHeader.appendChild(th);
    }
    calendarTable.appendChild(calendarTableHeader);
    calendarTable.appendChild(calendarTableBody);
    //#endregion

    function updateDateDisplay() {
        dayName.textContent = $this.getDayName();
        dayNumber.textContent = $this.date.day;
        monthYear.textContent = $this.getMonthName() + ' ' + $this.date.year;
    }

    function buildCalendarBody() {
        var currentRow = 0;

        calendarTableBody.innerHTML = '';

        var dateRow = document.createElement('tr');
        //This will add blank cells until the first day of the week is reached
        while (currentRow < $this.getFirstDayInMonth()) {
            var td = $this._createElement('td', '', '');
            dateRow.appendChild(td);
            currentRow++;
        }

        /* The currentRow var helps keep track of the row the day falls on.
           This allows a new row to be added when 7th row is reached */
        var numberOfDays = $this.getNumberOfDays();
        for (var i = 1; i <= numberOfDays ; i++) {
            var cls = $this.date.day === i ? ' selected' : '';

            if (currentRow === 7) {
                currentRow = 0;
                dateRow = document.createElement('tr');
            }

            var td = $this._createElement('td', 'selectable', i);
            td.className += cls;

            td.addEventListener('click', function (evt) {
                var selected = document.querySelectorAll(element + ' .selected')[0];
                selected.className = 'selectable';
                this.className += ' selected';

                $this.date.day = evt.target.textContent;

                updateDateDisplay();
            });
            dateRow.appendChild(td);

            calendarTableBody.appendChild(dateRow);
            currentRow++;
        }

        calendarTable.appendChild(calendarTableBody);
    };

    function navigate(evt) {
        var direction = evt.target.textContent == '>' || evt.keyCode == 38 || evt.keyCode == 39 ? 'next' : 'previous';

        switch (direction) {
            case 'next':
                $this.date.month += 1;

                if ($this.date.month == 12) {
                    $this.date.month = 0;
                    $this.date.year += 1;
                }
                break;
            case 'previous':
                if ($this.date.month == 0) {
                    $this.date.month = 12;
                    $this.date.year -= 1;
                }
                $this.date.month -= 1;
                break;
        }

        $this.date.day = 1;
        updateDateDisplay();
        buildCalendarBody();
    }

    //This would affect all instances of Calendar
    document.addEventListener('keydown', function (evt) {
        switch (evt.keyCode) {
            case 37: case 38: case 39: case 40:
                navigate(evt);
                break;
        }
    });

    calendarDisplayWrapper.appendChild(navigationWrapper);
    calendarDisplayWrapper.appendChild(calendarTable);
    calendarWrapper.appendChild(dateDisplayWrapper);
    calendarWrapper.appendChild(calendarDisplayWrapper);
    buildCalendarBody();
}
