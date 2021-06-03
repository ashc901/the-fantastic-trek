import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import apiUrl from './../../apiConfig'
import axios from 'axios'
import messages from '../AutoDismissAlert/messages'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class CreateWalk extends Component {
  constructor (props) {
    // initializing
    super(props)
    this.state = {
      walk: {
        startPoint: '',
        endPoint: '',
        distance: 0
      },
      createdId: null
    }
  }
  handleChange = (event) => {
    event.persist()
    this.setState((prevState) => {
      const name = event.target.name
      const value = event.target.value
      const updatedValue = { [name]: value }
      return { walk: { ...prevState.walk, ...updatedValue } }
    })
  }
handleSubmit = (event) => {
  event.preventDefault()

  axios({
    method: 'POST',
    url: `${apiUrl}/walks`,
    data: { walk: this.state.walk },
    headers: {
      Authorization: 'Bearer ' + this.props.user.token
    }
  })
    .then((res) => {
      this.setState({ createdId: res.data.walk._id })
    })
    .then(() => this.props.msgAlert({
      heading: 'The adventure begins!',
      message: messages.createWalkSuccess,
      variant: 'success'
    }))

    .catch(error => this.props.msgAlert({
      header: 'Failed with error: ' + error.message,
      message: messages.createWalkFailure,
      variant: 'danger'
    })
    )
  this.setState(state => {
    const updatedWalkState = { walk: {
      ...state.walk,
      ...{
        startPoint: '',
        endPoint: '',
        distance: ''
      }
    } }
    return { walk: updatedWalkState.walk }
  })
}
render () {
  const { startPoint, endPoint, distance } = this.state.walk
  return (
    <div className="row">
      <div className="col-sm-10 col-md-8 mx-auto mt-5">
        <h3>Create Your Adventure</h3>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="startPoint">
            <Form.Label>Start Here</Form.Label>
            <Form.Control
              type="text"
              name="startPoint"
              value={startPoint}
              placeholder="A"
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="endPoint">
            <Form.Label>Destination</Form.Label>
            <Form.Control
              name="endPoint"
              type="text"
              value={endPoint}
              placeholder="B"
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId="distance">
            <Form.Label>Distance</Form.Label>
            <Form.Control
              name="distance"
              type="number"
              value={distance}
              placeholder="x"
              onChange={this.handleChange}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
          >
          Submit
          </Button>
        </Form>
      </div>
    </div>
  )
}
}
export default withRouter(CreateWalk)
