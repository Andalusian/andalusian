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
        <div className="dropzone" {...getRootProps()}>
            <span>
            <input {...getInputProps()} />
            <p>Drag or click to upload your function</p>
            </span>
            <span>
                <input {...getInputProps()} />
                <p>Drag or click to upload your key file</p>
            </span>
        </div>
    )
}

export default MyDropzone;
