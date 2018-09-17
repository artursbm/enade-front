import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import {API_URL} from './config.js';

class App extends Component {
  state = {
    institutions: [],
    courses: [],
    coursesInInstitution: [],
    page: 'institutions'
  }

  componentWillMount() {
    console.log("API_URL", API_URL)
    this.goToInstitutions()
  }
  goToInstitutions() {
    axios.get(API_URL + '/institutions').then(res => {
      console.log(res.data.data)
      const inst = res.data.data;

      this.setState({
        institutions: inst,
        page: 'institutions'

      });
    });
  }
  
  goToCourses() {
    axios.get(API_URL + '/courses').then(res => {
      console.log(res.data.data)
      const courses = res.data.data;
      this.setState({
        courses: courses,
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Lista de Notas - Educação Superior</h1>          
          <button style={{"color": "red"}} onClick={() => {this.goToInstitutions()}}>Institutições</button>
          <button style={{"color": "red"}} onClick={() => {this.goToCourses()}}>Cursos</button>
        </header>
        {
          this.state.page === 'institutions' ? 
          <div>
            <p className="App-intro">
              Lista inicial de instituições:
            </p>
        
            <ul style={{"position": "relative"}}>
              {
                this.state.institutions ? 
                  this.state.institutions.map(institution => 
                  <li style={{"list-style-type": "none"}} onClick={() => {this.getCoursesByInstitution(institution.id)}}>
                    {institution.name} - {institution.global_score}
                  </li>
                    )
                  :
                  null          
              }
            </ul>
          </div>
          :
          <div>
            <p className="App-intro">
              Lista de Cursos:
            </p>
              <ul style={{"position": "relative"}}>
              {
                this.state.courses ? 
                  this.state.courses.map(course => 
                  <li style={{"list-style-type": "none"}}>
                    {course.name} - {course.score} - {course.student_mean} - {course.institution_id}
                  </li>
                    )
                  :
                  null          
              }
              </ul>
          </div>
        }
      </div>
    );
  }
}

export default App;
