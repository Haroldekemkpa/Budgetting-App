/////Budget controller

let budgetController = (function () {
  class Expense {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    }
  }

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  class Income {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
  }

  let calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  let data = {
    allItems: {
      exp: [],
      inc: [],
    },

    totals: {
      exp: [],
      inc: [],
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (type, des, val) {
      let newItem, ID;

      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on 'exp' or 'inc' type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      //Push new item to data structure
      data.allItems[type].push(newItem);

      //return the new element
      return newItem;
    },

    deleteItem: function (type, id) {
      let ids, index;

      ids = data.allItems[type].map(function (cur) {
        return cur.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      //1: Calculate budget and expense
      calculateTotal("exp");
      calculateTotal("inc");
      //2: Calculate the budget: income - expense
      data.budget = data.totals.inc - data.totals.exp;
      //3: Calculate percentage of income spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentage: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentage: function () {
      let allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    testing: function () {
      console.log(data);
    },
  };
})();

///////////////UI controller

let UIcontroller = (function () {
  let DOMstring = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeListContainer: ".income__list",
    expenseListContainer: ".expense__list",
    budgetLabel: ".budget__value",
    expenseLabel: ".budget__expenses--value",
    incomeLabel: ".budget__income--text",
    percentage: ".budget__expenses--percentage",
    container: ".container",
    expensePercLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  let formatNumber = function (num, type) {
    let numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");

    int = numSplit[0];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1];
    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  let nodeListForEach = function (list, callBack) {
    for (let i = 0; i < list.length; i++) {
      callBack(list[i], i);
    }
  };
  return {
    getDOMInputs: function () {
      return {
        type: document.querySelector(DOMstring.inputType).value,
        description: document.querySelector(DOMstring.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstring.inputValue).value),
      };
    },

    getListItem: function (obj, type) {
      let html, newHtml, element;

      // Create an html string
      if (type === "inc") {
        element = DOMstring.incomeListContainer;

        html = `<div class="item clearfix" id="inc-%id%">
                            <div class="item__description">%description%</div>
                                <div class="right clearfix">
                                    <div class="item__value">%value%</div>
                                        <div class="item__delete">
                                            <button class="item__delete--btn">
                                                <i class="ion-ios-close-outline"></i>
                                            </button>
                                        </div>
                                </div>
                        </div>`;
      } else if (type === "exp") {
        element = DOMstring.expenseListContainer;

        html = `<div class="item clearfix" id="exp-%id%">
                            <div class="item__description">%description%</div>
                            <div class="right clearfix">
                                <div class="item__value">%value%</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
      }

      //Replace string Item

      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      //display in the Ui

      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function (selectID) {
      let el = document.getElementById(selectID);

      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstring.inputDescription + ", " + DOMstring.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((curr, i, arr) => {
        curr.value = "";
      });

      fieldsArr[0].focus();
    },

    displayBudget: function (obj) {
      let type;

      obj.budget > 0 ? (type = "inc") : (type = "exp");

      document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(DOMstring.expenseLabel).textContent = formatNumber(
        obj.totalExp,
        "exp"
      );

      if (obj.percentage > 0) {
        document.querySelector(DOMstring.percentage).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstring.percentage).textContent = "---";
      }
    },

    displayPercentages: function (percentages) {
      let fields = document.querySelectorAll(DOMstring.expensePercLabel);

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    displayDate: function () {
      let currentDate, year, month, months;
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      currentDate = new Date();
      year = currentDate.getFullYear();
      month = currentDate.getMonth();

      document.querySelector(DOMstring.dateLabel).textContent =
        months[month] + " " + year;
    },

    changeType: function () {
      let fields = document.querySelectorAll(
        DOMstring.inputType +
          "," +
          DOMstring.inputDescription +
          "," +
          DOMstring.inputValue
      );

      nodeListForEach(fields, function (cur) {
        cur.classList.toggle("red-focus");
      });
      document.querySelector(DOMstring.inputBtn).classList.toggle("red");
    },

    getDOMstrings: function () {
      return DOMstring;
    },
  };
})();

/////////////// Controller
let controller = (function (budgetCtrl, UIctrl) {
  let setUpEventListeners = function () {
    let DOM = UIctrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UIctrl.changeType);
  };

  let updateBudget = function () {
    // 1: Calculate the budget
    budgetCtrl.calculateBudget();
    // 2: Return the budget
    let budget = budgetCtrl.getBudget();
    // 3: Display budget on the UI
    UIctrl.displayBudget(budget);
  };

  let updatePercentages = function () {
    // Calculate percentages
    budgetCtrl.calculatePercentage();
    // Read percentage from budget controler
    let percentages = budgetCtrl.getPercentage();
    // Update the UI with the new percentage
    UIctrl.displayPercentages(percentages);

    console.log(percentages);
  };

  let ctrlAddItem = function () {
    let input, newItem;
    // 1: get input data
    input = UIctrl.getDOMInputs();
    // console.log(input);

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2: Add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3: Add item to the UI
      UIctrl.getListItem(newItem, input.type);

      //clear input fields
      UIctrl.clearFields();

      // 4: Calulate and update budget
      updateBudget();
      // 5: Update Percentage
      updatePercentages();
    }
  };

  let ctrlDeleteItem = function (e) {
    let itemID, splitID, type, ID;

    itemID = e.target.parentNode.parentNode.parentNode.id;
    // console.log(itemID);

    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // Deletet item from Data structure
      budgetCtrl.deleteItem(type, ID);

      // Delete item from UI
      UIctrl.deleteListItem(itemID);
      // Update and show new budget
      updateBudget();
      //Update percentage
      updatePercentages();
    }
  };

  return {
    init: function () {
      setUpEventListeners();
      UIctrl.displayDate();
      UIctrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0,
      });
    },
  };
})(budgetController, UIcontroller);

controller.init();
