let board=[];
let rows=8,columns=8;
var  minesCount=5,clickedTiles=0;
let flagEnabled=false , gameOver=false;
var minesLocation=[];

function setMines()// setting mines in tiles
{
  let minesLeft = minesCount;
  while (minesLeft > 0) 
  { 
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * columns);
      let id = r.toString() + "-" + c.toString();
      if (!minesLocation.includes(id)) 
      {
          minesLocation.push(id);
          minesLeft -= 1;
      }
  }
}

window.onload=startGame(); 
function startGame()// setting up the game 
{
 document.getElementById("minescount").innerHTML=minesCount;
 document.getElementById("flagbutton").addEventListener("click", setFlag);
 setMines();
 for(let i=0; i<rows; i++) // grid for the  game board 
 {
  let row=[];
  for(let j=0; j<columns; j++)
  {
   let tile=document.createElement("div");
   tile.id = i.toString() + "-" + j.toString();
   document.getElementById("board").append(tile);
   tile.addEventListener("click",clickTile); //adding event for  each tile
   row.push(tile);
  }
  board.push(row);  
 }
 console.log(board); //debugging purpose
}


function setFlag() // toggling over the flagbutton
{
  if (flagEnabled) 
  {
      flagEnabled = false;
      document.getElementById("flagbutton").style.backgroundColor = "lightgray";
  }
  else 
  {
      flagEnabled = true;
      document.getElementById("flagbutton").style.backgroundColor = "darkgray";
  }
}

function showMines() // showing mines when tile is clicked
{
  for(let i=0;i<rows;i++)
  {
    for(let j=0;j<columns;j++)
    {
      let tile=board[i][j];
      if(minesLocation.includes(tile.id))
      {
       tile.innerText="💣";
      }
    }
  }
}
function clickTile() // things that can happen when a tile is clicked
{
  if(gameOver || this.classList.contains("clickedTile"))
   return;
  let tileClicked = this;
  let coord=tileClicked.id.split("-") // "1-1" becomes ["1","1"]
  let r=parseInt(coord[0]);
  let c=parseInt(coord[1]);


  function tileBoundary(r,c) //checks if tile is within game board
  {
    return(r<0||r>=rows||c<0||c>=columns)
  } 


  if (!tileBoundary(r, c)) 
  {
    if (flagEnabled)  // to place flags on tile that is being clicked 
   {
    if (tileClicked.innerText == "") 
     tileClicked.innerText = "🚩";
    else if (tileClicked.innerText == "🚩")
     tileClicked.innerText = "";
    return;
   }


   if (minesLocation.includes(tileClicked.id)) // to check if tile being clicked  has mines 
   {
     gameOver = true;
     showMines();
     return;
   }
  checkMines(tileClicked,r,c); // to check how many mines are near on the tile being clicked (represented by numbers)
  }
}
  function checkMines(tileClicked,r,c)
  {
   if(tileClicked.classList.contains("clickedTile"))
    return;
   else
   tileClicked.classList.add("clickedTile");
   clickedTiles+=1;
   
   let minesFound=0;
   for(let i=r-1;i<=r+1;i++)
   {
    for(let j=c-1;j<=c+1;j++)
    {
      if(i==r && j==c)
       continue;
      if(minesLocation.includes(i.toString()+"-"+j.toString()))  
       minesFound++;
    }
   }
   if(minesFound>0)
   {
    board[r][c].innerText=minesFound;
    board[r][c].classList.add("x"+minesFound.toString());
   }
   else if(minesFound==0)
   {
    for (let i = r - 1; i <= r + 1; i++) 
    {
      for (let j = c - 1; j <= c + 1; j++) 
      {
        if (i === r && j === c)
         continue;
        if (i >= 0 && i < rows && j >= 0 && j < columns)
        {
          let tile = board[i][j];
          checkMines(tile,i,j); // recursively check neighboring tiles
        }
      }
    }
   }
   if (clickedTiles == rows * columns - minesCount) 
   {
    document.getElementById("minescount").innerText = "CLEARED";
    gameOver = true;
   }
  }