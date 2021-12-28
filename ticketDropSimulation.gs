var ss = SpreadsheetApp;
var spreads = ss.getActiveSpreadsheet();
var active = spreads.getActiveSheet();

var addChance = active.getRange("H27").getValue(); //Portal Chance Perk

//Small optimization
var values = active.getRange("H13:H15").getValues();
//starting day = H13 = values[0][0]
//days skipped = H14 = values[1][0]
//ticket chance = H15 = values[2][0]

var maxDay = active.getRange("H8").getValue();

function simulation() {
  var numbers = new Array(30).fill(0);
  var j;
  
  for(i = 0; i < 500; i++){
    j = simulate(values[0][0]);
    numbers[j] += 1;
  }
  //Start position of where the code will write into
  var row = 35;
  var column = 6; //F35
  
  var count = 0;
  
  //Clearing old results
  for(i = 0; i < 30; i++){
    active.getRange(row+i, column).setValue("");
    active.getRange(row+i, column+1).setValue("");
  }
  
  //Writing results
  for(i = 0; i < 30; i++){
    if(numbers[i] > 0){
      active.getRange(row+count, column).setValue(i);
      active.getRange(row+count, column+1).setValue(numbers[i]);
      count++;
    }
  }
}

function simulate(day){
  var total = 0;
  if(day % 5 != 0){
    day += (5 - day % 5)
  }
  while(day < maxDay){
    //checking if got a portal
    if(Math.random()<(addChance/100+day/maxDay)){
      //checking if portal will lead to max day
      if(day+values[1][0] <= maxDay){
        day += values[1][0];
        //portal skip ticket drop
        if(Math.random()<values[2][0])
          total++;
      }
      else{
        //last portal skip ticket drop
        if(Math.random() < (1 - (0.96 ** ((maxDay-day)/5 - 1))))
          total++;
        day = maxDay;
      }
    }
    else
      day += 5;
    
    //boss kill tickcet drop
    if(Math.random()<0.04)
        total++;
  }
  return total;
}
