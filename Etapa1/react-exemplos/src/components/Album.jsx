import React, { useState, useEffect } from "react";

import '../Album.css'

import Photo from "./Photo";

const Album = ({ albumId }) => {
    const [photos, setPhotos] = useState([]);

    const fetchPhotos = async (albumId) => {
        try {
        const url = 'https://jsonplaceholder.typicode.com/albums/1/photos';
          const response = await fetch(url); // Por padrão executa um request do tipo GET
          // console.log(response);
        if (response.status === 200) {
            const data = await response.json();
        console.log(data);
          // correção da imagem thumb
        const updatePhotos = data.map( (photo) => ({
            ...photo,
            thumbnailUrl: `https://picsum.photos/150?random=${photo.id}`
        }));
          // ...photo { id: 1, title: "rótulo", thumbnailUrl: "http:///",...}
          // { photo: { id: 1, title: "rotulo",... }}
            setPhotos(updatePhotos);
        }
    
    
        } catch (error) {
        consoloe.error('Erro ao buscar fotos', error);
        }
    
    }
    
    useEffect(() => {
        fetchPhotos(albumId);
    }, [albumId]);

    return (
            <div className="album-container">
                <h1 className="album-title">Album #{albumId}</h1>
                <div className="grid-container">
                { photos.length > 0 ? (
                    photos.map(photo => ( 
                        <div key={photo.id} className="album-item">
                            <Photo photo={photo} />
                        </div>
                    ))
                ) : (
                <p>Não há fotos</p>
                )}
                </div>
            </div>
    );
}
export default Album;