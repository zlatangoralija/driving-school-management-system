import React, { Fragment } from 'react'
import {useDropzone} from 'react-dropzone';



import { _inArray } from './Helpers.jsx';


//
// props...
// --------
// isSingle || isMultitple - one is required
// title    - (optional)
// text     - (optional)
// current  - current single file or array for multiple (required)
// actionUpload = function for upload file (required)
// actionDelete = function for delete file (optional)
// accept - ['images', 'documents', 'archives'] - as array ,(optional) if this property is missing, it will result in all files being accepted
// --------
const Upload = (props) => {


    const photoExtensions = ['.jpg','.jpeg','.png', '.svg']
    const [files, setFiles] = React.useState([]);


    //
    //
    const _ddAccept = () =>{
        let accept = {}
        if(props.accept){
            if(_inArray('images', props.accept)){
                accept = {...accept, 'image/*': photoExtensions}
            }
            if(_inArray('documents', props.accept)){
                accept = {...accept, 'text/*': ['.csv', '.text'], 'application/*': ['.doc', '.docx', '.pdf']}
            }
            if(_inArray('archives', props.accept)){
                accept = {...accept, 'application/*': ['.gz', '.zip', '.rar']}
            }
        }
        return accept
    }


    //
    //
    const {getRootProps, getInputProps} = useDropzone({
        accept: _ddAccept(),
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
            props.actionUpload(acceptedFiles)
        }
    });


    //
    //
    const _remove = (filename) => {
        setFiles([])
        props.actionDelete(filename)
    }


    //
    //
    const _uploadZone = () => {
        return(
            <div {...getRootProps({className: 'dropzone'})} className="dropZone">
                <input {...getInputProps()} />
                {props.title && <div className=''>{props.title}</div>}
                {props.text && <div className='text-xs'>{props.text}</div>}
            </div>
        )
    }


    //
    //
    const _getExtension = (file) => {
        const split = file.path.split('.')
        return '.'+split[split.length - 1].toLowerCase()
    }


    //
    //
    const _previewItem = () => {
        // console.log('FILES',files)
        if(props.isSingle){
            const ext = _getExtension(files[0])
            return(
                <div className="dropZoneSinglePreview">
                    <div>
                    {_inArray(ext, photoExtensions) ?
                        <img src={files[0].preview} />
                    :
                        <div>{ext}</div>
                    }
                    </div>
                    <span>{files[0].name}</span>
                    {props.actionDelete && <button type="button" onClick={()=>_remove(files[0])} className="dropZoneDeleteSingle">&times;</button>}
                </div>
            )
        }
    }


    //
    //
    React.useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
        const cleanup = async () => {
            await sleep(100)
            files.forEach((file) => URL.revokeObjectURL(file.preview))
        }
        cleanup()
    }, [files]);


    //
    //
    React.useEffect(() => {
        setFiles(props.current ? [props.current] : [])
    }, [props.current]);



    //
    //
    return(
        <div className='dropZoneWrapper'>
            {props.isSingle &&
                <>
                    {files.length>0 ?
                        _previewItem()
                    :
                        _uploadZone()
                    }
                </>
            }
            {props.isMultiple &&
                <div>

                </div>
            }
        </div>
    )
}

export default Upload
