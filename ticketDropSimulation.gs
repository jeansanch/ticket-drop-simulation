var ss = SpreadsheetApp;
var spreads = ss.getActiveSpreadsheet();
var active = spreads.getActiveSheet();
var ticketChance = active.getRange("H15").getValue();
var addChance = active.getRange("H27").getValue();
var startingDay = active.getRange("H13").getValue();
var dSkipped = active.getRange("H14").getValue();
var maxDay = active.getRange("H8").getValue();

function simulation() {
  var numbers = new Array(30).fill(0);
  var j;
  
  for(i = 0; i < 250; i++){
    j = simulate(startingDay);
    numbers[j] += 1;
  }
  
  var x = 34;
  var y = 6;
  var count = 0;
  var debug = numbers[j];
  
  //Clearing old results
  for(i = 0; i < 30; i++){
    active.getRange(x+i, y).setValue("");
    active.getRange(x+i, y+1).setValue("");
  }
  
  //Writing results
  for(i = 0; i < 30; i++){
    if(numbers[i] > 0){
      active.getRange(x+count, y).setValue(i);
      active.getRange(x+count, y+1).setValue(numbers[i]);
      count++;
    }
  }
}

function simulate(day){
  Logger.log("Inside Simulate with day: "+day);
  var total = 0;
  if(day % 5 != 0){
    day += (5 - day % 5)
  }
  while(day < maxDay){
    Logger.log("Inside Simulate with day: "+startingDay+"and maxDay: "+maxDay);
    //checking if got a portal
    if(Math.random()<(addChance/100+day/maxDay)){
      //checking if portal will lead to max day
      if(day+dSkipped <= maxDay){
        day += dSkipped;
        //portal skip ticket drop
        if(Math.random()<ticketChance)
          total++;
      }
      else{
        //last portal skip ticket drop
        if(Math.random() < (1 - (0.96 ** (maxDay-day)/5 - 1)))
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