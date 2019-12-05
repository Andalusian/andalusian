import React, { useCallback } from 'react'
import {useDropzone} from 'react-dropzone'


function FileDropzone(props) {
  const onDrop = useCallback(acceptedFiles => {
  props.updateInfo('uploadedFiles', acceptedFiles)
  console.log(acceptedFiles)
// if(props.pageSelect === 'Docker'){
// for(let i =0; i < acceptedFiles.length; i++){

// }
// }
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
