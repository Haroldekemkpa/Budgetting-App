/////Budget controller

let budgetController = (function() {

    
})();


///////////////UI controller

let UIcontroller = (function() {
    let DOMstring ={
        inputType: '.add__type',
        inputDiscription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        
    };

    return {
        getDOMInputs: function() {
            return {
                type: document.querySelector(DOMstring.inputType).value,
                discription: document.querySelector(DOMstring.inputDiscription).value,
                value: document.querySelector(DOMstring.inputValue).value,
            }
        },

        getDOMstrings: function() {
            return DOMstring;
        }
    }

    
})();

/////////////// Controller
let controller = (function(budgetCtrl, UIctrl){

    let setUpEventListeners = function() {
        let DOM = UIctrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e){
            
            if(e.key === 'Enter') {
                ctrlAddItem();
            }
            
        })
    }
    

    let ctrlAddItem = function(){
        // 1: get input data
        let input = UIctrl.getDOMInputs();
        console.log(input);
        // 2: Add item to budget controller

        // 3: Add item to the UI

        // 4: Calculate the budget

        // 5: Display budget on the UI

       
    }
    return {
        init: function() {
            setUpEventListeners();
        }
    }

})(budgetController, UIcontroller);

controller.init();