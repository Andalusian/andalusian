import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'


function FileDropzone(props) {
  const onDrop = useCallback((acceptedFiles) => {
    let filesArray = []
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        filesArray.push(binaryStr)
      }
      reader.readAsText(file)
      filesArray.push(file)

    })
    props.updateInfo('uploadedFiles', filesArray)
    console.log('These are your uploaded files!', filesArray)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag and drop files here, or click to select.</p>
      }
    </div>
  )
}

export default FileDropzone
