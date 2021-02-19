
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { SET_BIRTHDAY, ALL_AUTHORS } from '../queries'
import Select from "react-select";

const Authors = (props) => {
  //const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [selectedOption, setSelectedOption] = useState(null)

  const [setBirthday] = useMutation(SET_BIRTHDAY, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error)
    }
  })

  if (!props.show) {
    return null
  }
  //const authors = []

  const authors = props.authors

  /*react-select--------------------------------------------------------------------------------------------*/
  //https://github.com/JedWatson/react-select
  /*  const options = [
     { value: 'chocolate', label: 'Chocolate' },
     { value: 'strawberry', label: 'Strawberry' },
     { value: 'vanilla', label: 'Vanilla' },
   ]; */

  //This gets the key "name" twice and renames them to match the syntax required for react-select component 
  const options = authors.map(({ name: value, name: label }) => ({ value, label }));

  //This would get the rest of the keys from authors also but only the name is needed like above
  //const options = authors.map(({ name: value, name: label, ...rest }) => ({ value, label, ...rest }));
  /*--------------------------------------------------------------------------------------------------------*/


  console.log(options)

  const handleBirthday = async (event) => {
    event.preventDefault()

    /*  const selectedName = selectedOption.value
     setName(selectedName)
     console.log(name)
     console.log(born)
     console.log(selectedOption.value) */

    const bornInt = parseInt(born)

    setBirthday({ variables: { name: selectedOption.value, setBornTo: bornInt } })

    //setName('')
    setBorn('')

  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      {props.token ? <div>
        <h2>Set birthday</h2>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
        <form onSubmit={handleBirthday}>
          {/* <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div> */}
          <div>
            born
          <input
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button type='submit'>update author</button>
        </form>
      </div>
        : <></>}
    </div>
  )
}

export default Authors
