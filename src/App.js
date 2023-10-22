import React, { Fragment } from 'react';
import readXlsxFile from 'read-excel-file';
import Plot from 'react-plotly.js';
import { useState, useEffect, useRef } from 'react';
import './global.css';

function App() {
  const [headerData, setHeaderData] = useState(null)
  const [mainData, setMainData] = useState(null)
  const [sortedMainData, setSortedMainData] = useState(null)
  const [statCount, setStatCount] = useState(null)
  const [displayPie, setDisplayPie] = useState('none')
  const [displayBar, setDisplayBar] = useState('none')
  const [currentButton, setCurrentButton] = useState(null)

  useEffect(
    () => {
      if(JSON.parse(localStorage.getItem("rows")) != null) {localStorage.removeItem("rows")}
    }, []
  )

  async function handleData(file) {
    const inputFile = await readXlsxFile(file.files[0])
    // separate header row
    setHeaderData(inputFile[0])
    // remove header row and set main rows of table
    inputFile.shift()
    setMainData(inputFile)
    localStorage.setItem("rows", JSON.stringify(inputFile))
    var stat_0 = 0
    var stat_1 = 0
    var stat_2 = 0
    for(var i=0; i<inputFile.length; i++) {
      if(inputFile[i][3] == 0) {
        stat_0++
      } else if(inputFile[i][3] == 1) {
        stat_1++
      } else if(inputFile[i][3] == 2) {
        stat_2++
      }
    }
    setStatCount([stat_0, stat_1, stat_2])
  }

  async function handleSorting(sortType) {
    var sourCe = document.getElementById("input_file")
    const inputFile = await readXlsxFile(sourCe.files[0])
    if(JSON.parse(localStorage.getItem("rows")) == null) {
      var mainDATA = inputFile
    } else {
      var mainDATA = JSON.parse(localStorage.getItem("rows"))
    }
    // sorting options
    if(sortType == "descending") {
      // collecting ID with descending order
      var arr = []
      for(var i=0; i<mainDATA.length; i++) {
        arr.push(mainDATA[i][0])
      }
      // finding min and max ID values on current array
      var min = Math.min(...arr)
      var max = Math.max(...arr)
      var reorderedArr = []
      // final part of reordering sequence
      for(var j=0; j<mainDATA.length; j++) {
        for(var i=max; i>=min; i--) {
          if(mainDATA[j][0] == i) {
            reorderedArr.unshift(mainDATA[j])
          }
        }
      }
      setSortedMainData(reorderedArr)
    } else if(sortType == "ascending") {
      // collecting ID with descending order
      var arr = []
      for(var i=0; i<mainDATA.length; i++) {
        arr.push(mainDATA[i][0])
      }
      // finding min and max ID values on current array
      var min = Math.min(...arr)
      var max = Math.max(...arr)
      var reorderedArr = []
      // final part of reordering sequence
      for(var j=0; j<mainDATA.length; j++) {
        for(var i=max; i>=min; i--) {
          if(mainDATA[j][0] == i) {
            reorderedArr.push(mainDATA[j])
          }
        }
      }
      setSortedMainData(reorderedArr)
    } else if(sortType == "len_h2l") {
      var arr = []
      for(var i=0; i<mainDATA.length; i++) {
        arr.push(mainDATA[i][1])
      }
      var min = Math.min(...arr)
      var max = Math.max(...arr)
      arr.sort((max, min) => min - max)
      var reorderedArr = []
      arr.map(
        (sortedLenValue) => {
          for(var j=0; j<mainDATA.length; j++) {
            if(mainDATA[j][1] == sortedLenValue) {
              reorderedArr.push(mainDATA[j])
            }
          }
        }
      )
      setSortedMainData(reorderedArr)
    } else if(sortType == "len_l2h") {
      var arr = []
      for(var i=0; i<mainDATA.length; i++) {
        arr.push(mainDATA[i][1])
      }
      var min = Math.min(...arr)
      var max = Math.max(...arr)
      arr.sort((max, min) => max - min)
      var reorderedArr = []
      arr.map(
        (sortedLenValue) => {
          for(var j=0; j<mainDATA.length; j++) {
            if(mainDATA[j][1] == sortedLenValue) {
              reorderedArr.push(mainDATA[j])
            }
          }
        }
      )
      setSortedMainData(reorderedArr)
    } else if(sortType == "wkt_h2l") {
      // .
    } else if(sortType == "wkt_l2h") {
      // .
    } else if(sortType == "status_h2l") {
      var reorderedArr = []
      for(var i=0; i<mainDATA.length; i++) {
        if(mainDATA[i][3] == 2) {
          reorderedArr.push(mainDATA[i])
        }
      }
      for(var i=0; i<mainDATA.length; i++) {
        if(mainDATA[i][3] == 1) {
          reorderedArr.push(mainDATA[i])
        }
      }
      for(var i=0; i<mainDATA.length; i++) {
        if(mainDATA[i][3] == 0) {
          reorderedArr.push(mainDATA[i])
        }
      }
      setSortedMainData(reorderedArr)
    } else if(sortType == "status_l2h") {
      var reorderedArr = []
      for(var i=0; i<mainDATA.length; i++) {
        if(mainDATA[i][3] == 2) {
          reorderedArr.unshift(mainDATA[i])
        }
      }
      for(var i=0; i<mainDATA.length; i++) {
        if(mainDATA[i][3] == 1) {
          reorderedArr.unshift(mainDATA[i])
        }
      }
      for(var i=0; i<mainDATA.length; i++) {
        if(mainDATA[i][3] == 0) {
          reorderedArr.unshift(mainDATA[i])
        }
      }
      setSortedMainData(reorderedArr)
    }
  }

  function addNewData() {
    handleSorting("descending")
    var mainDATA = JSON.parse(localStorage.getItem("rows"))
    var arr = []
    for(var i=0; i<mainDATA.length; i++) {
      arr.push(mainDATA[i][0])
    }
    var new_id = Math.max(...arr)
    var new_len = document.getElementById("newLen").value
    var new_stat = document.getElementById("status").value
    var newRow = [new_id+1, new_len, '', new_stat]
    mainDATA.push(newRow)
    localStorage.setItem("rows", JSON.stringify(mainDATA))
    setSortedMainData(mainDATA)
    document.getElementById("sort_id").style.transform = `rotate(0deg)`
    document.getElementById("sort_len").style.transform = `rotate(0deg)`
    document.getElementById("sort_wkt").style.transform = `rotate(0deg)`
    document.getElementById("sort_stat").style.transform = `rotate(0deg)`
    var stat_0 = statCount[0]
    var stat_1 = statCount[1]
    var stat_2 = statCount[2]
    if(new_stat == 0) {
      stat_0++
    } else if(new_stat == 1) {
      stat_1++
    } else if(new_stat == 2) {
      stat_2++
    }
    setStatCount([stat_0, stat_1, stat_2])
  }

  function handleSearch(input, slot) {
    var mainDATA = JSON.parse(localStorage.getItem("rows"))
    var tempArray = []
    mainDATA.map(
      (elements) => {
        tempArray.push(elements[0])
      }
    )
    for(var k=1; k<tempArray.length; k++) {
      document.getElementById(tempArray[k]).style.display = `none`
    }
    var tempArray = []
    for(var i=0; i<mainDATA.length; i++) {
      if(slot == "id") {
        var currentElement = JSON.stringify(mainDATA[i][0])
        if(currentElement.includes(input)) {
          tempArray.push(mainDATA[i][0])
        }
      } else if(slot == "len") {
        var currentElement = JSON.stringify(mainDATA[i][1])
        if(currentElement.includes(input)) {
          tempArray.push(mainDATA[i][0])
        }
      } else if(slot == "wkt") {
        var currentElement = mainDATA[i][2]
        if(currentElement.includes(input)) {
          tempArray.push(mainDATA[i][0])
        }
      } else if(slot == "status") {
        var currentElement = JSON.stringify(mainDATA[i][3])
        if(currentElement.includes(input)) {
          tempArray.push(mainDATA[i][0])
        }
      }
    }
    for(var j=0; j<tempArray.length; j++) {
      document.getElementById(tempArray[j]).style.display = `table-row`
    }
  }

  function deleteRow(rowId) {
    var mainDATA = JSON.parse(localStorage.getItem("rows"))
    var arr = []
    var stat_0 = statCount[0]
    var stat_1 = statCount[1]
    var stat_2 = statCount[2]
    mainDATA.map(
      (reducedRowsIds) => {
        if(reducedRowsIds[0] != rowId) {
          arr.push(reducedRowsIds)
        }
        if(reducedRowsIds[0] == rowId) {
          if(reducedRowsIds[3] == 0) {
            stat_0--
          } else if(reducedRowsIds[3] == 1) {
            stat_1--
          } else if(reducedRowsIds[3] == 2) {
            stat_2--
          }
        }
      }
    )
    localStorage.setItem("rows", JSON.stringify(arr))
    setSortedMainData(arr)
    setStatCount([stat_0, stat_1, stat_2])
    handleSorting("descending")
  }

  function editRow(rowId) {
    var mainDATA = JSON.parse(localStorage.getItem("rows"))
    var arr = []
    var stat_0 = statCount[0]
    var stat_1 = statCount[1]
    var stat_2 = statCount[2]
    var editedLen = document.getElementById("editLen").value
    var editedWkt = document.getElementById("editWkt").value
    var editedStat = document.getElementById("editStatus").value
    var editedRow = [rowId, editedLen, editedWkt, editedStat]
    mainDATA.map(
      (currentRow) => {
        if(currentRow[0] != rowId) {
          arr.push(currentRow)
        }
        if(currentRow[0] == rowId) {
          arr.push(editedRow)
          if(currentRow[3] == 0) {
            stat_0--
          } else if(currentRow[3] == 1) {
            stat_1--
          } else if(currentRow[3] == 2) {
            stat_2--
          }
        }
      }
    )
    handleSorting("descending")
    localStorage.setItem("rows", JSON.stringify(arr))
    setSortedMainData(arr)
    if(editedStat == 0) {
      stat_0++
    } else if(editedStat == 1) {
      stat_1++
    } else if(editedStat == 2) {
      stat_2++
    }
    setStatCount([stat_0, stat_1, stat_2])
  }

  function showOnMap(data) {
    console.log(data)
  }

  return (
    <div className="App">
      {/* Load file button */}
      <label>
        Load Excel File
        <input type="file" id="input_file" onChange={(e) => {
          handleData(e.currentTarget)
          handleSorting("descending")
        }} />
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
            addNewData()
            document.getElementById("overlay").style.display = `none`
            document.getElementById("window").style.display = `none`
          }}> Elave Et </button>
        </div>
      </div>

      {/* Table */}
      <table className="table">
        {/* header sector */}
        {headerData != null && <tr className="rows" key={0} id={0}>
          <td className="cells">
            <div>
              {headerData[0]}
              <button id="sort_id" onClick={(e) => {
                if(e.currentTarget.style.transform != `rotate(180deg)`) {
                  e.currentTarget.style.transform = `rotate(180deg)`
                  handleSorting("ascending")
                } else {
                  e.currentTarget.style.transform = `rotate(0deg)`
                  handleSorting("descending")
                }
              }}> ▲ </button>
            </div>
            <div>
              <input type="search" id="search_id" placeholder="Ara.." onChange={
                (e) => {handleSearch(e.currentTarget.value, "id")}
              } />
            </div>
          </td>
          <td className="cells">
            <div>
              {headerData[1]}
              <button id="sort_len" onClick={(e) => {
                if(e.currentTarget.style.transform != `rotate(180deg)`) {
                  e.currentTarget.style.transform = `rotate(180deg)`
                  handleSorting("len_l2h")
                } else {
                  e.currentTarget.style.transform = `rotate(0deg)`
                  handleSorting("len_h2l")
                }
              }}> ▲ </button>
            </div>
            <div>
              <input type="search" id="search_len" placeholder="Ara.." onChange={
                (e) => {handleSearch(e.currentTarget.value, "len")}
              } />
            </div>
          </td>
          <td className="cells">
            <div>
              {headerData[2]}
              <button id="sort_wkt" onClick={(e) => {
                if(e.currentTarget.style.transform != `rotate(180deg)`) {
                  e.currentTarget.style.transform = `rotate(180deg)`
                  handleSorting("wkt_l2h")
                } else {
                  e.currentTarget.style.transform = `rotate(0deg)`
                  handleSorting("wkt_h2l")
                }
              }}> ▲ </button>
            </div>
            <div>
              <input type="search" id="search_wkt" placeholder="Ara.." onChange={
                (e) => {handleSearch(e.currentTarget.value, "wkt")}
              } />
            </div>
          </td>
          <td className="cells">
            <div>
              {headerData[3]}
              <button id="sort_stat" onClick={(e) => {
                if(e.currentTarget.style.transform != `rotate(180deg)`) {
                  e.currentTarget.style.transform = `rotate(180deg)`
                  handleSorting("status_l2h")
                } else {
                  e.currentTarget.style.transform = `rotate(0deg)`
                  handleSorting("status_h2l")
                }
              }}> ▲ </button>
            </div>
            <div>
              <input type="search" id="search_stat" placeholder="Ara.." onChange={
                (e) => {handleSearch(e.currentTarget.value, "status")}
              } />
            </div>
          </td>
        </tr>}
        {/* main rows */}
        {sortedMainData != null && sortedMainData.map(
          (row) => {
            return (<tr className="rows" key={row[0]} id={row[0]}>
              <td className="cells"> {row[0]} </td>
              <td className="cells"> {row[1]} </td>
              <td className="cells"> {row[2]} </td>
              <td className="cells"> {row[3]} </td>
              <td className="cells">
                <button className="btn btn_del" id={`btn_${row[0]}_del`} key={`btn_${row[0]}_del`} onClick={
                  (e) => {
                    document.getElementById("del_overlay").style.display = `block`
                    document.getElementById("del_window").style.display = `flex`
                    setCurrentButton(row[0])
                    // deleteRow(e.currentTarget.id) call this function with confirm button of various window
                  }
                }>
                  Sil {row[0]}
                </button>
                <button className="btn btn_edit" id={`btn_${row[0]}_edit`} key={`btn_${row[0]}_edit`} onClick={
                  (e) => {
                    document.getElementById("edit_overlay").style.display = `block`
                    document.getElementById("edit_window").style.display = `flex`
                    setCurrentButton(row[0])
                    // editRow(e.currentTarget.id) call this function with confirm button of various window
                  }
                }>
                  Redakte Et
                </button>
                <button className="btn btn_show" id={`btn_${row[0]}_show`} key={`btn_${row[0]}_show`} onClick={
                  (e) => {
                    showOnMap(e.currentTarget.id)
                  }
                }>
                  Xeritede Goster
                </button>
              </td>
            </tr>)
          }
        )}
      </table>

      {/* Delete button panel */}
      <div id="del_overlay" className="overlay" style={{display: "none"}} onClick={(e) => {
        e.currentTarget.style.display = `none`
        document.getElementById("del_window").style.display = `none`
      }}></div>
      <div id="del_window" className="window" style={{display: "none"}}>
        <p> Are you sure ? </p>
        <div>
          <button id="confirm" style={{backgroundColor: 'rgb(255,0,0)'}} onClick={() => {
            deleteRow(currentButton)
            document.getElementById("del_overlay").style.display = `none`
            document.getElementById("del_window").style.display = `none`
          }}> Confirm </button>
          <button id="no" style={{backgroundColor: 'rgb(128,128,128)'}} onClick={() => {
            document.getElementById("del_overlay").style.display = `none`
            document.getElementById("del_window").style.display = `none`
          }}> No </button>
        </div>
      </div>

      {/* Edit button panel */}
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
            document.getElementById("edit_overlay").style.display = `none`
            document.getElementById("edit_window").style.display = `none`
          }}> Legv Et </button>
          <button id="editBtn_save" className="window__buttons--btn" onClick={() => {
            editRow(currentButton)
            document.getElementById("edit_overlay").style.display = `none`
            document.getElementById("edit_window").style.display = `none`
          }}> Yadda Saxla </button>
        </div>
      </div>

      {/* Diagram buttons */}
      <div>
        <button onClick={() => {
          displayPie == 'block' ? setDisplayPie('none') : setDisplayPie('block')
          setDisplayBar('none')
        }}> Analiz 1 </button>
        <button onClick={() => {
          setDisplayPie('none')
          displayBar == 'block' ? setDisplayBar('none') : setDisplayBar('block')
        }}> Analiz 2 </button>
      </div>

      {/* Diagrams with ready script library */}
      <Plot style={{display: displayPie}} data={[
        {
          labels: [0, 1, 2], // exist status numbers
          values: statCount != null ? statCount : 0, // useState counts of each status
          type: 'pie'
        }
      ]} layout={
        {
          width: '100%', height: '700px', title: 'Untitled'
        }
      } />
      <Plot style={{display: displayBar}} data={[
        {
          x: [0, 1, 2], // exist status numbers
          y: statCount != null ? statCount : 0, // useState counts of each status
          type: 'bar',
          // mode: 'lines+markers',
          orientation: 'v',
          marker: {color: 'rgba(255,128,0,0.8)'},
        }
      ]} layout={
        {
          width: 640, height: 480, title: 'Untitled'
        }
      } />
    </div>
  );
}

export default App;