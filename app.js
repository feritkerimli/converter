//variables for valute select
let card1= document.querySelector(".card1")
let card1_valute_elem_list = card1.querySelectorAll(".valute-elem");
let card2=document.querySelector(".card2")
let card2_valute_elem_list = card2.querySelectorAll(".valute-elem");
let checker_for_input=1;
//api key
let api_key = 'ee3b61ee08ada2617e40d4c9';
// valutes
let valute_info1 = card1.querySelector(".valute-info");
let valute_info2 = card2.querySelector(".valute-info");
let valute_from=card1.querySelector('.selected').innerHTML;
let valute_to=card2.querySelector('.selected').innerHTML;
//input section
let input1=card1.querySelector("input");
let input2 =card2.querySelector("input");
let not_num_warning1 = card1.querySelector(".not-num-warning");
let not_num_warning2= card2.querySelector('.not-num-warning')
let amount1=input1.value;
let amount2;
let wifi=document.querySelector(".wifi")
//select valutes
function select_valutes(){
    if(valute_from==valute_to){
        valute_info1.innerHTML='1 '+ valute_from+' = '+ '1 '+ valute_to ;
        valute_info2.innerHTML='1 '+ valute_to+' = ' +'1 '+ valute_from ;
    }else{
        fetch(`https://v6.exchangerate-api.com/v6/${api_key}/pair/${valute_from}/${valute_to}/1`)
        .then(response => response.json())
        .then(data => {
            valute_info1.innerHTML='1 '+ valute_from+' = '+ data.conversion_result.toFixed(5) +' '+ valute_to ;
            wifi.style.display='none'
        })
        .catch(err => {
            if (!navigator.onLine) wifi.style.display='block';
            else wifi.style.display='none';
        })
    
        fetch(`https://v6.exchangerate-api.com/v6/${api_key}/pair/${valute_to}/${valute_from}/1`)
        .then(response => response.json())
        .then(data => {
            valute_info2.innerHTML='1 '+ valute_to+' = '+ data.conversion_result.toFixed(5) +' '+ valute_from ; 
            wifi.style.display='none'
        })
        .catch(err => {
            if (!navigator.onLine) wifi.style.display='block';
            else wifi.style.display='none';
        })
    }
}
//modifications for inputs
function input_modification(input, warningElement){
    // cleaning and formatting
    input.value = input.value.replaceAll(",", ".");
    input.value = input.value.replaceAll(/\s/g, "");
    let parts = input.value.split(".");
    if(parts.length > 2)input.value = parts[0] + "." + parts.slice(1).join("");
    if(parts[1] && parts[1].length > 5){
        parts[1] = parts[1].slice(0,5);
        input.value = parts[0] + "." + parts[1];
    }
    if(input.value[0]==".")input.value="0."+input.value.slice(1)
    //warning
    if(isNaN(input.value)) {
        input.value = input.value.replaceAll(/[^0-9.,]/g,'');
        warningElement.style.display = "block";
    } else warningElement.style.display = "none";
}
//output modification for cards
function output_modification(input, amount, valute_from, valute_to){
    if(amount == "" || amount==undefined) input.value = "";
    else if(amount == '0' || amount == '0.')input.value = 0;
    else {
        if(valute_from == valute_to) input.value = Number(amount);
        else {
            fetch(`https://v6.exchangerate-api.com/v6/${api_key}/pair/${valute_from}/${valute_to}/${amount}`)
            .then(res => res.json())
            .then((data) => {
                let output_parts = String(data.conversion_result).split(".");
                if(output_parts[1] && output_parts[1].length > 5) {
                    output_parts[1] = output_parts[1].slice(0, 5);
                    input.value = output_parts[0] + "." + output_parts[1];
                }
                else input.value = data.conversion_result;
                wifi.style.display='none'
            })
            .catch(err => {
                if (!navigator.onLine) wifi.style.display='block';
                else wifi.style.display='none';
            })
        }
    }
}
//waiting method for functions
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

select_valutes();
input_modification(input1,not_num_warning1);
output_modification(input2,amount1,valute_from,valute_to)
//valute select 
card1_valute_elem_list.forEach((valute_elem)=>{
    valute_elem.addEventListener("click",()=>{
        let old_selected=card1.querySelector(".selected");
        old_selected.classList.toggle("selected");
        valute_elem.classList.toggle("selected")
        valute_from=valute_elem.innerHTML;
        select_valutes();
        //convert
        if(checker_for_input==1) output_modification(input2,amount1,valute_from,valute_to);
        else if(checker_for_input==2) output_modification(input1,amount2,valute_to,valute_from);
    })
    
})
card2_valute_elem_list.forEach((valute_elem)=>{
    valute_elem.addEventListener("click",()=>{
        let old_selected=card2.querySelector(".selected");
        old_selected.classList.toggle("selected");
        valute_elem.classList.toggle("selected")
        valute_to=valute_elem.innerHTML;
        select_valutes();
        // // convert
        if(checker_for_input==1)output_modification(input2,amount1,valute_from,valute_to);
        else if(checker_for_input==2) output_modification(input1,amount2,valute_to,valute_from);
    })
})
//first card's input
input1.addEventListener("input", debounce(() => {
    input_modification(input1, not_num_warning1);
    amount1 = input1.value;
    output_modification(input2, amount1, valute_from, valute_to);
    checker_for_input = 1;
    not_num_warning2.style.display = "none";
}, 500));
//second card's input
input2.addEventListener("input", debounce(() => {
    input_modification(input2, not_num_warning2);
    amount2 = input2.value;
    output_modification(input1, amount2, valute_to, valute_from);
    checker_for_input = 2;
    not_num_warning1.style.display = "none";
}, 500));

//check for wifi
window.addEventListener('offline', () => {
    wifi.style.display = 'block';
});

window.addEventListener('online', () => {
    wifi.style.display = 'none';
});