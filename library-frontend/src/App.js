
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { useQuery, useApolloClient } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

/* const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }

  return (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  )
} */


const App = () => {
  const [page, setPage] = useState('login')
  const [token, setToken] = useState(null)
  //const [errorMessage, setErrorMessage] = useState(null)

  const allAuthors = useQuery(ALL_AUTHORS)
  console.log('allAuthors', allAuthors)
  const allBooks = useQuery(ALL_BOOKS)
  console.log('allbooks', allBooks)
  //console.log('ALL_AUTHORS', ALL_AUTHORS)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('login')
  }


  if (allAuthors.loading || allBooks.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? <button onClick={() => setPage('add')}>add book</button> : <></>}
        {!token ? <button onClick={() => setPage('login')}>login</button> : <></>}
        {token ? <button onClick={() => logout()}>logout</button> : <></>}
      </div>

      {/* {!token ? <Notify errorMessage={errorMessage}/> : <div></div>} */}

      <Authors
        show={page === 'authors'}
        authors={allAuthors.data.allAuthors}
        token={token}
      />

      <Books
        show={page === 'books'}
        books={allBooks.data.allBooks}
      />

      <NewBook
        show={page === 'add'}
      />

      <Login
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
      />

    </div>
  )
}

export default App