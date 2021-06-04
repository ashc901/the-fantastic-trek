import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
// import messages from '../AutoDismissAlert/messages'

// import UpdateWalk from './../UpdateWalk/UpdateWalk'

class IndexWalks extends Component {
  constructor () {
    super()
    this.state = {
      walks: null
    }
  }
  componentDidMount () {
    console.log('the props', this.props)
    axios({
      method: 'GET',
      url: `${apiUrl}/walks`,
      headers: {
        Authorization: 'Bearer ' + this.props.user.token
      }
    })
      .then((res) => {
        this.setState({ walks: res.data.walks })
      })
      .catch(console.error)
  }
  render () {
    const { walks } = this.state
    if (!walks) {
      return (
        <div>
        Return later when you have started an adventure, you silly billy.
        </div>
      )
    }
    const walksJsx = walks.map(walk => (
      <div key={walk._id} className="row">
        <li>
          <h4>{walk.startPoint} - {walk.endPoint}</h4><br/>
          <p>{walk.distance}</p>
          <Link to={`/walks/${walk._id}`}>Open</Link>
        </li>
      </div>
    ))
    return (
      <div className="col-sm-10 col-md-8 mx-auto mt-5">
        <h3>Your adventures</h3>
        <ul className="walk-list">
          {walksJsx}
        </ul>
      </div>
    )
  }
}
export default IndexWalks
