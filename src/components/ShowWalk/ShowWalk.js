import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import messages from '../AutoDismissAlert/messages'
import UpdateWalk from './../UpdateWalk/UpdateWalk'

class ShowWalk extends Component {
  constructor () {
    super()
    this.state = {
      walk: null,
      destroyed: false,
      updated: false
    }
  }
  destroyWalk = (event) => {
    event.preventDefault()
    console.log(this.props.user.token)
    console.log('id', this.props.match.params.id)
    axios({
      method: 'DELETE',
      url: `${apiUrl}/walks/${this.props.match.params.id}`,
      headers: {
        Authorization: 'Bearer ' + this.props.user.token
      }
    })
      .then((res) => {
        this.setState({ destroyed: true })
      })
      .then(() => this.props.msgAlert({
        heading: 'This adventure has been put in the past',
        message: messages.deleteWalkSuccess,
        variant: 'success'
      }))
      .catch(error => this.props.msgAlert({
        heading: 'Failed with error: ' + error.message,
        message: messages.deleteWalkFailure,
        variant: 'danger'
      }))
  }
  componentDidMount () {
    axios({
      method: 'GET',
      url: `${apiUrl}/walks/${this.props.match.params.id}`,
      headers: {
        Authorization: 'Bearer ' + this.props.user.token
      }
    })
      .then(res => {
        this.setState({ walk: res.data.walk })
      })
      .catch(console.error)
  }
  render () {
    const { walk, destroyed } = this.state
    if (destroyed) {
      return <Redirect to='/walks'/>
    }
    return (
      walk !== null
        ? <div>
          <h1>{walk.startPoint}-{walk.endPoint}</h1>
          <h3>{walk.distance} miles</h3>
          <div>
            <Button className="delete" value={walk._id} onClick={this.destroyWalk}>Destroy</Button>
            <UpdateWalk className="update" value={walk._id} name={this.props}/>
          </div>
        </div>
        : <h1></h1>

    )
  }
}
export default ShowWalk
