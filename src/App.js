// npm install read-excel-file --save

import React, { Fragment } from 'react';
import readXlsxFile from 'read-excel-file';
import { useState, useEffect, useRef } from 'react';
import './global.css';

function App() {
  const [header, setHeader] = useState(null)
  const [main, setMain] = useState(null)

  async function handleTable(file) {
    const inputFile = await readXlsxFile(file.files[0])
    const headElements = []
    const mainElements = []
    for(var row=inputFile.length-1; row>=0; row--) {
      var cellsArr = []
      if(row==inputFile.length-1) {
        for(var col=0; col<inputFile[row].length; col++) {
          cellsArr.push(<td key={`${0}${col}`} id={`r${0}c${col}`} className="headers" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
            <div className="headers__group">
              <span className="headers__group--content"> {inputFile[0][col]} </span>
              <button className="headers__group--button" onClick={(e) => {
                if(e.currentTarget.style.transform != `rotate(180deg)`) {
                  e.currentTarget.style.transform = `rotate(180deg)`
                  handleSorting("ascending", inputFile.length)
                } else {
                  e.currentTarget.style.transform = `rotate(0deg)`
                  handleSorting("descending", inputFile.length)
                }
              }}> ▲ </button>
            </div>
            <div className="headers__group">
              <input type="search" id={`search_col${col}`} className="headers__group--search" placeholder="Ara.." onChange={(e) => {handleSearch(e, inputFile.length)}} />
            </div>
          </td>)
        }
        headElements.push(cellsArr)
      } else {
        for(var col=0; col<inputFile[row].length; col++) {
          cellsArr.push(<td key={`${row+1}${col}`} id={`r${row+1}c${col}`} className="cells" 
          style={{border: "1px solid #000000", borderCollapse: "collapse"}}> {inputFile[row+1][col]} </td>)
        }
        mainElements.push(cellsArr)
      }
    }
    const headersOfTable = []
    const mainOfTable = []
    headElements.map(
      (rows, index) => {
        headersOfTable.push(<tr className="rows" id={0} key={0}> {rows} </tr>)
      }
    )
    mainElements.map(
      (rows, index) => {
        mainOfTable.push(<tr className="rows" id={mainElements.length-index} key={mainElements.length-index}> {rows} </tr>)
      }
    )
    setHeader(headersOfTable)
    setMain(mainOfTable)
  }

  function handleSearch(element, length) {
    const currentColumn = element.currentTarget.id[10]
    const inputSearch = element.currentTarget.value
    for(var i=length-1; i>0; i--) {
      if(document.getElementById(`r${i}c${currentColumn}`).textContent.includes(inputSearch)) {
        document.getElementById(i).style.display = `table-row`
      } else {
        document.getElementById(i).style.display = `none`
      }
    }
  }

  async function handleSorting(type, length) {
    const inputElement = document.getElementById("input_file")
    const inputFile = await readXlsxFile(inputElement.files[0])
    const newEmptyArray = []
    if(type == "ascending") {
      for(var i=1; i<length; i++) {
        var cellsArray = []
        for(var j=0; j<inputFile[0].length; j++) {
          cellsArray.push(<td key={`${i}${j}`} id={`r${i}c${j}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}> {inputFile[i][j]} </td>)
        }
        newEmptyArray.push(<tr className="rows" id={i} key={i}> {cellsArray} </tr>)
      }
    } else if(type == "descending") {
      for(var i=length-1; i>0; i--) {
        var cellsArray = []
        for(var j=0; j<inputFile[0].length; j++) {
          cellsArray.push(<td key={`${i}${j}`} id={`r${i}c${j}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}> {inputFile[i][j]} </td>)
        }
        newEmptyArray.push(<tr className="rows" id={i} key={i}> {cellsArray} </tr>)
      }
    }
    setMain(newEmptyArray)
  }

  return (
    <div className="App">
      <input type="file" id="input_file" onChange={(e) => {handleTable(e.currentTarget)}}></input>
      <table className="table" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
        {header}
        {main}
      </table>
    </div>
  );
}

export default App;