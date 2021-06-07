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
      show: false
    }
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

      data: { walk: this.state.walk },
      headers: {
        Authorization: 'Bearer ' + this.props.name.user.token
      }
    })
      .then(() => this.props.name.msgAlert({
        heading: 'You\'ve gone so far!',
        message: messages.updateWalkSuccess,
        variant: 'success'
      }))
      .then(() => {
        this.setState({
          // updated: true,
          walk: {
            distance: ''
          }
        })
      })
      .then(() => {
        this.props.update()
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
        <Button onClick={this.changeModal}>Update</Button>
        <Modal show={this.state.show}>
          <Modal.Header>How far have you gone today?</Modal.Header>

          <Form onSubmit={this.handleSubmit}>
            <Modal.Body>
              <Form.Group controlId="distance">
                <Form.Label>Distance</Form.Label>
                <Form.Control
                  required
                  type="number"
                  name="distance"
                  value={this.state.walk.distance}
                  placeholder="Add miles from today"
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
