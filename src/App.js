import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Input, FormGroup, Typography, Button, Box } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInput = useRef();
  const openFileBrowser = () => {
    fileInput.current.click();
  };

  const fileHandler = (event) => {
    if (event.target.files.length) {
      let fileObj = event.target.files[0];
      let fileName = fileObj.name;

      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (fileName.slice(fileName.lastIndexOf(".") + 1) === "xlsx") {
        setUploadedFileName(fileName);
        setIsFormInvalid(false);
        // console.log(fileObj);
        renderFile(fileObj);
      } else {
        setUploadedFileName("");
        setIsFormInvalid(true);
      }
    }
  };

  const renderFile = (fileObj) => {
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log("err");
      } else {
        console.log("resp");
        console.log(resp);
        // console.log()
        // this.setState({
        //   dataLoaded: true,
        //   cols: resp.cols,
        //   rows: resp.rows
        // });
      }
    });
  };

  // ["Date(年/月/日)", "時", "分", "CGMGlucoseValue"],
  const arr = [
    [20230323, 15, 31, 110],
    [20230323, 17, 32, 96],
    [20230323, 21, 32, 104],
    [20230323, 23, 32, 108],
  ];

  const labelArr =  new Array(1440).fill(0).map((_,i)=>i)
  let tmpArr=[];

  for (let idx = 0; idx < arr.length; idx++){
    // const idx = x[1]*60+x[2];
    // dataArr[idx] = x[3];
     tmpArr.push({x: arr[idx][1]*60 + arr[idx][2],y: arr[idx][3]})
  }
  console.log(tmpArr)


  const opts= {
    scales: {
      x: {
        ticks: {
          // For a category axis, the val is the index so the lookup via getLabelForValue is needed
          callback: function (val, index) {
            // Hide every 2nd tick label
            return index % 120 === 0 ? this.getLabelForValue(val)/60 : "";
          },
          color: "red"
        }
      }
    }
  }

  const data = {
    labels: labelArr,
    datasets: [
      {
        label: "Dataset 1",
        data: tmpArr,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      // {
      //   label: "Dataset 2",
      //   data: timeLabel.map(() => -1000),
      //   borderColor: "rgb(53, 162, 235)",
      //   backgroundColor: "rgba(53, 162, 235, 0.5)",
      // },
    ],
  };

  return (
    <div>
      <div></div>
      <Box>
        <form>
          <FormGroup row>
            <Typography for="exampleFile" xs={6} sm={4} lg={2} size="lg">
              Upload
            </Typography>
            <Box xs={4} sm={8} lg={10}>
              <Box>
                <Box addonType="prepend">
                  <Button color="info" onClick={openFileBrowser}>
                    <i className="cui-file"></i> Browse&hellip;
                  </Button>
                  <input
                    type="file"
                    hidden
                    onChange={fileHandler}
                    ref={fileInput}
                    onClick={(event) => {
                      event.target.value = null;
                    }}
                    style={{ padding: "10px" }}
                  />
                </Box>
                <Input
                  type="text"
                  className="form-control"
                  value={uploadedFileName}
                  readOnly
                  invalid={isFormInvalid}
                />
              </Box>
            </Box>
          </FormGroup>
        </form>
      </Box>
      <Box style={{width:"50%"}}>
      <Line data={data} options={opts} />
      </Box>
    </div>
  );
}

export default App;