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
              <button className="headers__group--button" id={`sort_${0}${col}`} onClick={(e) => {
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
        for(var col=0; col<inputFile[row].length+1; col++) {
          cellsArr.push(<td key={`${row+1}${col}`} id={`r${row+1}c${col}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
            {
              col != 4 ? inputFile[row+1][col] : <>
                <button className="btn btn_del" id={`btn_${row+1}_del`} key={`btn_${row+1}_del`} onClick={(e) => {deleteRow(e.currentTarget.id)}}> Sil {row+1} </button>
                <button className="btn btn_edit" id={`btn_${row+1}_edit`} key={`btn_${row+1}_edit`} onClick={(e) => {editRow(e.currentTarget.id)}}> Redakte Et </button>
                <button className="btn btn_show" id={`btn_${row+1}_show`} key={`btn_${row+1}_show`} onClick={(e) => {showOnMap(e.currentTarget.id)}}> Xeritede Goster </button>
              </>
            }
          </td>)
        }
        mainElements.push(cellsArr)
      }
    }
    const headersOfTable = []
    const mainOfTable = []
    headElements.map(
      (rows, index) => {
        headersOfTable.push(<tr className="rows" id={0} key={0}>
          {rows}
        </tr>)
      }
    )
    mainElements.map(
      (rows, index) => {
        mainOfTable.push(<tr className="rows" id={mainElements.length-index} key={mainElements.length-index}>
          {rows}
        </tr>)
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
    if(sort == "ascending") {
      for(var i=0; i<currentRows.length; i++) {
        var newArr = []
        for(var j=0; j<4+1; j++) {
          if(currentRows[i].props.children[4] == undefined) {
            var anotherCells = currentRows[i].props.children[1][j].props.children
          } else {
            var anotherCells = currentRows[i].props.children[j].props.children
          }
          const buttonsCell = <>
            <button className="btn btn_del" id={`btn_${currentRows.length-i}_del`} key={`btn_${currentRows.length-i}_del`} onClick={(e) => {deleteRow(e.currentTarget.id)}}> Sil {currentRows.length-i} </button>
            <button className="btn btn_edit" id={`btn_${currentRows.length-i}_edit`} key={`btn_${currentRows.length-i}_edit`} onClick={(e) => {editRow(e.currentTarget.id)}}> Redakte Et </button>
            <button className="btn btn_show" id={`btn_${currentRows.length-i}_show`} key={`btn_${currentRows.length-i}_show`} onClick={(e) => {showOnMap(e.currentTarget.id)}}> Xeritede Goster </button>
          </>
          newArr.push(<td key={`${i+1}${j}`} id={`r${i+1}c${j}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
            {j != 4 ? anotherCells : buttonsCell}
          </td>)
        }
        newEmptyArray.unshift(
          <tr className="rows" key={currentRows[i].key} id={currentRows[i].props.id}> {newArr} </tr>
        )
      }
    } else if(sort == "descending") {
      for(var i=0; i<currentRows.length; i++) {
        var newArr = []
        for(var j=0; j<4+1; j++) {
          if(currentRows[i].props.children[4] == undefined) {
            var anotherCells = currentRows[i].props.children[1][j].props.children
          } else {
            var anotherCells = currentRows[i].props.children[j].props.children
          }
          const buttonsCell = <>
            <button className="btn btn_del" id={`btn_${currentRows.length-i}_del`} key={`btn_${currentRows.length-i}_del`} onClick={(e) => {deleteRow(e.currentTarget.id)}}> Sil {currentRows.length-i} </button>
            <button className="btn btn_edit" id={`btn_${currentRows.length-i}_edit`} key={`btn_${currentRows.length-i}_edit`} onClick={(e) => {editRow(e.currentTarget.id)}}> Redakte Et </button>
            <button className="btn btn_show" id={`btn_${currentRows.length-i}_show`} key={`btn_${currentRows.length-i}_show`} onClick={(e) => {showOnMap(e.currentTarget.id)}}> Xeritede Goster </button>
          </>
          newArr.push(<td key={`${i+1}${j}`} id={`r${i+1}c${j}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
            {j != 4 ? anotherCells : buttonsCell}
          </td>)
        }
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
    const tempArr = []
    var min = 1
    var max = main.length
    for(var max; max>=min; max--) {
      for(var i=0; i<main.length; i++) {
        if(main[i].key == max) {
          tempArr.push(main[i])
        }
      }
    }
    document.getElementById(`sort_${0}${0}`).style.transform = `rotate(0deg)`
    document.getElementById(`sort_${0}${1}`).style.transform = `rotate(0deg)`
    document.getElementById(`sort_${0}${2}`).style.transform = `rotate(0deg)`
    document.getElementById(`sort_${0}${3}`).style.transform = `rotate(0deg)`
    const cellsArray = []
    for(var x=0; x<4+1; x++) {
      if(x==0) {
        cellsArray.push(<td key={`${main.length+1}${x}`} id={`r${main.length+1}c${x}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
          {main.length+1}
        </td>)
      } else if(x==1) {
        cellsArray.push(<td key={`${main.length+1}${x}`} id={`r${main.length+1}c${x}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
          {document.getElementById("newLen").value}
        </td>)
      } else if(x==2) {
        cellsArray.push(<td key={`${main.length+1}${x}`} id={`r${main.length+1}c${x}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
          {/* empty slot */}
        </td>)
      } else if(x==3) {
        cellsArray.push(<td key={`${main.length+1}${x}`} id={`r${main.length+1}c${x}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
          {document.getElementById("status").value}
        </td>)
      } else if(x==4) {
        cellsArray.push(<td key={`${main.length+1}${x}`} id={`r${main.length+1}c${x}`} className="cells" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
          <>
            <button className="btn btn_del" id={`btn_${main.length+1}_del`} key={`btn_${main.length+1}_del`} onClick={(e) => {deleteRow(e.currentTarget.id)}}> Sil {main.length+1} </button>
            <button className="btn btn_edit" id={`btn_${main.length+1}_edit`} key={`btn_${main.length+1}_edit`} onClick={(e) => {editRow(e.currentTarget.id)}}> Redakte Et </button>
            <button className="btn btn_show" id={`btn_${main.length+1}_show`} key={`btn_${main.length+1}_show`} onClick={(e) => {showOnMap(e.currentTarget.id)}}> Xeritede Goster </button>
          </>
        </td>)
      }
    }
    tempArr.unshift(<tr className="rows" id={main.length+1} key={main.length+1}> {cellsArray} </tr>)
    setMain(tempArr)
    localStorage.setItem("rows", JSON.stringify(tempArr))
  }

  function deleteRow(id) {
    document.getElementById("del_overlay").style.display = `block`
    document.getElementById("del_window").style.display = `flex`
    // console.log("delete row ID " + id)
    const currentID = JSON.parse(id.split("btn_")[1].split("_del")[0])
    // console.log(typeof currentID)
    JSON.parse(localStorage.getItem("rows")).map(
      (element) => {
        if(element.props.id == currentID) {
          console.log(element)
        }
      }
    )
  }

  function editRow(id) {
    document.getElementById("edit_overlay").style.display = `block`
    document.getElementById("edit_window").style.display = `flex`
    // console.log("edit row No " + id)
    const currentID = JSON.parse(id.split("btn_")[1].split("_edit")[0])
    // console.log(typeof currentID)
    JSON.parse(localStorage.getItem("rows")).map(
      (element) => {
        if(element.props.id == currentID) {
          console.log(element)
        }
      }
    )
  }

  function showOnMap(id) {
    // console.log("show on the map data of row " + id)
    const currentID = JSON.parse(id.split("btn_")[1].split("_show")[0])
    // console.log(typeof currentID)
    JSON.parse(localStorage.getItem("rows")).map(
      (element) => {
        if(element.props.id == currentID) {
          console.log(element)
        }
      }
    )
  }

  return (
    <div className="App">
      {/* Load file button */}
      <label>
        Load Excel File
        <input type="file" id="input_file" onChange={(e) => {handleTable(e.currentTarget)}}></input>
      </label>

      {/* Add new data button */}
      <button id="button4add" onClick={() => {
        document.getElementById("overlay").style.display = `block`
        document.getElementById("window").style.display = `flex`
      }}> + Add New Data </button>

      {/* Add new data window */}
      <div id="overlay" className="overlay" style={{display: "none"}} onClick={(e) => {
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

      {/* Table */}
      <table className="table" style={{border: "1px solid #000000", borderCollapse: "collapse"}}>
        {header}
        {main}
      </table>

      {/* Are you sure ? window for delete operation */}
      <div id="del_overlay" className="overlay" style={{display: "none"}} onClick={(e) => {
        e.currentTarget.style.display = `none`
        document.getElementById("del_window").style.display = `none`
      }}></div>
      <div id="del_window" className="window" style={{display: "none"}}>
        <p> Are you sure ? </p>
        <div>
          <button> Yes </button>
          <button> No </button>
        </div>
      </div>

      {/* Copy of add data window but for editing */}
      <div id="edit_overlay" className="overlay" style={{display: "none"}} onClick={(e) => {
        e.currentTarget.style.display = `none`
        document.getElementById("edit_window").style.display = `none`
      }}></div>
      <div id="edit_window" className="window" style={{display: "none"}}>
        <div className="window__header">
          <h3 className="window__header--h3"> Baslik </h3>
          <p className="window__header--p"> Alt Tanimlama </p>
        </div>
        <div className="window__label">
          <p className="window__label--title"> Len Bilgisini Giriniz </p>
          <input type="text" id="editLen" className="window__label--input" />
        </div>
        <div className="window__label">
          <p className="window__label--title"> Wkt Bilgisini Giriniz </p>
          <input type="text" id="editWkt" className="window__label--input" />
        </div>
        <div className="window__label">
          <p className="window__label--title"> Status Seciniz </p>
          <select name="status" id="editStatus" className="window__label--input">
            <option value="0"> 0 </option>
            <option value="1"> 1 </option>
            <option value="2"> 2 </option>
          </select>
        </div>
        <div className="window__buttons">
          <button id="editBtn_discard" className="window__buttons--btn" onClick={() => {
            // document.getElementById("overlay").style.display = `none`
            // document.getElementById("window").style.display = `none`
          }}> Legv Et </button>
          <button id="editBtn_save" className="window__buttons--btn" onClick={() => {
            // addData()
            // document.getElementById("overlay").style.display = `none`
            // document.getElementById("window").style.display = `none`
          }}> Yadda Saxla </button>
        </div>
      </div>
    </div>
  );
}

export default App;