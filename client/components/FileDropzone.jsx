import React, { useCallback } from 'react'
import {useDropzone} from 'react-dropzone'


function FileDropzone(props) {
  let fileInfo = []
  const onDrop = useCallback(acceptedFiles => {
  props.updateInfo('uploadedFiles', acceptedFiles)

  
// for(let i =0; i < acceptedFiles.length; i++){
//   const reader = new FileReader()
//   reader.onload = () => {
//     const binaryStr=reader.result
//     let fileText = reader.readAsText(binaryStr)
//     fileInfo.push(fileText)
//     console.log(fileText)
//   }
// }
// console.log(fileInfo)
}, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

export default FileDropzone