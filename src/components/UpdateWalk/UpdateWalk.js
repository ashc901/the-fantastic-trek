import React, { Component } from 'react'
import messages from '../AutoDismissAlert/messages'
import axios from 'axios'
import apiUrl from './../../apiConfig'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

class UpdateWalk extends Component {
  constructor (props) {
    super(props)
    this.state = {
      walk: {
        startPoint: '',
        endPoint: '',
        distance: ''
      },
      updated: false,
      updatedValue: 0,
      show: false,
      oldWalk: {}
    }
  }
  componentDidMount () {
    axios({
      method: 'GET',
      url: `${apiUrl}/walks/${this.props.value}`,
      headers: {
        Authorization: 'Bearer ' + this.props.name.user.token
      }
    })
      .then(res => {
        this.setState({ oldWalk: res.data.walk })
      })
      .catch(console.error)
  }
  handleChange = (event) => {
    console.log(this.props)
    event.persist()
    this.setState((prevState) => {
      const name = event.target.name
      const value = event.target.value
      const updatedValue = { [name]: value }
      return { walk: { ...prevState.walk, ...updatedValue } }
    })
  }
  changeModal = () => {
    this.setState({ show: !this.state.show })
  }
  handleSubmit = (event) => {
    event.preventDefault()
    axios({
      method: 'PATCH',
      url: `${apiUrl}/walks/${this.props.value}`,
      // you need to talk the old walk you got from the get request and all it
      // to the user input to send back to the API
      data: { walk: this.state.walk },
      headers: {
        Authorization: 'Bearer ' + this.props.name.user.token
      }
    })
      .then((res) => {
        console.log(this.state.oldWalk)
      }
      )
      .then(() => this.props.name.msgAlert({
        heading: 'You\'ve gone so far!',
        message: messages.updateWalkSuccess,
        variant: 'success'
      }))
      .then(() => {
        this.setState({ walk: {
          startPoint: '',
          endPoint: '',
          distance: ''
        }
        })
      })
      .catch(error => this.props.name.msgAlert({
        heading: 'Failed with error: ' + error.message,
        message: messages.updateWalkFailure,
        variant: 'danger'
      }))
  }
  render () {
    return (
      <div className="col-sm-10 col-md-8 mx-auto mt-5">
        <Button onClick={this.changeModal}>Update Adventure</Button>
        <Modal show={this.state.show}>
          <Modal.Header>How fare thee journey?</Modal.Header>

          <Form onSubmit={this.handleSubmit}>
            <Modal.Body>
              <Form.Group controlId="distance">
                <Form.Label>Distance</Form.Label>
                <Form.Control
                  required
                  type="number"
                  name="distance"
                  value={this.state.walk.distance}
                  placeholder="x"
                  onChange={this.handleChange}
                />
              </Form.Group>

            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                type="submit"
              >
              Submit
              </Button>
              <Button onClick={this.changeModal}>Close</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default UpdateWalk