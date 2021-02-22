import React, { useState } from 'react'
import { USER } from '../queries'
import { useQuery } from '@apollo/client'

const Recommended = ({ show, books }) => {

  const user = useQuery(USER)

  console.log('user', user)



  if (!show) {
    return null
  }

  const recommendeBooks = books.filter(book => book.genres.includes(user.data.me.favoriteGenre))

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{user.data.me.favoriteGenre}</strong></p>
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
          {recommendeBooks.map(a =>
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

export default Recommended