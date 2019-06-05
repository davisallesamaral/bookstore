import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomized from './components/InputCustomized';
import PubSub from 'pubsub-js';
import TracerErrors from "./TracerErrors";

class FormAuthor extends Component {

  constructor() {
    super();    
    this.state = {nome:'',email:'',senha:''};
    this.sendForm = this.sendForm.bind(this);
  }

  sendForm(event){
    event.preventDefault();    
    $.ajax({
      url:'http://localhost:8080/api/autores',
      contentType:'application/json',
      dataType:'json',
      type:'post',
      data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
      success: function(newlistgem){
        PubSub.publish('update-list-Authores',newlistgem);        
        this.setState({nome:'',email:'',senha:''});
      }.bind(this),
      error: function(answer){
        if(answer.status === 400) {
          new TracerErrors().publicaErros(answer.responseJSON);
        }
      },
      beforeSend: function(){
        PubSub.publish("clear-errors",{});
      }      
    });
  }

  saveUpdate(nomeInput,event){
    var FieldUpdating = {};
    FieldUpdating[nomeInput] = event.target.value;    
    this.setState(FieldUpdating);   
  }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
              <form className="pure-form pure-form-aligned" onSubmit={this.sendForm} method="post">
                <InputCustomized id="nome" type="text" name="nome" value={this.state.nome} onChange={this.saveUpdate.bind(this,'nome')} label="Nome"/>                                              
                <InputCustomized id="email" type="email" name="email" value={this.state.email} onChange={this.saveUpdate.bind(this,'email')} label="Email"/>                                              
                <InputCustomized id="senha" type="password" name="senha" value={this.state.senha} onChange={this.saveUpdate.bind(this,'senha')} label="Senha"/>                                                                      
                <div className="pure-control-group">                                  
                  <label></label> 
                  <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                </div>
              </form>             

            </div>  

        );
    }
}

class TabelaAuthors extends Component {

	render() {
		return(
                    <div>            
                      <table className="pure-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.props.list.map(function(author){
                              return (
                                <tr key={author.id}>
                                  <td>{author.nome}</td>
                                  <td>{author.email}</td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </table> 
                    </div>             		
		);
	}
}

export default class AuthorBox extends Component {

  constructor() {
    super();    
    this.state = {list : []};    
  }

  componentDidMount(){  
    $.ajax({
        url:"http://localhost:8080/api/autores",
        dataType: 'json',
        success:function(answer){    
          this.setState({list:answer});
        }.bind(this)
      } 
    );          

    PubSub.subscribe('update-list-Authores',function(topic,newlist){
      this.setState({list:newlist});
    }.bind(this));
  }   


  render(){
    return (
      <div>
        <div className="header">
          <h1>Form Authors</h1>
        </div>
        <div className="content" id="content">                            
          <FormAuthor/>
          <TabelaAuthors list={this.state.list}/>        
        </div>      

      </div>
    );
  }
}