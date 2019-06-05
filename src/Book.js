import $ from "jquery";
import InputCustomized from "./components/InputCustomized"
import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import TracerErrors from "./TracerErrors.1";

class FormBooks extends Component {
  constructor(props) {
    super(props);
    this.state = {titulo: '', preco: '', autorId: ''};
    this.setTitulo = this.setTitulo.bind(this);
    this.setPreco = this.setPreco.bind(this);
    this.setAutorId = this.setAutorId.bind(this);   
    this.handleLivroSubmit = this.handleLivroSubmit.bind(this);
  }

  setTitulo(e) {
    this.setState({titulo: e.target.value});
  }

  setPreco(e) {
    this.setState({preco: e.target.value});
  }

  setAutorId(e) {
    this.setState({autorId: e.target.value});
  }


  handleLivroSubmit(e) {
    e.preventDefault();
    var titulo = this.state.titulo.trim();
    var preco = this.state.preco.trim();
    var autorId = this.state.autorId;

    $.ajax({
      url: 'http://localhost:8080/api/livros',
      contentType: 'application/json',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}),
      success: function(novalistsgem) {
          PubSub.publish( 'atualiza-lists-livros',novalistsgem);            
       },
      error: function(resposta){
        if(resposta.status === 400){
          new TracerErrors().publicaErros(resposta.responseJSON);
        }
      },
      beforeSend: function(){
        PubSub.publish("clear-errors",{});
      }            
    });  

    this.setState({titulo: '', preco: '', autorId: ''});
  }

  render() {
    var authors = this.props.authors.map(function(autor){
      return <option key={autor.id} value={autor.id}>{autor.nome}</option>;
    });
    return (
      <div className="autorForm">
        <form className="pure-form pure-form-aligned" onSubmit={this.handleLivroSubmit}>
          <InputCustomized id="titulo" name="titulo" label="Title: " type="text" value={this.state.titulo} placeholder="Book title" onChange={this.setTitulo} />
          <InputCustomized id="preco" name="preco" label="Price: "    type="decimal" value={this.state.preco} placeholder="Book price" onChange={this.setPreco} />
          <div className="pure-control-group">
            <label htmlFor="autorId">Author: </label>
            <select value={this.state.autorId} name="autorId" onChange={this.setAutorId} Label="Author: ">
              <option value="">Select Author</option>
              {authors}
            </select>
          </div>
          <div className="pure-control-group">                                  
            <label></label> 
            <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
          </div>          
        </form>             
      </div>
    );
  }
} 

class BooksTable extends Component {

  render() {
    var books = this.props.lists.map(function(book){
      return(
          <tr key={book.titulo}>
            <td>{book.titulo}</td>
            <td>{book.autor.nome}</td>
            <td>{book.preco}</td>
          </tr>
        );
      });
    return(
      <table className="pure-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {books}
        </tbody>
      </table>
    );
  }
}

export default class BooksAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {lists : [],authors:[]};
  }

  componentDidMount() {
    $.ajax({
      url: "http://localhost:8080/api/livros",
      dataType: 'json',
      success: function(data) {
        this.setState({lists: data});
      }.bind(this)
    });

    $.ajax({
      url: "http://localhost:8080/api/autores",
      dataType: 'json',
      success: function(data) {
        this.setState({authors: data});
      }.bind(this)
    });

    PubSub.subscribe('atualiza-lists-livros', function(topicName,lists){
      this.setState({lists:lists});
    }.bind(this));    
  }


  render() {
    return(
      <div>
        <div className="header">
          <h1>Form Books</h1>
        </div>
        <div className="content" id="content">
          <FormBooks authors={this.state.authors}/>
          <BooksTable lists={this.state.lists}/>
        </div>
      </div>
    );
  }
}