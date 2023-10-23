import React, { useEffect, useRef, useState } from 'react'

const App = () => {

    const [baseURL] = useState("http://localhost:3001/gallery")

    const [imageURL, setImageURL] = useState("")

    const [gallery, setGallery] = useState([])

    /* DOM */
    let loaderRef = useRef()

    useEffect(() => {
        getGallery(baseURL);
    }, [])

    const handleSubmit = evento => {
        evento.preventDefault()
        if (imageURL !== "") {

            const info = {
                imgSrc: imageURL
            }

            const options = {
                method: 'POST',
                body: JSON.stringify(info),
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            addImageGallery(baseURL, options)
        }

    }

    const getGallery = (url, options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }) => {
        fetch(url, options)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setGallery(data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const addImageGallery = (url, options) => {
        fetch(url, options)
            .then((response) => {
                if (response.status === 201) {
                    getGallery(baseURL)
                    setImageURL("")
                }
            })
    }

    const deleteImageGallery = (url, options) => {
        fetch(url, options)
            .then((response) => {
                if (response.status === 200) {
                    getGallery(baseURL)
                }
            })
    }

    const loadImage = imgSrc => {
        console.log(imgSrc);
        // let loader = document.querySelector('#loader');
        // loader.src = imgSrc
        loaderRef.current.src = imgSrc;
    }

    // funcion para eliminar una imagen por id 
    const deleteImage = id => {
        //console.log(id);
        const url2 = `${baseURL}/${id}`;
        //console.log(url2);
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        deleteImageGallery(url2, options);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>

                        <div className="form-group mb-3">
                            <label htmlFor="imageURL" className="form-label">Image URL</label>
                            <input
                                type="text"
                                id="imageURL"
                                name="imageURL"
                                className="form-control"
                                placeholder='URL de la imagen a agregar'
                                value={imageURL}
                                onChange={(e) => setImageURL(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary btn-sm w-100">Guardar</button>

                    </form>
                </div>
                <div className="col-md-6">
                    {/* Gallery */}
                    <div className="viewer">
                        <div className="list-viewer">
                            {
                                gallery.length > 0 &&
                                gallery.map((image, index) => {
                                    return (
                                        <div className="position-relative" key={index}>
                                            <span className='position-absolute top-0 end-0 delete' onClick={() => deleteImage(image.id)}>
                                                x
                                            </span>
                                            <img src={image.imgSrc} onClick={() => loadImage(image.imgSrc)} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="preview">
                            <img id="loader" ref={loaderRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App