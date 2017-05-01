import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import Loading from '../widgets/Loading';

export default class MyApps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      isLoaded: false,
      apps: [],
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    fetch('/api/apps')
      .then(res => res.json())
      .then(apps => {
        this.setState({
          apps,
          isLoading: false,
          isLoaded: true,
        });
      });
  }

  render() {
    const { apps, isLoading, isLoaded } = this.state;
    return (
      <div className="container my-5">
        <h2>Apps</h2>
        {isLoading && <Loading/>}
        {isLoaded &&
          <div>
            {apps.map((app, key) =>
              <p key={key}>{app.client_id}</p>
            )}
          </div>
        }
      </div>
    );
  }
};
