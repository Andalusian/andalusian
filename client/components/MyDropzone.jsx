import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

function MyDropzone() {
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                console.log(binaryStr)

            }
            reader.readAsText(file)
        })

    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})

    return (
        <div id="dropz" {...getRootProps()}>
            <div id="drop1" className="dropzone">
            <input {...getInputProps()} />
            <p>Upload your Function</p>
            </div>
            <div className="dropzone" >
                <input {...getInputProps()} />
                <p>Upload your Key File</p>
            </div>
        </div>
    )
}

export default MyDropzone;
