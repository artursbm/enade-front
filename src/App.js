import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import {API_URL} from './config.js';
import Register from './Register'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      institutions: [],
      courses: [],
      coursesInInstitution: [],
      page: 'institutions'
    }

  }

  componentWillMount() {
    console.log("API_URL", API_URL)
    this.goToInstitutions()
  }

  compareInstitutions(a,b) {
    if (a.global_score < b.global_score)
      return 1;
    if (a.global_score > b.global_score)
      return -1;
    return 0;
  }

  compareCourses(a,b) {
    if (a.score < b.score)
      return 1;
    if (a.score > b.score)
      return -1;
    return 0;
  }
  
  goToInstitutions() {
    axios.get(API_URL + '/institutions').then(res => {
      console.log(res.data.data)
      const inst = res.data.data;
      this.setState({
        institutions: inst.sort(this.compareInstitutions),
        page: 'institutions'

      });
    });
  }
  
  goToCourses() {
    axios.get(API_URL + '/courses').then(res => {
      console.log(res.data.data)
      const courses = res.data.data;
      this.setState({
        courses: courses.sort(this.compareCourses),
        page: 'courses'
      });
    });
  }

  getCoursesByInstitution(id) {
    axios.get(API_URL + '/institutions/' + id + '/courses').then(res => {
      console.log(res.data.data)
      const coursesInInstitution = res.data.data;
      this.setState({
        coursesInInstitution: coursesInInstitution,
        page: 'institutions'
      });
    });
  }

  getInstitutionName(id) {
    var inst = this.state.institutions;
    var institution = inst.filter(obj => {
      return obj.id === id
    });
    console.log("institution", institution)
    return institution[0].name;
  }

  goToRegisterInstitution() {
    this.setState({
      page: 'register'
    })    
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Lista de Notas - Ensino Superior</h1>  
          <div>
          <Button variant="outlined" color="secondary" style={{"marginRight": "10px"}} onClick={() => {this.goToRegisterInstitution()}}>Cadastro</Button>
          <Button variant="outlined" color="secondary" style={{"marginRight": "10px"}} onClick={() => {this.goToInstitutions()}}>Institutições</Button>
          <Button variant="outlined" color="secondary" style={{"marginRight": "10px"}} onClick={() => {this.goToCourses()}}>Cursos</Button>
          </div>        
        </header>
        {
          this.state.page === 'register' ?
            <Register/>
            :
            this.state.page === 'institutions' ? 
            
            <div style={{"position": "absolute", "left": "35%"}}>
              <h2 className="App-intro">
                Lista de instituições:
              </h2>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Nome da Instituição</TableCell>
                      <TableCell numeric>Nota Global</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.institutions.map(row => {
                      return (
                        <TableRow key={row.id}>
                          <TableCell numeric>{row.id}</TableCell>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell numeric>{row.global_score}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </div>
            :
            <div style={{"position": "absolute", "left": "25%"}}>
              <h2 className="App-intro">
                Lista de Cursos:
              </h2>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome do Curso</TableCell>
                      <TableCell numeric>Nota Geral</TableCell>
                      <TableCell numeric>Nota média dos alunos</TableCell>
                      <TableCell numeric>Instituição</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.courses.map(course => {
                      return (
                        <TableRow key={course.id}>
                          <TableCell component="th" scope="course">
                            {course.name}
                          </TableCell>
                          <TableCell numeric>{course.score}</TableCell>
                          <TableCell numeric>{course.student_mean}</TableCell>
                          <TableCell numeric>{this.getInstitutionName(course.institution_id)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </div>
        }
      </div>
    );
  }
}

export default App;
