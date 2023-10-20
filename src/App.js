import React, { Fragment } from 'react';
import readXlsxFile from 'read-excel-file';
import { useState, useEffect, useRef } from 'react';
import './global.css';

function App() {
  const [header, setHeader] = useState(null)
  const [main, setMain] = useState(null)
  // const [dataAdded, setDataAdded] = useState(false)

  // localStorage.setItem("dataAdded", JSON.stringify(false))

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
    localStorage.setItem("rows", JSON.stringify(mainOfTable))
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

  function handleSorting(sort) {
    const currentRows = JSON.parse(localStorage.getItem("rows"))
    const newEmptyArray = []
    // reset sort as descending when add new data | also reset button rotation if changed when add new data
    // dataAdded == true ? sort = "descending" : sort = sort
    if(sort == "ascending") {
      for(var i=0; i<currentRows.length; i++) {
        var newArr = []
        currentRows[i].props.children[1].map(
          (cellData) => {
            newArr.push(<td key={cellData.key} id={cellData.props.id} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
              {cellData.props.children}
            </td>)
          }
        )
        newEmptyArray.unshift(
          <tr className="rows" key={currentRows[i].key} id={currentRows[i].props.id}> {newArr} </tr>
        )
      }
    } else if(sort == "descending") {
      for(var i=0; i<currentRows.length; i++) {
        var newArr = []
        currentRows[i].props.children[1].map(
          (cellData) => {
            newArr.push(<td key={cellData.key} id={cellData.props.id} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
              {cellData.props.children}
            </td>)
          }
        )
        newEmptyArray.push(
          <tr className="rows" key={currentRows[i].key} id={currentRows[i].props.id}> {newArr} </tr>
        )
      }
    } else if(sort == "lenL2H") {
      // .
    } else if(sort == "lenH2L") {
      // .
    } else if(sort == "wktL2H") {
      // .
    } else if(sort == "wktH2L") {
      // .
    } else if(sort == "statL2H") {
      // .
    } else if(sort == "statH2L") {
      // .
    }
    setMain(newEmptyArray)
  }

  function addData() {
    // reorder current array first for sorting

    // const tempArr = []
    // const rowKeys = []
    // main.map(
    //   (row) => {
    //     rowKeys.push(JSON.stringify(row.key))
    //   }
    // )
    // var min = Math.min(...rowKeys) // main[i].key
    // var max = Math.max(...rowKeys)
    // for(var max; max>=min; max--) {
    //   if(rowKeys.includes(max)) {
    //     tempArr.push(max)
    //   }
    // }
    // console.log(tempArr)

    // for(var i=0; i<main.length; i++) {
    //   var currentKey = JSON.parse(main[i].key)
    //   if(currentKey == i) {
    //     tempArr.push(main[i])
    //   }
    // }
    
    // main.map(
    //   (row) => {
    //     tempArr.push(row)
    //   }
    // )
    // const cellsArray = []
    // for(var x=0; x<4; x++) {
    //   if(x==0) {
    //     cellsArray.push(<td key={`${main.length+1}${x}`} id={`r${main.length+1}c${x}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
    //       {main.length+1}
    //     </td>)
    //   } else if(x==1) {
    //     cellsArray.push(<td key={`${main.length+1}${x}`} id={`r${main.length+1}c${x}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
    //       {document.getElementById("newLen").value}
    //     </td>)
    //   } else if(x==2) {
    //     cellsArray.push(<td key={`${main.length+1}${x}`} id={`r${main.length+1}c${x}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
    //       {/* empty slot */}
    //     </td>)
    //   } else if(x==3) {
    //     cellsArray.push(<td key={`${main.length+1}${x}`} id={`r${main.length+1}c${x}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
    //       {document.getElementById("status").value}
    //     </td>)
    //   }
    // }
    // tempArr.unshift(<tr className="rows" id={main.length+1} key={main.length+1}> {cellsArray} </tr>)
    // // setDataAdded(true)
    // setMain(tempArr)
    // localStorage.setItem("rows", JSON.stringify(tempArr))
  }

  return (
    <div className="App">
      <label>
        Load Excel File
        <input type="file" id="input_file" onChange={(e) => {handleTable(e.currentTarget)}}></input>
      </label>

      <button id="button4add" onClick={() => {
        document.getElementById("overlay").style.display = `block`
        document.getElementById("window").style.display = `flex`
      }}> + Add New Data </button>

      <div id="overlay" style={{display: "none"}} onClick={(e) => {
        e.currentTarget.style.display = `none`
        document.getElementById("window").style.display = `none`
      }}></div>
      <div id="window" className="window" style={{display: "none"}}>
        <div className="window__header">
          <h3 className="window__header--h3"> Baslik </h3>
          <p className="window__header--p"> Alt Tanimlama </p>
        </div>
        <div className="window__label">
          <p className="window__label--title"> Len Bilgisini Giriniz </p>
          <input type="text" id="newLen" className="window__label--input" />
        </div>
        <div className="window__label">
          <p className="window__label--title"> Status Seciniz </p>
          <select name="status" id="status" className="window__label--input">
            <option value="0"> 0 </option>
            <option value="1"> 1 </option>
            <option value="2"> 2 </option>
          </select>
        </div>
        <div className="window__buttons">
          <button id="winBtn_cancel" className="window__buttons--btn" onClick={() => {
            document.getElementById("overlay").style.display = `none`
            document.getElementById("window").style.display = `none`
          }}> Legv Et </button>
          <button id="winBtn_add" className="window__buttons--btn" onClick={() => {
            addData()
            document.getElementById("overlay").style.display = `none`
            document.getElementById("window").style.display = `none`
          }}> Elave Et </button>
        </div>
      </div>

      <table className="table" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
        {header}
        {main}
      </table>
    </div>
  );
}

export default App;