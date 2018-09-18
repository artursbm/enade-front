import React, { Component } from 'react';
import './Register.css';
import axios from 'axios';
import {API_URL} from './config';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

class Register extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      institutions: [],
      institutionName: "",
      globalScore: "",
      courseName: "",
      courseScore: "",
      studentMeanScore: "",
      institutionId: "",
      page: "register",
      institutionRegistered: false,
      courseRegistered: false
    }
  }
  
  componentWillMount() {
    console.log("API_URL", API_URL)
    console.log("You are in ", this.state.page)
    this.getInstitutions();
  }

  getInstitutions() {
    axios.get(API_URL + '/institutions').then(res => {
      console.log(res.data.data)
      const inst = res.data.data;

      this.setState({
        institutions: inst
      });
    });
  }
  
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  saveInstitution = (data) => {
    const institution = {
      "institution": {
        "name": data.institutionName,
        "global_score": data.globalScore
      }
    };
    console.log("institution being sent", institution)
    axios.post(API_URL + "/institutions", institution).then(res => {
      console.log("Institution saved", institution);
      console.log(res);
      this.setState({
        institutionRegistered: true,
        institutionName: "",
        globalScore: "",
      })
      this.getInstitutions()
    });
  }

  saveCourse = (data) => {
    const course = {
      // "course": {"name": "História", "score": 98.76, "student_mean": 97.44, "institution_id": 3}	
      "course": {
        "name": data.courseName,
        "score": data.courseScore,
        "student_mean": data.studentMeanScore,
        "institution_id": data.institutionId 
      }
    };
    console.log("Course being sent", course)
    axios.post(API_URL + '/courses', course).then(res => {
      console.log("Course Saved.", course);
      console.log(res);
      this.setState({
        courseName: "",
        courseScore: "",
        studentMeanScore: "",
        institutionId: "",
        courseRegistered: true
      })
    })
  }

  
  render() {
    return (
      <div className="Register">
        <h2>Registrar Instituição</h2>
        <form noValidate autoComplete="off">
        <div>
          <TextField
            style={{"marginRight": "10px"}}
            required
            label="Nome da Instituição"
            value={this.state.institutionName}
            onChange={this.handleChange('institutionName')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            required
            label="Nota Global"
            value={this.state.globalScore}
            onChange={this.handleChange('globalScore')}
            margin="normal"
            variant="outlined"
          />
        </div>
        <Button variant="outlined" color="primary" style={{"marginTop": "10px"}} onClick={() => {this.saveInstitution(this.state)}}>Cadastrar Instituição</Button>
      </form>
      {
        this.state.institutionRegistered ?
        <p>Instituição cadastrada.</p>:
        null
      }
      
      <h2>Registrar Curso</h2>
        
        <form noValidate autoComplete="off">
        <div>
          <TextField
            style={{"marginRight": "10px"}}
            required
            label="Nome do Curso"
            value={this.state.courseName}
            onChange={this.handleChange('courseName')}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            style={{"marginRight": "10px"}}
            required
            label="Nota do Curso"
            value={this.state.courseScore}
            onChange={this.handleChange('courseScore')}
            margin="normal"
            variant="outlined"
          />

          <TextField
            style={{"marginRight": "10px"}}
            required
            label="Nota média dos alunos"
            value={this.state.studentMeanScore}
            onChange={this.handleChange('studentMeanScore')}
            margin="normal"
            variant="outlined"
          />

          <TextField
          style={{"marginRight": "10px"}}
          select
          label="Instituição"
          value={this.state.institutionId}
          onChange={this.handleChange('institutionId')}
          helperText="Selecione a instituição"
          margin="normal"
        >
          {this.state.institutions.map(option => (
            <MenuItem style={{"minWidth": "200px"}} key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>

        </div>

        <Button variant="outlined" color="primary" style={{"marginTop": "10px"}} onClick={() => {this.saveCourse(this.state)}}>Cadastrar Curso</Button>

      </form>
      {
        this.state.courseRegistered ?
        <p>Curso cadastrado.</p>:
        null
      }
      </div>
    );
  }
}

export default Register;
