function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
  expr = expr.replace(/\s/g,"");
  let expr_in_brackets = false; // if expr in brackets
  let bracket_counter1 = 0;
  let bracket_counter2 = 0;
  for (const simb of expr) {
      if(/[(]/.test(simb)){
        bracket_counter1+=1;
        expr_in_brackets = true;
      }
      if(/[)]/.test(simb)){
        bracket_counter2+=1;
        expr_in_brackets = true;
    }
  }
  if( bracket_counter2 !== bracket_counter1 ){ throw Error("ExpressionError: Brackets must be paired");}
  //  first element of array [sss] would be first expression for solve
  //  it is the most deep brackets
  //  1 + 2 + ( 3 + ( 5 * 2 )) => fff = ['1 + 2 +','3 +','5 * 2 ))'] sss= ['5*2'] 
  //  function clear will delete empty elements that left from split(')') 
  let fff = expr.split("(");
  fff = clear(fff);
  let sss = fff[fff.length-1];
  sss = sss.split(")");
  sss = clear(sss);
  fff.pop();
  let to_be_replaced = ""+sss[0];  // <to_be_replaced> will be calculated and then replaced in initial <expr> with <result> of calculation
  let arr = []; // <arr> will contain numbers as strings and operators as 1 char string "+","-","*","/"
  let num = ''; // <num> temporary string that contain number to be pushed into <arr>
  for (let i = 0; i<to_be_replaced.length; i++) {
    if( /[-]/.test(to_be_replaced[0]) && i===0 ){ 
        // check if starts with negative number jump to next iteration
        num = '-'; 
        continue;
    }
    let operator = to_be_replaced[i];
    let operator_next = to_be_replaced[i+1];
    //
    if( /[0-9.]/.test(operator) ){  // test character if its a number
        num += String(operator);
    } else if( /[*/+-]/.test(operator) ){  // test character if its a operator
      if( /[-]/.test(operator_next) ){  // additional test if next char is '-' aka negative number
        if(/[-]/.test(operator)) { // this will cause '--' become '+'
          arr.push(num);
          arr.push("+");
          num = '';
        }else if(/[+]/.test(operator)){ // this will cause '+-' become '-'
          arr.push(num);
          arr.push("-");
          num = '';
        }else{ // this will cause save curr number and operator, and making next number negative
          arr.push(num);
          arr.push(operator);
          num = '-';  
        }
        i+=1; // this will cause skipping checking next operator, because will already dealt with it
      }else{ 
        //  basic for operator as separator for forming <arr>  
        //  by pushing number and operator after
        arr.push(num);
        arr.push(operator);
        num = '';
      }  
    } 
  }
  arr.push(num);  // to push last number after there is no operators left
  for ( let i = 0; i<arr.length; i++ ) {
    //  calculation for division and multipliers must go first 
    if ( /[*/]/.test(arr[i]) && arr[i].length === 1 ){
        if(arr[i]==="/" && Number.parseFloat(arr[i+1])===0){ throw new Error("TypeError: Division by zero.");}
        arr.splice(i-1, 3, operation(arr[i-1],arr[i],arr[i+1]));  
        //  would take  ['-10','*','10']  from <arr>=['-10','*','10',+'10'] and splicing it to be <arr> = ['-100',+'10']
        i=0; // for multiple operations in <arr>
    }
  }
  for ( let i = 0; i<arr.length; i++ ) {
    //  calculation for plus and minus
    if ( /[+-]/.test(arr[i]) && arr[i].length === 1 ){
        arr.splice(i-1, 3, operation(arr[i-1],arr[i],arr[i+1]));
        i=0; // for multiple operations in <arr>
    }
  }
  let result = arr[0];
  if( expr_in_brackets ){
    to_be_replaced = "("+to_be_replaced+")";
    new_expr = expr.replace(to_be_replaced,String(result));
    //  initial <new_expr> would get a calculation result instead of expression <to_be_replaced>
    //  "1 + 2 + (3 + 4)" = (brackets will calculates first) => "1 + 2 + 7" => "10"
  }else{
    new_expr = expr.replace(to_be_replaced,String(result));
    //  initial <new_expr> would get a calculation result instead of expression <to_be_replaced>
    //  "1 + 2 + 3 + 4" => "10"
  }
  let patt = /[()*/+-]/;  
  let expr_for_check = String(new_expr[0]) === "-" ? String(new_expr.substr(1)) : String(new_expr);// for test we dont need first negative number to break testing need in calculation
  if( patt.test(expr_for_check) ){ //  tests if result is just a number or we should continue calculation
    return expressionCalculator(new_expr);  
  }else{
    return result;
  }
    function operation(a,o,b){
        //console.log(a,o,b);
        a = Number.parseFloat(a);
        b = Number.parseFloat(b);
        if(o==="/" && b===0){ throw TypeError("Division by zero.");}
        if(o==="/") return (a/b);
        if(o==="*") return (a*b);
        if(o==="+") return a+b;
        if(o==="-") return a-b;
    }
    function clear(arr){
        for (let i=0; i<arr.length; i++) {
        if( arr[i].length===0 ){
            arr.splice(i,1);
            i-=1;
            } 
        }
        return arr;
    }
}

module.exports = {
    expressionCalculator
}