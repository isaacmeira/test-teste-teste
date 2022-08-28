import React, { useState } from 'react';
import * as xlsx from 'xlsx'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import './App.scss';

import { Form } from "@unform/web";
import Input from "./components/Input";

const MySwal = withReactContent(Swal)

function App() {


  const sendError = () => {
    MySwal.fire({
      icon: 'error',
      title: 'Campos vazios',
      text: 'Nome e número do contrato, nao podem estar vazios',
      
    })
  }

  const sendSuccess = () => {
    MySwal.fire({
      icon: 'success',
      title: 'Sucesso !',
      text: 'Arquivo criado com sucesso, verificar pasta de downloads',
      
    })
  }

 
  const [persons, setPersons] = useState([])

  function handleSubmit(data, { reset }) {
    if(data.contrato && data.nome) {
      setPersons([...persons, data])
    } else {
      sendError()
    }
 

    reset();
  }

  const handleRemove = (contrato) => {
    const secondary = [...persons];

    for (let i = 0; i <= secondary.length; i++) {
      if(secondary[i].contrato === contrato) {
        secondary.splice(i, 1)
      }
    }

    MySwal.fire({
      title: 'Tem certeza ?',
      text: "Você não vai conseguir reverter essa ação",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Apagar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deletado!',
          'Registro apagado com sucesso',
          'success'
        )

        setPersons(secondary)
      }
    })
  
  }

  const handleConvert = () => {
    const fileName = 'dados.xlsx';

    const ws = xlsx.utils.json_to_sheet(persons);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'test');

    xlsx.writeFile(wb, fileName, [])

    

    removeAll()
    sendSuccess()
  }

  const removeAll = () => {
    MySwal.fire({
      title: 'Tem certeza ?',
      text: "Você não vai conseguir reverter essa ação",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Apagar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deletado!',
          'Todos os registros apagados com sucesso',
          'success'
        )

        setPersons([])
      }
    })
    
  }

  return (
    <div className="App">
      <div className='data'>
      <h1>Importar dados de cliente para a planilha</h1>
      <Form onSubmit={handleSubmit}>
   
      <Input name="contrato" label="Número do contrato"/>

      <Input name="nome" label="Nome do associado" />
      <Input className="text-large" name="obs" label="Observações" />
     
      
      <button className='submit' type="submit">Adicionar</button>
      </Form>

      <div className='actual-data'>

      <div>
        { persons.length > 0 ? ( <button className='remove' onClick={() => removeAll()} >Apagar tudo</button>) : '' }
      </div>

      { persons.map((person) => ( 
        
        <div key={person.contrato} className='person'>
          <span>{person.contrato}</span>
          <span>{person.nome}</span>
          <button onClick={() => handleRemove(person.contrato)}>X</button>
        </div>
      )) }

      <div className='excel'>
        { persons.length > 0 ? (
          <div>
            <button onClick={() => handleConvert()} >Converter para excel</button>
          </div>
        ) : '' }
        
      </div>
     
    </div>
    </div> 
    </div>
  );
}

export default App;
