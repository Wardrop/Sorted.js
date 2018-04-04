var Sorted = function (table, opts) {
  opts = opts || {}
  opts.resizeHandleWidth = opts.resizeHandleWidth || 4
  var sorted = this;

  this.init = function () {
    if (table.sorted) table.sorted.unbindEventListeners();
    table.sorted = this
    table.classList.add('sorted-js')
    this.bindEventListeners()
  }

  this.bindEventListeners = function () {
    table.tHead.addEventListener("click", this.headerClickHandler)
    table.tHead.addEventListener("mousedown", this.resizeColumnHandler)
  }

  this.unbindEventListeners = function () {
    table.tHead.removeEventListener("click", this.headerClickHandler)
  }

  this.headerClickHandler = function (e) {
    var th = e.target;
    while (th && th.nodeName != 'TH') { th = th.parentElement }
    if (th && th.dataset.noSort == undefined) {
      // Ensure resize handle hasn't been clicked
      if ((e.screenX - th.getBoundingClientRect().left) < (th.offsetWidth - (opts.resizeHandleWidth / 2))) {
        var columnIndex = Array.prototype.indexOf.call(th.parentElement.cells, th)
        sorted.sort(columnIndex, th.dataset.sortState == 'sorted')
      }
    }
  }

  this.resizeColumnHandler = function (e) {
    var th = e.target;
    if (th && th.nodeName == 'TH' && th.dataset.resizable != undefined) {
      // Check if the resize handle has been grabbed.
      if ((e.screenX - th.getBoundingClientRect().left) >= (th.offsetWidth - (opts.resizeHandleWidth / 2))) {
        var dragStartPosition = e.clientX
        var columnStartingWidth = parseInt(window.getComputedStyle(th).width)

        function onMove (e) {
          var newWidth = columnStartingWidth + (e.clientX - dragStartPosition)
          th.style.width = newWidth + "px"
        }

        function onDragEnd () {
          document.removeEventListener("mousemove", onMove)
          document.removeEventListener("mouseup", onDragEnd)
        }

        document.addEventListener("mousemove", onMove)
        document.addEventListener("mouseup", onDragEnd)
      }
    }
  }

  this.sort = function (columnIndex, reverse) {
    table.dataset.sorted = true;
    for(i = 0; i < table.tBodies.length; i++) {
      var tbody = table.tBodies[i]
      var values = [];
      for(x = 0; x < tbody.rows.length; x++) {
        var value = new String(this.getCellValue(i, x, columnIndex)) // Create String object so custom properties work
        value._rowIndex = x
        values.push(value)
      }
      values.sort(this.getSortFunc(columnIndex))
      orderedRows = values.map( function (value) {
        return tbody.rows[value._rowIndex]
      })
      this.setSortState(columnIndex, reverse)
      if (reverse) orderedRows.reverse()
      for(x = 0; x < orderedRows.length; x++) {
        tbody.appendChild(orderedRows[x])
      }
    }
  }

  this.setSortState = function (columnIndex, reverse) {
    var headers = this.getColumnHeaders()
    for(i = 0; i < headers.length; i++) {
      delete headers[i].dataset.sortState
      if(i == columnIndex) headers[i].dataset.sortState = reverse ? 'rsorted' : 'sorted'
    }
  }

  this.getSortFunc = function (columnIndex) {
    var sortFunc = this.getColumnHeaders()[columnIndex].dataset.sortFunc
    if (sortFunc) {
      if (typeof this[sortFunc] != "function") {
        throw("Sorting function "+sortFunc+" is invalid.")
      }
    } else {
      // var values = this.getColumnValues(columnIndex)
      var value = this.getCellValue(0,0,columnIndex)
      Date.parse(value)
      if (/^\d{1,4}[\/\.-]\d{1,2}[\/\.-]\d{1,4}$/.test(value)) { // E.g. 2017-02-11, 4/1/2016, 12-01-2011
        sortFunc = "sortDate"
      } else if (/^[$£¥₣₤₧€₹₩₴₯₮₲₱₳₵₭₪₫]?[0-9,.\s]+(%|st|nd|rd|th)?$/.test(value)) {
        sortFunc = "sortNumeric"
      } else {
        sortFunc = "sortAlpha"
      }
    }
    this.getColumnHeaders()[columnIndex].dataset.sortFunc = sortFunc
    return this[sortFunc];
  }

  this.getColumnHeaders = function () {
    return table.tHead.rows[0].cells
  }

  this.getCellValue = function (tbodyIndex, rowIndex, columnIndex) {
    var cell = table.tBodies[tbodyIndex].rows[rowIndex].cells[columnIndex];
    return cell.dataset.sortValue || cell.innerText;
  }

  this.getColumnValues = function (columnIndex) {
    var values = []
    for(var i = 0; i < table.tBodies.length; i++) {
      var rowCount = table.tBodies[i].rows.length
      for(var x = 0; x < rowCount; x++) {
        values.push(this.getCellValue(i, x, columnIndex))
      }
    }
    return values;
  }

  this.toFloat = function (str) {
    return parseFloat(str.replace(/[^0-9.]/g, ''))
  }

  this.sortAlpha = function (a, b) {
    return a.localeCompare(b);
  }

  this.sortNumeric = function (a, b) {
    a = sorted.toFloat(a)
    b = sorted.toFloat(b)
    if (isNaN(a)) a = 0;
    if (isNaN(b)) b = 0;
    return a-b;
  }

  this.sortNatural = function (a, b) {
    if(isNaN(a) || isNaN(b)) {
      return sorted.sortAlpha(a,b);
    } else {
      return sorted.sortNumeric(a,b);
    }
  }

  this.sortDate = function (a, b) {
     a = new Date(a)
     b = new Date(b);
     return a - b;
  }

  this.init();
}
