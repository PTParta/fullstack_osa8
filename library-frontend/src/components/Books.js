import React, { useState } from 'react'

const Books = (props) => {

  const [genre, setGenre] = useState('all genres')

  if (!props.show) {
    return null
  }

  console.log('genre', genre)

  let books = []
  if (genre === 'all genres') {
    books = props.books.filter(book => book.genres)
  } else {
    books = props.books.filter(book => book.genres.includes(genre))
  }

  let genres = []

  props.books.forEach(book => {
    genres = genres.concat(book.genres)
  })
  //console.log('genres', genres)

  let uniqueGenres = ['all genres']
  genres.forEach(genre => {
    if (!uniqueGenres.includes(genre)) {
      uniqueGenres.push(genre)
    }
  })
  //console.log(uniqueGenres)
  //const uniqueGenres = genres.filter(genre => genre.contains())

  const handleGenre = (genreName) => {
    setGenre(genreName)
  }


  return (
    <div>
      <h2>books</h2>
      <p>in genre {genre}</p>
      {uniqueGenres.map(genreName => <button key={genreName} onClick={() => handleGenre(genreName)}>{genreName}</button>)}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books